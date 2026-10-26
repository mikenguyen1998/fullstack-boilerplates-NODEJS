import 'server-only';

import { z } from 'zod';

import { env as clientEnv } from './env';

/**
 * Server-only environment variables. Importing this file from a Client Component
 * will fail the build (guarded by `server-only`).
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  /** Internal API URL used by RSC / route handlers (e.g. service DNS inside a cluster). */
  API_INTERNAL_URL: z.preprocess((v) => (v === '' ? undefined : v), z.url().optional()),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid server environment variables:', z.flattenError(parsed.error).fieldErrors);
  throw new Error('Invalid server environment variables');
}

export const serverEnv = {
  ...clientEnv,
  ...parsed.data,
  API_URL: parsed.data.API_INTERNAL_URL ?? clientEnv.NEXT_PUBLIC_API_URL,
};
