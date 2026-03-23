import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Registration
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    // DEBUG: Log before checking existing user
    console.log(`[AuthController Register]: Checking if user exists with email: ${email}`);
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      console.log(`[AuthController Register]: User found with email: ${email}`); // DEBUG
      return res.status(409).json({ message: 'Email already in use.' });
    }
    console.log(`[AuthController Register]: No existing user found for email: ${email}`); // DEBUG

    // Hash password
    const saltRounds = 6;
    console.log(
      `[AuthController Register]: Hashing password for: ${email} (Salt Rounds: ${saltRounds})`,
    ); // DEBUG
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate a new UUID for the user
    const userId = uuidv4();

    // DEBUG: Log before inserting user
    console.log(
      `[AuthController Register]: Attempting to insert user: ID=${userId}, Email=${email}`,
    );

    // Insert new user with generated ID - MINIMAL COLUMNS
    const newUserResult = await query(
      'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
      [userId, email, passwordHash],
    );
    console.log(`[AuthController Register]: User INSERT query executed.`); // DEBUG

    if (newUserResult.rows.length === 0) {
      console.error('[AuthController Register]: INSERT query returned 0 rows.'); // DEBUG
      throw new Error('User registration failed, INSERT returned no rows.');
    }

    const newUser = newUserResult.rows[0];

    // Generate JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1d',
    }); // Token expires in 1 day

    res.status(201).json({ token, userId: newUser.id, email: newUser.email });
  } catch (error: any) {
    console.error('[AuthController Register]: Caught error during registration.');
    console.error(`[AuthController Register]: Error message: ${error.message}`);
    console.error(`[AuthController Register]: Error stack: ${error.stack}`);
    console.error(`[AuthController Register]: Full error object:`, error);
    res.status(500).json({
      message: 'Internal server error during registration.',
      detail: error.message || 'Unknown error',
    });
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const userResult = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [
      email,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Password doesn't match
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' }); // Token expires in 1 day

    res.status(200).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    console.error('[AuthController Login]:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};
