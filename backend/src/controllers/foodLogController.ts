import { Request, Response } from 'express';
import { query } from '../db'; // Use 'query' from '../db'
import { v4 as uuidv4 } from 'uuid';

interface FoodLogInput {
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  portion?: string;
  unit?: string;
  log_time?: string; // Optional: ISO 8601 format string (e.g., "2024-08-01T10:00:00Z")
  source?: string; // 'manual' or 'photo'
  ai_confidence?: number;
}

// Define an interface for the expected request body structure (optional but good practice)
interface AddFoodLogRequestBody {
  log_date: string; // Expecting YYYY-MM-DD format string
  meal_type?: string;
  food_name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  serving_size?: string;
}

// Define an interface for the expected query parameters (optional but good practice)
interface GetFoodLogsRequestQuery {
  date?: string; // Expecting YYYY-MM-DD format string
}

/**
 * Logs a new food item for the authenticated user.
 */
export const addFoodLog = async (req: Request, res: Response): Promise<void> => {
  // Type assertion for request body
  const { log_date, meal_type, food_name, calories, protein, carbs, fat, serving_size } =
    req.body as AddFoodLogRequestBody;

  // Access user ID via augmented req.user (from types.d.ts)
  const userId = req.user?.id;

  if (!userId) {
    // This case should technically be handled by authenticateToken middleware,
    // but added as a safeguard.
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  if (!log_date || !food_name) {
    res.status(400).json({ message: 'Missing required fields: log_date, food_name' });
    return;
  }

  // Basic validation
  if (calories !== undefined && (typeof calories !== 'number' || calories < 0)) {
    res.status(400).json({ message: 'Calories must be a non-negative number.' });
    return;
  }
  if (protein !== undefined && (typeof protein !== 'number' || protein < 0)) {
    res.status(400).json({ message: 'Protein must be a non-negative number.' });
    return;
  }
  if (carbs !== undefined && (typeof carbs !== 'number' || carbs < 0)) {
    res.status(400).json({ message: 'Carbs must be a non-negative number.' });
    return;
  }
  if (fat !== undefined && (typeof fat !== 'number' || fat < 0)) {
    res.status(400).json({ message: 'Fat must be a non-negative number.' });
    return;
  }
  // Validate date format (basic check)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(log_date)) {
    res.status(400).json({ message: 'Invalid log_date format. Use YYYY-MM-DD.' });
    return;
  }

  const logId = uuidv4();

  try {
    console.log(`[FoodLogController Add]: Adding log for user ${userId}`);
    const result = await query(
      `INSERT INTO food_logs (log_id, user_id, log_date, meal_type, food_name, calories, protein, carbs, fat, serving_size)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
      [
        logId,
        userId,
        log_date,
        meal_type ?? null,
        food_name,
        calories ?? 0,
        protein ?? 0,
        carbs ?? 0,
        fat ?? 0,
        serving_size ?? null,
      ],
    );
    console.log(`[FoodLogController Add]: Log added successfully with ID: ${logId}`);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('[FoodLogController Add]: Error adding food log:', error.message, error.stack);
    // Check for specific database errors if needed (e.g., foreign key constraint)
    res.status(500).json({ message: 'Error adding food log', error: error.message });
  }
};

/**
 * Retrieves food logs for the authenticated user, optionally filtered by date.
 */
export const getFoodLogs = async (req: Request, res: Response): Promise<void> => {
  // Access user ID via augmented req.user
  const userId = req.user?.id;

  if (!userId) {
    // Safeguard
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  // Type assertion for query parameters
  const { date } = req.query as GetFoodLogsRequestQuery;

  try {
    console.log(`[FoodLogController Get]: Fetching logs for user ${userId}`);
    let sqlQuery = 'SELECT * FROM food_logs WHERE user_id = $1';
    const queryParams: any[] = [userId];

    if (date) {
      // Basic validation for date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        return;
      }
      sqlQuery += ' AND log_date = $2';
      queryParams.push(date);
      console.log(`[FoodLogController Get]: Filtering by date: ${date}`);
    }

    sqlQuery += ' ORDER BY log_date DESC, created_at DESC'; // Order by date, then creation time

    const result = await query(sqlQuery, queryParams); // Use 'query'
    console.log(`[FoodLogController Get]: Found ${result.rowCount} logs for user ${userId}`);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('[FoodLogController Get]: Error fetching food logs:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching food logs', error: error.message });
  }
};
