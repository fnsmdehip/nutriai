import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined for auth middleware.');
  // Let requests fail later if secret is missing
}

// Define the structure of our JWT payload
interface JwtPayload {
  id: string; // Assuming user ID is stored in 'id' field of JWT
  email?: string; // Optional: email might also be in the payload
  // Add other fields if included during signing
}

// Global declaration moved to types.d.ts
// --- REMOVED DECLARATION ---
// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload; // Use the specific payload type
//     }
//   }
// }
// --- END REMOVED DECLARATION ---

// JWT Verification Middleware (Refactored to be async and handle errors correctly)
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Authentication token required.' });
    return; // Stop execution
  }

  if (!JWT_SECRET) {
    console.error('[authMiddleware]: JWT_SECRET is missing, cannot verify token.');
    res.status(500).json({ message: 'Server configuration error.' });
    return; // Stop execution
  }

  try {
    // Verify the token synchronously (verify throws on error)
    const decoded = jwt.verify(token, JWT_SECRET);

    // Assign the payload to req.user (type is augmented via global declaration)
    // We need to assert the type of decoded here as verify returns JwtPayload | string
    if (typeof decoded === 'string') {
      // This case should not happen with standard JWTs but handle defensively
      throw new Error('Invalid JWT payload type.');
    }
    req.user = decoded as JwtPayload;
    next(); // Proceed to the next middleware or route handler
  } catch (err: any) {
    console.error('[authMiddleware]: JWT verification failed:', err.message);
    // Send appropriate error response based on error type
    if (err instanceof jwt.TokenExpiredError) {
      res.status(403).json({ message: 'Token expired.' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: 'Invalid token.' });
    } else {
      res.status(500).json({ message: 'Internal server error during token verification.' });
    }
    // Do NOT call next() here
  }
};
