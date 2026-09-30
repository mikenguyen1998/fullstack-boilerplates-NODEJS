import { z } from 'zod';

import { Roles } from '@/types/auth.js';
import { paginationQuerySchema } from '@/utils/pagination.js';

export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

export const listUsersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
  role: z.enum([Roles.USER, Roles.ADMIN]).optional(),
  sortBy: z.enum(['createdAt', 'email', 'name']).default('createdAt'),
});

export const updateUserBodySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    role: z.enum([Roles.USER, Roles.ADMIN]).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'At least one field is required' });

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
