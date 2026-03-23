import { Router, RequestHandler } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', registerUser as RequestHandler);

// POST /api/v1/auth/login
router.post('/login', loginUser as RequestHandler);

export default router;
