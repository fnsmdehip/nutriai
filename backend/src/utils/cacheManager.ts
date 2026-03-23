import { createClient } from 'redis';
import { promisify } from 'util';

// Create Redis client (will use environment variables)
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url: redisUrl });

// Connect to Redis
client.on('error', err => console.error('Redis client error:', err));
client.on('connect', () => console.log('Connected to Redis cache'));

// Connect to Redis only in production
if (process.env.NODE_ENV === 'production') {
  client.connect().catch(err => {
    console.error('Redis connection error:', err);
    console.log('Continuing without Redis cache in production');
  });
} else {
  console.log('Running in development mode - using in-memory cache instead of Redis');
}

// In-memory cache for development or fallback
const memoryCache: Record<string, { data: any; expiry: number }> = {};

/**
 * Store data in cache
 * @param key Cache key
 * @param data Data to cache
 * @param ttlSeconds Time to live in seconds
 */
export const cacheData = async (key: string, data: any, ttlSeconds: number): Promise<void> => {
  try {
    // First try Redis if connected
    if (client.isOpen) {
      await client.set(key, JSON.stringify(data), { EX: ttlSeconds });
      return;
    }

    // Fallback to in-memory cache
    memoryCache[key] = {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    };

    // Clean up expired items occasionally
    if (Math.random() < 0.1) {
      // 10% chance on each cache operation
      cleanMemoryCache();
    }
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

/**
 * Retrieve data from cache
 * @param key Cache key
 * @returns Cached data or null if not found
 */
export const getCachedData = async (key: string): Promise<any | null> => {
  try {
    // First try Redis if connected
    if (client.isOpen) {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    }

    // Fallback to in-memory cache
    const cached = memoryCache[key];
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    // Remove expired item if found
    if (cached) {
      delete memoryCache[key];
    }

    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Clean up expired items from memory cache
 */
const cleanMemoryCache = (): void => {
  const now = Date.now();
  Object.keys(memoryCache).forEach(key => {
    if (memoryCache[key].expiry < now) {
      delete memoryCache[key];
    }
  });
};

// Export the cache interface
export default {
  cacheData,
  getCachedData,
};
