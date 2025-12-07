'use server';

import { Redis } from '@upstash/redis';
import 'dotenv/config';

// Initialize Redis client once and export it for reuse.
// This is more efficient than creating a new connection every time.
export const redis = Redis.fromEnv();