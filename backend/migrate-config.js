require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL, // Prefer DATABASE_URL if set
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost', // Default to localhost for local runs
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'nutridb',
  migrationsTable: 'pgmigrations',
  dir: 'migrations',
  direction: 'up',
  count: Infinity,
  // Add SSL config if needed for remote DB
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
