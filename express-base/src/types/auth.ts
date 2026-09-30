/** Mirrors the Prisma `Role` enum; kept separate so middlewares don't depend on the generated client. */
export const Roles = { USER: 'USER', ADMIN: 'ADMIN' } as const;
export type Role = (typeof Roles)[keyof typeof Roles];

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
