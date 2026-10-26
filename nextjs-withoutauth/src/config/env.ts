import { z } from 'zod';

/**
 * Public (client-safe) environment variables.
 *
 * NOTE: `NEXT_PUBLIC_*` variables are inlined at build time, so each one must be
 * referenced explicitly via `process.env.NEXT_PUBLIC_XXX` (no destructuring / dynamic access).
 */
const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.preprocess(emptyToUndefined, z.string().min(1).default('Next.js Base')),
  NEXT_PUBLIC_APP_URL: z.preprocess(emptyToUndefined, z.url().default('http://localhost:3000')),
  NEXT_PUBLIC_API_URL: z.preprocess(emptyToUndefined, z.url().default('http://localhost:8080/api')),
  NEXT_PUBLIC_API_TIMEOUT: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(15000),
  ),
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
});

if (!parsed.success) {
  console.error('Invalid public environment variables:', z.flattenError(parsed.error).fieldErrors);
  throw new Error('Invalid public environment variables');
}

export const env = parsed.data;
export type ClientEnv = typeof env;
