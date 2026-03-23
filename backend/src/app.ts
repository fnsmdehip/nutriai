console.log('[app.ts]: STARTING'); // DEBUG
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Import user routes
import foodLogRoutes from './routes/foodLogRoutes'; // Import food log routes
import aiRoutes from './routes/aiRoutes'; // Import AI routes
import authRoutes from './routes/authRoutes'; // Import Auth routes
import webhookRoutes from './routes/webhookRoutes'; // Import Webhook routes

console.log('[app.ts]: Imports done'); // DEBUG

// Load environment variables
dotenv.config();
console.log('[app.ts]: dotenv configured'); // DEBUG

const app: Express = express();
console.log('[app.ts]: Express app created'); // DEBUG

// Basic Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON bodies
console.log('[app.ts]: Basic middleware applied'); // DEBUG

// --- Add Health Check Route ---
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});
// --- End Health Check Route ---

// --- Add API Routes ---
app.use('/api/v1/auth', authRoutes); // Use auth routes under /api/v1/auth
app.use('/api/v1/users', userRoutes); // Use user routes under /api/v1/users (changed base path)
app.use('/api/v1/food-log', foodLogRoutes); // Use food log routes under /api/v1/food-log
app.use('/api/v1/ai', aiRoutes); // Use AI routes under /api/v1/ai
app.use('/api/v1/webhooks', webhookRoutes); // Webhook routes for RevenueCat + Stripe
// Add other route groups here (e.g., logRoutes)
// --- End API Routes ---

// Placeholder for routes (to be added later) - Can be removed now
// app.get('/', (req: Request, res: Response) => {
//   res.send('Nutri AI Backend is running!');
// });

// Basic Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
