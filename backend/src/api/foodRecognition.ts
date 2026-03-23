import { Request, Response } from 'express';
import axios from 'axios';
import { processImage } from '../utils/imageProcessing';
import { cacheData, getCachedData } from '../utils/cacheManager';

// Define constants for API endpoints
const API_ENDPOINTS = {
  GEMINI_2_5_PRO:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent',
  GEMINI_2_0_FLASH:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  GEMINI_2_0_FLASH_LITE:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-lite:generateContent',
  GEMINI_1_5_FLASH_8B:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent',
};

// Model definitions in priority order (best to fallback)
const MODELS = [
  { endpoint: API_ENDPOINTS.GEMINI_2_5_PRO, name: 'Gemini 2.5 Pro' },
  { endpoint: API_ENDPOINTS.GEMINI_2_0_FLASH, name: 'Gemini 2.0 Flash' },
  { endpoint: API_ENDPOINTS.GEMINI_2_0_FLASH_LITE, name: 'Gemini 2.0 Flash-Lite' },
  { endpoint: API_ENDPOINTS.GEMINI_1_5_FLASH_8B, name: 'Gemini 1.5 Flash-8B' },
];

// Types for food recognition
interface RecognizedFood {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  unit: string;
}

interface RecognitionResult {
  foods: RecognizedFood[];
  processingTime: number;
  modelUsed: string;
}

// Get API key from environment variables
const getApiKey = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error('Google AI API key is not set in environment variables');
    throw new Error('API key not configured');
  }
  return apiKey;
};

// Parse AI response
const parseAiResponse = (response: any): RecognizedFood[] => {
  try {
    // Extract the text content from the response
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('Invalid API response format:', response);
      throw new Error('Invalid API response format');
    }

    // First attempt: Try to extract complete JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let foodData;

    if (jsonMatch) {
      try {
        foodData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Failed to parse full JSON, attempting extraction of partial JSON objects');
      }
    }

    // Second attempt: Look for array of food objects if the main JSON parsing failed
    if (!foodData || !foodData.foods) {
      const arrayMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (arrayMatch) {
        try {
          const possibleFoods = JSON.parse(arrayMatch[0]);
          if (Array.isArray(possibleFoods) && possibleFoods.length > 0) {
            foodData = { foods: possibleFoods };
          }
        } catch (e) {
          console.warn('Failed to parse array of foods:', e);
        }
      }
    }

    // Third attempt: Try to extract individual JSON objects
    if (!foodData || !foodData.foods) {
      const regex = /\{[^{}]*"name"[^{}]*\}/g;
      const matches = responseText.match(regex);

      if (matches && matches.length > 0) {
        const foods = matches
          .map((match: string) => {
            try {
              return JSON.parse(match);
            } catch (e) {
              return null;
            }
          })
          .filter((food: any) => food !== null);

        if (foods.length > 0) {
          foodData = { foods };
        }
      }
    }

    // If all parsing attempts failed, return empty array
    if (!foodData || !foodData.foods || !Array.isArray(foodData.foods)) {
      console.error('Failed to parse food data from response');
      return [];
    }

    // Validate and standardize each food entry
    return foodData.foods.map((food: any) => ({
      name: food.name || 'Unknown food',
      confidence: food.confidence || 0.8,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      portion: food.portion || 'serving',
      unit: food.unit || 'g',
    }));
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return [];
  }
};

// Call AI model with fallback mechanism
const callAiModelWithFallback = async (imageData: string): Promise<RecognitionResult> => {
  const startTime = Date.now();
  const apiKey = getApiKey();

  // Check cache first
  const cacheKey = `img_${imageData.slice(0, 50)}`;
  const cachedResult = await getCachedData(cacheKey);

  if (cachedResult) {
    console.log('Using cached food recognition result');
    return {
      ...cachedResult,
      processingTime: 0.1, // Fast response from cache
    };
  }

  let lastError: Error | null = null;

  // Try each model in sequence until one succeeds
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model.name}`);

      // Create the request with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await axios.post(
        `${model.endpoint}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: 'Identify the food items in this image and provide nutritional information including calories, protein, carbs, and fat. Format the response as a structured JSON array of food objects with the following properties: name (string), calories (number), protein (number), carbs (number), fat (number), portion (string), unit (string), and confidence (number between 0 and 1).',
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageData,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.9,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        },
      );

      // Clear the timeout
      clearTimeout(timeoutId);

      // Parse the response
      const foods = parseAiResponse(response.data);

      // Calculate processing time
      const processingTime = (Date.now() - startTime) / 1000;

      // Create result
      const result: RecognitionResult = {
        foods,
        processingTime,
        modelUsed: model.name,
      };

      // Cache the result
      await cacheData(cacheKey, result, 60 * 60 * 24); // Cache for 24 hours

      console.log(`Food recognition successful with ${model.name}`);
      return result;
    } catch (error) {
      console.error(`Error with ${model.name}:`, error);
      lastError = error as Error;
      // Continue to next model
    }
  }

  // If we get here, all models failed
  throw lastError || new Error('Food recognition failed with all available models');
};

// Handler for food recognition endpoint
export const recognizeFood = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Process the image (resize, optimize)
    const processedImage = await processImage(image);

    // Call AI with the processed image
    const result = await callAiModelWithFallback(processedImage);

    res.status(200).json(result);
  } catch (error) {
    console.error('Food recognition error:', error);
    res.status(500).json({
      error: 'Food recognition failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Export the handler
export default {
  recognizeFood,
};
