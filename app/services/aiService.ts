import { Platform } from 'react-native';
import {
  GOOGLE_AI_API_KEY,
  GEMINI_PRO_API_ENDPOINT,
  GEMINI_FLASH_API_ENDPOINT,
  GEMINI_FLASH_LITE_API_ENDPOINT,
} from '@env';

// Types for food recognition
export interface RecognizedFood {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  unit: string;
}

export interface RecognitionResult {
  foods: RecognizedFood[];
  processingTime: number;
  modelUsed: string;
}

export interface TextGenerationResult {
  text: string;
  processingTime: number;
  modelUsed: string;
}

// Constants for API endpoints and models
const API_ENDPOINTS = {
  GEMINI_2_5_PRO:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent',
  GEMINI_2_0_FLASH:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  GEMINI_2_0_FLASH_LITE:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-lite:generateContent',
  GEMINI_1_5_FLASH_8B:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent',
  GEMINI_PRO: GEMINI_PRO_API_ENDPOINT,
  GEMINI_FLASH: GEMINI_FLASH_API_ENDPOINT,
  GEMINI_FLASH_LITE: GEMINI_FLASH_LITE_API_ENDPOINT,
};

// Get API key from environment variables
const getApiKey = () => {
  if (!GOOGLE_AI_API_KEY) {
    console.error('Google AI API key is not set in environment variables');
  }
  return GOOGLE_AI_API_KEY;
};

// Model definitions in priority order (best to fallback)
const MODELS = [
  { endpoint: API_ENDPOINTS.GEMINI_2_5_PRO, name: 'Gemini 2.5 Pro' },
  { endpoint: API_ENDPOINTS.GEMINI_2_0_FLASH, name: 'Gemini 2.0 Flash' },
  { endpoint: API_ENDPOINTS.GEMINI_2_0_FLASH_LITE, name: 'Gemini 2.0 Flash-Lite' },
  { endpoint: API_ENDPOINTS.GEMINI_1_5_FLASH_8B, name: 'Gemini 1.5 Flash-8B' },
  { endpoint: API_ENDPOINTS.GEMINI_PRO, name: 'Gemini 1.5 Pro' },
  { endpoint: API_ENDPOINTS.GEMINI_FLASH, name: 'Gemini 1.5 Flash' },
  { endpoint: API_ENDPOINTS.GEMINI_FLASH_LITE, name: 'Gemini 1.0 Pro' },
];

/**
 * Optimizes an image for processing by resizing and compressing it
 * Also handles fetching remote images and converting to base64
 * @param imageUri The URI of the image to process
 * @returns The optimized image data as a base64 string
 */
const optimizeImage = async (imageUri: string): Promise<string> => {
  try {
    console.log(`Processing image from URL: ${imageUri}`);

    // Fetch the image from the URL
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Convert image to blob
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove data URL prefix to get just the base64 content
        const base64Content = base64data.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error('Error optimizing image:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

/**
 * Tests the text generation capabilities of various AI models
 * @param prompt The text prompt to send to the models
 * @param specificModel Optional name of a specific model to test
 * @returns Text generation result
 */
export const testModelWithText = async (
  prompt: string,
  specificModel?: string,
): Promise<TextGenerationResult> => {
  const startTime = Date.now();

  // Filter models based on specificModel parameter if provided
  const modelsToTest = specificModel
    ? MODELS.filter(model => model.name === specificModel)
    : MODELS;

  if (modelsToTest.length === 0) {
    throw new Error(`Model ${specificModel} not found`);
  }

  let result: string | null = null;
  let modelUsed = '';

  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: ${model.name}`);
      const responseText = await callAiModelForText(prompt, model.endpoint);
      result = responseText;
      modelUsed = model.name;
      break;
    } catch (error) {
      console.log(`Error with ${model.name}:`, error);
      // Continue to next model if not testing a specific model
      if (specificModel) {
        throw error;
      }
    }
  }

  if (!result) {
    throw new Error('Text generation failed with all available models');
  }

  const processingTime = (Date.now() - startTime) / 1000; // in seconds

  return {
    text: result,
    processingTime,
    modelUsed,
  };
};

/**
 * Calls the AI model with a text prompt only
 * @param prompt The text prompt to send
 * @param endpoint The API endpoint for the model
 * @returns The generated text
 */
const callAiModelForText = async (prompt: string, endpoint: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    console.log(`Calling ${endpoint} with API key: ${apiKey.substring(0, 5)}...`);

    // Make API call to the model
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Invalid API response format');
    }

    return responseText;
  } catch (error: any) {
    console.error('Error calling AI model for text:', error);
    throw error;
  }
};

/**
 * Recognizes food in an image using a tiered approach with Google AI models
 * Falls back to less powerful models if more powerful ones fail or are unavailable
 * @param imageUri The URI of the image to process
 * @returns Recognition result with food items and nutritional information
 */
export const recognizeFood = async (imageUri: string): Promise<RecognitionResult> => {
  const startTime = Date.now();
  const optimizedImage = await optimizeImage(imageUri);

  let result: RecognitionResult | null = null;
  let modelUsed = '';

  for (const model of MODELS) {
    try {
      result = await callAiModel(optimizedImage, model.endpoint);
      modelUsed = model.name;
      break;
    } catch (error) {
      console.log(`Error with ${model.name}:`, error);
      // Continue to next model
    }
  }

  if (!result) {
    throw new Error('Food recognition failed with all available models');
  }

  const processingTime = (Date.now() - startTime) / 1000; // in seconds

  return {
    ...result,
    processingTime,
    modelUsed,
  };
};

/**
 * Calls the specified AI model endpoint to analyze food in an image
 * @param imageData The image data to process
 * @param endpoint The API endpoint for the model
 * @returns Recognition result with food items
 */
const callAiModel = async (imageData: string, endpoint: string): Promise<RecognitionResult> => {
  try {
    const apiKey = getApiKey();
    console.log(`Calling ${endpoint} with API key: ${apiKey.substring(0, 5)}...`);

    // Make actual API call to the model
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Identify the food items in this image and provide nutritional information including calories, protein, carbs, and fat. Format the response as a structured JSON object.',
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageData, // base64 encoded image
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return parseAiResponse(data);
  } catch (error) {
    console.error('Error calling AI model:', error);
    throw error;
  }
};

/**
 * Parses the AI model response to extract structured food information
 * @param response The raw response from the AI model
 * @returns Structured food recognition results
 */
const parseAiResponse = (response: any): RecognitionResult => {
  try {
    // Extract the text content from the response
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Invalid API response format');
    }

    // Try to extract JSON from the response text
    // The model might respond with text that contains JSON, so we need to try to extract it
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let foodData;

    if (jsonMatch) {
      // Try parsing the JSON directly
      try {
        foodData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Failed to parse JSON directly from response');
      }
    }

    // If we couldn't extract JSON, try to parse the text response manually
    if (!foodData) {
      // Basic parsing logic for text-based responses
      const foods = [];

      // Simple regex-based extraction for food items
      const foodMatches = responseText.matchAll(/([A-Za-z\s]+)[\s\-:]+(\d+)\s*calories/g);

      for (const match of foodMatches) {
        foods.push({
          name: match[1].trim(),
          confidence: 0.8, // Default confidence
          calories: parseInt(match[2]),
          protein: 0, // Default values
          carbs: 0,
          fat: 0,
          portion: '1',
          unit: 'serving',
        });
      }

      foodData = { foods };
    }

    // If we have food data, transform it into our expected format
    if (foodData && Array.isArray(foodData.foods)) {
      return {
        foods: foodData.foods.map((food: any) => ({
          name: food.name || 'Unknown Food',
          confidence: food.confidence || 0.8,
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          portion: food.portion || '1',
          unit: food.unit || 'serving',
        })),
        processingTime: 0,
        modelUsed: '',
      };
    }

    throw new Error('Failed to parse food data from response');
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      foods: [],
      processingTime: 0,
      modelUsed: '',
    };
  }
};

export default {
  recognizeFood,
  testModelWithText,
};
