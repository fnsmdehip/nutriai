import { Router } from 'express';
import multer from 'multer';
import { analyzeMealImage } from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for AI-based food recognition from photo upload
// POST /api/v1/ai/analyze-meal
// Expects multipart/form-data with a field named 'image'
router.post('/analyze-meal', authenticateToken, upload.single('image'), analyzeMealImage);

export default router;
