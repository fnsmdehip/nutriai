import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from environment if available (preferable for production/Docker)
// Otherwise, construct from individual variables (useful for local testing outside Docker)
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}`;

// DEBUG: Log the connection string being used
console.log(`[database]: Using connection string: ${connectionString}`);

if (!connectionString) {
  console.error(
    'FATAL ERROR: Database connection string is not configured. Set DATABASE_URL or individual POSTGRES_* variables.',
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  // Add SSL configuration if required for DigitalOcean managed database
  // ssl: {
  //   rejectUnauthorized: false // Adjust as necessary, consider using CA cert
  // }
});

pool.on('connect', () => {
  console.log('[database]: Pool emitted connect event.');
});

pool.on('error', err => {
  console.error('[database]: Unexpected pool error', err);
  // Avoid exiting immediately on pool error, let individual queries handle it
  // process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
