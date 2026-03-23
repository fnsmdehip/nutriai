import { Router } from 'express';
import { addFoodLog, getFoodLogs } from '../controllers/foodLogController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication middleware individually to each route
// router.use(authenticateToken); // Removed this line

// POST /api/v1/food-log - Add a new food log entry
router.post('/', authenticateToken, addFoodLog);

// GET /api/v1/food-log - Get food log entries for the authenticated user
// Can be filtered by date, e.g., /api/v1/food-log?date=YYYY-MM-DD
router.get('/', authenticateToken, getFoodLogs);

export default router;
