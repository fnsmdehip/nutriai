import { Router } from 'express';
import {
  // syncUser, // Removed as it was Firebase-specific
  getMyProfile,
  updateUserProfile,
  getMyPlan,
  getSubscriptionStatus,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Route to synchronize Firebase user with local DB (e.g., call after Firebase sign-in on client)
// This implicitly handles signup/login persistence on the backend.
// @ts-ignore Ignore handler type mismatch
// router.post('/auth/sync', authenticateToken, syncUser); // REMOVED

// Route to get the current user's profile
// @ts-ignore Ignore handler type mismatch
router.get('/users/me', authenticateToken, getMyProfile);

// Route to update the current user's profile (handles onboarding data submission)
// @ts-ignore Ignore handler type mismatch
router.put('/users/me/profile', authenticateToken, updateUserProfile);

// Route to get the current user's plan
// @ts-ignore Ignore handler type mismatch
router.get('/users/me/plan', authenticateToken, getMyPlan);

// Route to get the current user's subscription status
// @ts-ignore Ignore handler type mismatch
router.get('/users/me/subscription', authenticateToken, getSubscriptionStatus);

// Add other user-related routes here (e.g., PUT /users/me/profile)

export default router;
