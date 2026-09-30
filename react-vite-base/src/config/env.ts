import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().min(1).default('/api'),
  VITE_APP_NAME: z.string().default('React Vite Base'),
  VITE_DEFAULT_LANGUAGE: z.enum(['en', 'vi']).default('en'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', z.treeifyError(parsed.error));
  throw new Error('Invalid environment variables. Check your .env file.');
}

/** Typed, validated runtime config. Import this instead of `import.meta.env`. */
export const env = {
  apiUrl: parsed.data.VITE_API_URL,
  appName: parsed.data.VITE_APP_NAME,
  defaultLanguage: parsed.data.VITE_DEFAULT_LANGUAGE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;
