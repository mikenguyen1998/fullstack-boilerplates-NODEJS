/**
 * ============================================================================
 *  OPTIONAL: Redis with ioredis (commented out — not used by default)
 * ============================================================================
 *
 * Typical uses: caching, shared rate-limit store, queues (BullMQ).
 *
 * How to enable:
 *   1. npm install ioredis
 *   2. Add to .env:              REDIS_URL=redis://localhost:6379
 *   3. Add to src/config/env.ts: REDIS_URL: z.string().url(),
 *   4. Rename this file to `redis.ts`, un-comment, wire into src/database/index.ts
 *   5. (docker-compose) un-comment the `redis` service.
 *
 * Shared rate-limit store: npm install rate-limit-redis, then in rate-limit.ts:
 *   store: new RedisStore({ sendCommand: (...args: string[]) => redis.call(...args) })
 */

// import { Redis } from 'ioredis';
//
// import { env } from '@/config/env.js';
// import { logger } from '@/config/logger.js';
//
// export const redis = new Redis(env.REDIS_URL, {
//   lazyConnect: true,
//   maxRetriesPerRequest: 3,
//   enableReadyCheck: true,
// });
//
// redis.on('error', (err) => logger.error({ err }, 'Redis error'));
//
// export async function connectRedis(): Promise<void> {
//   await redis.connect();
//   logger.info('Redis connected');
// }
//
// export async function disconnectRedis(): Promise<void> {
//   await redis.quit();
// }
//
// // Simple cache helper:
// // export async function cached<T>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
// //   const hit = await redis.get(key);
// //   if (hit) return JSON.parse(hit) as T;
// //   const value = await fn();
// //   await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
// //   return value;
// // }

export {};
