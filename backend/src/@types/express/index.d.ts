// backend/src/@types/express/index.d.ts

declare global {
  // Define the structure of our JWT payload (can be imported or redefined if needed elsewhere)
  interface JwtPayload {
    id: string;
    email?: string;
    // Add other fields if included during signing
  }

  // Augment the Express Request interface
  namespace Express {
    export interface Request {
      user?: JwtPayload; // Use the specific payload type
    }
  }
}

// Export something to make it a module (optional, but good practice)
export {};
