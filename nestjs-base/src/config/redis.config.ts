import { registerAs } from '@nestjs/config';

/**
 * Redis chưa được bật mặc định (REDIS_ENABLED=false).
 * Xem ví dụ tích hợp ioredis / cache-manager tại `src/database/database.alternatives.ts`.
 */
export const redisConfig = registerAs('redis', () => ({
  enabled: process.env.REDIS_ENABLED === 'true',
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB ?? '0', 10),
  ttlMs: parseInt(process.env.REDIS_TTL_MS ?? '60000', 10),
}));

export type RedisConfig = ReturnType<typeof redisConfig>;
