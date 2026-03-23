import { Request, Response } from 'express';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
  Content,
  Part,
} from '@google/generative-ai';

// --- Configuration ---
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL_NAME = 'gemini-1.5-flash-latest'; // Or cycle through based on PRD

if (!GEMINI_API_KEY) {
  console.error('FATAL ERROR: GOOGLE_AI_API_KEY is not defined.');
  // Avoid exiting immediately, but endpoint will fail
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Consider making safety settings and generation config more adjustable
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const generationConfig: GenerationConfig = {
  temperature: 0.4,
  topK: 32,
  topP: 1,
  maxOutputTokens: 8192,
  // responseMimeType: "application/json", // Use if JSON output is desired and model supports it
};

// --- Helper Functions ---

// Converts image buffer to Google AI API format
function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

// --- Controller Logic ---

export const analyzeMealImage = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  if (!GEMINI_API_KEY) {
    console.error('[aiController]: Missing GOOGLE_AI_API_KEY at request time.');
    res.status(500).json({ message: 'AI service configuration error.' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: 'No image file uploaded.' });
    return;
  }

  const imageBuffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    res.status(400).json({ message: 'Invalid image format. Please upload JPEG, PNG, or WebP.' });
    return;
  }

  console.log(
    `[aiController]: Analyzing image for user ${userId}, mimeType: ${mimeType}, size: ${imageBuffer.length}`,
  );

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_NAME,
      safetySettings,
      generationConfig,
    });

    const imagePart: Part = fileToGenerativePart(imageBuffer, mimeType);
    const textPart: Part = {
      text: `Analyze the food items in this image. For each distinct food item detected, provide:\n1.  Food Name (e.g., "Banana", "Scrambled Eggs")\n2.  Estimated Portion Size (e.g., "1 medium", "1 cup", "100g")\n3.  Estimated Nutritional Information (Calories, Protein (g), Carbohydrates (g), Fat (g))\n\nIf multiple items are present, list each one clearly.\nIf unsure about an item or its nutrition, state that clearly.\nFormat the response as a JSON object with a key "foods" containing an array of food item objects.\nExample food item object: { "name": "Apple", "portion": "1 medium", "calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3 }`,
    };

    // Construct the prompt correctly using Content[] and Part[]
    const requestPayload: Content[] = [
      { role: 'user', parts: [textPart, imagePart] }, // Combine text and image parts for the user role
    ];

    console.log(`[aiController]: Sending request to Gemini model: ${GEMINI_MODEL_NAME}`);
    // Pass the Content[] array directly
    const result = await model.generateContent({ contents: requestPayload });

    console.log(`[aiController]: Received response from Gemini.`);
    const response = result.response;

    if (
      !response ||
      !response.candidates ||
      response.candidates.length === 0 ||
      !response.candidates[0].content ||
      !response.candidates[0].content.parts || // Check parts exist
      response.candidates[0].content.parts.length === 0
    ) {
      console.error(
        '[aiController]: Invalid or empty response from Gemini:',
        JSON.stringify(response, null, 2),
      );
      res.status(500).json({ message: 'AI analysis failed: No content received.' });
      return; // Ensure void return
    }

    // Check for safety blocks
    if (response.candidates[0].finishReason && response.candidates[0].finishReason !== 'STOP') {
      console.warn(
        `[aiController]: Gemini response finished due to reason: ${response.candidates[0].finishReason}`,
      );
      if (response.promptFeedback?.blockReason) {
        res.status(400).json({
          message: `AI analysis blocked due to safety settings: ${response.promptFeedback.blockReason}`,
        });
        return; // Ensure void return
      }
      res
        .status(500)
        .json({ message: `AI analysis incomplete: ${response.candidates[0].finishReason}` });
      return; // Ensure void return
    }

    const analysisText = response.candidates[0].content.parts[0].text;
    console.log(
      `[aiController]: Gemini analysis text received (length: ${analysisText?.length || 0})`,
    );

    // Attempt to parse the JSON response from the text
    try {
      // Basic cleanup: Remove potential markdown code fences
      const cleanedText = analysisText?.replace(/```json\n?|```/g, '').trim() || '';
      const analysisJson = JSON.parse(cleanedText);
      console.log('[aiController]: Successfully parsed JSON response from Gemini.');
      res.status(200).json(analysisJson);
    } catch (parseError: any) {
      console.error(
        '[aiController]: Failed to parse JSON response from Gemini:',
        parseError.message,
      );
      console.error('[aiController]: Raw Gemini text:', analysisText);
      // Send back the raw text if JSON parsing fails, or a generic error
      res.status(500).json({
        message: 'AI analysis completed, but failed to parse results.',
        raw_text: analysisText,
      });
    }
  } catch (error: any) {
    console.error('[aiController]: Error during AI image analysis:', error.message, error.stack);
    res.status(500).json({ message: 'Error analyzing meal image', error: error.message });
  }
};
