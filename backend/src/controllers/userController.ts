import { Request, Response } from 'express';
import { query } from '../db'; // Assuming db connection setup exports a query function
// import admin from '../services/firebase'; // REMOVED Firebase import
import { calculateNutritionalPlan } from '../services/calculationService'; // Import calculation service

// Interface for user data (UPDATED to match migration)
interface UserProfile {
  id: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other'; // Added type safety based on calculation input
  dob?: string; // Expecting 'YYYY-MM-DD' format from client
  height_cm?: number;
  weight_kg?: number; // Using number here, but DB is decimal
  workout_frequency?: string;
  attribution?: string;
  goal?: 'Lose weight' | 'Maintain' | 'Gain weight'; // Added type safety
  diet_type?: string;
  obstacles?: string[]; // Array of strings
  personal_aims?: string[]; // Array of strings
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Handles the synchronization of Firebase user data with the local database.
 * Finds or creates a user record based on the Firebase UID.
 */
// TODO: Refactor or remove this? Syncing is less relevant without Firebase Auth.
// export const syncUser = async (req: Request, res: Response): Promise<void> => {
//   const firebaseUser = req.user;
//   if (!firebaseUser || !firebaseUser.uid || !firebaseUser.email) {
//     res.status(400).json({ message: 'Firebase user data missing from request.' });
//     return;
//   }
//   const { uid, email } = firebaseUser;

//   try {
//     let userResult = await query('SELECT * FROM users WHERE id = $1', [uid]);
//     let user: UserProfile | null = userResult.rows[0] || null;

//     if (!user) {
//       console.log(`[UserController]: Creating new user for uid: ${uid}`);
//       const insertResult = await query(
//         'INSERT INTO users (id, email) VALUES ($1, $2) RETURNING *',
//         [uid, email],
//       );
//       user = insertResult.rows[0];
//     } else {
//       if (user.email !== email) {
//         console.log(`[UserController]: Updating email for user uid: ${uid}`);
//         await query('UPDATE users SET email = $1 WHERE id = $2', [email, uid]);
//         user.email = email;
//       }
//       console.log(`[UserController]: User already exists for uid: ${uid}`);
//     }

//     const { created_at, updated_at, ...userProfile } = user || {};
//     res.status(200).json(userProfile);
//     return;
//   } catch (error) {
//     console.error('[UserController]: Error syncing user:', error);
//     res.status(500).json({ message: 'Internal server error during user sync.' });
//     return;
//   }
// };

/**
 * Fetches the profile of the currently authenticated user.
 */
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.user as { id: string };

  if (!userId) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
    const user: UserProfile | null = userResult.rows[0] || null;

    if (!user) {
      res.status(404).json({ message: 'User profile not found.' });
      return;
    }
    const { created_at, updated_at, ...userProfile } = user;
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('[UserController]: Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error fetching profile.' });
  }
};

/**
 * Updates the profile of the currently authenticated user.
 * Handles partial updates for onboarding and profile settings.
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.user as { id: string };

  if (!userId) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  const {
    gender,
    dob,
    height_cm,
    weight_kg,
    workout_frequency,
    attribution,
    goal,
    diet_type,
    obstacles,
    personal_aims,
  } = req.body;

  // --- Input Validation (Basic Example) ---
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    res.status(400).json({ message: 'Invalid date format for dob. Use YYYY-MM-DD.' });
    return;
  }
  if (height_cm !== undefined && typeof height_cm !== 'number') {
    res.status(400).json({ message: 'height_cm must be a number.' });
    return;
  }
  if (weight_kg !== undefined && typeof weight_kg !== 'number') {
    res.status(400).json({ message: 'weight_kg must be a number.' });
    return;
  }
  if (obstacles !== undefined && !Array.isArray(obstacles)) {
    res.status(400).json({ message: 'obstacles must be an array of strings.' });
    return;
  }
  if (personal_aims !== undefined && !Array.isArray(personal_aims)) {
    res.status(400).json({ message: 'personal_aims must be an array of strings.' });
    return;
  }
  // Add more validation as needed (e.g., checking enum values)
  // --- End Input Validation ---

  const fieldsToUpdate: { [key: string]: any } = {};
  if (gender !== undefined) fieldsToUpdate.gender = gender;
  if (dob !== undefined) fieldsToUpdate.dob = dob;
  if (height_cm !== undefined) fieldsToUpdate.height_cm = height_cm;
  if (weight_kg !== undefined) fieldsToUpdate.weight_kg = weight_kg;
  if (workout_frequency !== undefined) fieldsToUpdate.workout_frequency = workout_frequency;
  if (attribution !== undefined) fieldsToUpdate.attribution = attribution;
  if (goal !== undefined) fieldsToUpdate.goal = goal;
  if (diet_type !== undefined) fieldsToUpdate.diet_type = diet_type;
  if (obstacles !== undefined) fieldsToUpdate.obstacles = obstacles;
  if (personal_aims !== undefined) fieldsToUpdate.personal_aims = personal_aims;

  if (Object.keys(fieldsToUpdate).length === 0) {
    res.status(400).json({ message: 'No valid fields provided for update.' });
    return;
  }

  const setClause = Object.keys(fieldsToUpdate)
    .map((key, index) => `"${key}" = $${index + 2}`)
    .join(', ');
  const values = Object.values(fieldsToUpdate);

  const updateQuery = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;

  try {
    const result = await query(updateQuery, [userId, ...values]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found for update.' });
      return;
    }
    const { created_at, updated_at, ...updatedProfile } = result.rows[0];
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('[UserController]: Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error updating profile.' });
  }
};

/**
 * Calculates and returns the nutritional plan for the currently authenticated user.
 */
export const getMyPlan = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.user as { id: string };

  if (!userId) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    // 1. Fetch the user's profile data needed for calculation
    const userResult = await query(
      'SELECT gender, dob, height_cm, weight_kg, workout_frequency, goal FROM users WHERE id = $1',
      [userId],
    );
    const userData = userResult.rows[0];

    if (!userData) {
      res.status(404).json({ message: 'User profile not found.' });
      return;
    }

    // 2. Check if all required data is present
    const requiredFields: (keyof UserProfile)[] = [
      'gender',
      'dob',
      'height_cm',
      'weight_kg',
      'goal',
    ]; // workout_frequency is optional in calc
    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        message: 'Incomplete profile data required for plan calculation.',
        missingFields: missingFields,
      });
      return;
    }

    // 3. Prepare input for calculation service (ensure types match)
    const calculationInput = {
      gender: userData.gender as 'Male' | 'Female' | 'Other',
      weight_kg: parseFloat(userData.weight_kg), // DB stores decimal, convert to number
      height_cm: userData.height_cm,
      dob: userData.dob, // Assuming dob is stored as 'YYYY-MM-DD' string or can be converted
      workout_frequency: userData.workout_frequency,
      goal: userData.goal as 'Lose weight' | 'Maintain' | 'Gain weight',
      // activity_level_multiplier is handled within the service based on workout_frequency
    };

    // 4. Call the calculation service
    const plan = calculateNutritionalPlan(calculationInput);

    // 5. Return the calculated plan
    res.status(200).json(plan);
  } catch (error) {
    console.error('[UserController]: Error calculating nutritional plan:', error);
    res.status(500).json({ message: 'Internal server error calculating plan.' });
  }
};

/**
 * Gets the subscription status of the current user.
 */
export const getSubscriptionStatus = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.user as { id: string };

  if (!userId) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    // Get subscription status from database
    const subscriptionResult = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId],
    );
    const subscription = subscriptionResult.rows[0];

    // For demo, returning mock data for now with subscription status
    res.status(200).json({
      isSubscribed: !!subscription,
      subscription: subscription || null,
      // Include additional subscription details as needed
      trialEligible: !subscription, // Only eligible if no subscription exists
    });
  } catch (error) {
    console.error('[UserController]: Error fetching subscription status:', error);
    res.status(500).json({ message: 'Internal server error fetching subscription status.' });
  }
};
