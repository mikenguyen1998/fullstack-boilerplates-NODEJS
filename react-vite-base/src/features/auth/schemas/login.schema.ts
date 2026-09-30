import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 6;

/** Error messages are i18n keys, translated when rendered. */
export const loginSchema = z.object({
  email: z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email')),
  password: z
    .string()
    .min(1, 'validation.required')
    .min(PASSWORD_MIN_LENGTH, 'validation.passwordMin'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
