import { z } from 'zod';

export const registerBodySchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z
    .string()
    .min(8)
    .max(72) // bcrypt only uses the first 72 bytes
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/\d/, 'Password must contain a number'),
  name: z.string().trim().min(1).max(100).optional(),
});

export const loginBodySchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type RefreshBody = z.infer<typeof refreshBodySchema>;
