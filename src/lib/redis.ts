import { Redis } from '@upstash/redis';

// Check for environment variables and provide a clear error message if they are missing.
// This is crucial for environments like Vercel where `.env.local` is not used.
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    'Missing Upstash Redis credentials. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment variables. If you are deploying to Vercel, add them to your project settings.'
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
