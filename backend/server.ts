import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import apiRoutes from './src/api/routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Basic Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with increased limit for images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security-related HTTP headers
app.use(compression()); // Compress responses

// Root health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
