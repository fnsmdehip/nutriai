import { Router } from 'express';
import foodRecognition from './foodRecognition';
import { createNutritionPlan } from './nutritionPlan';
import { getScientificSources } from './scientificSources';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Food recognition route
router.post('/recognize-food', foodRecognition.recognizeFood);

// Nutrition plan routes
router.post('/create-plan', createNutritionPlan);

// Scientific sources route
router.get('/scientific-sources', getScientificSources);

export default router;
