import { Redis } from '@upstash/redis';

// Initialize Redis client once and export it for reuse.
// This is more efficient than creating a new connection every time.
export const redis = Redis.fromEnv();
