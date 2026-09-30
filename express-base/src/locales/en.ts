export const en = {
  common: {
    success: 'Success',
    created: 'Created successfully',
    notFound: 'Resource not found',
    routeNotFound: 'Route {{method}} {{path}} not found',
    internalError: 'Internal server error',
    validationFailed: 'Validation failed',
    tooManyRequests: 'Too many requests, please try again later',
    badRequest: 'Bad request',
    conflict: 'Resource already exists',
  },
  auth: {
    registered: 'Registered successfully',
    loggedIn: 'Logged in successfully',
    refreshed: 'Token refreshed',
    invalidCredentials: 'Invalid email or password',
    emailTaken: 'Email is already registered',
    unauthorized: 'Authentication required',
    invalidToken: 'Invalid or expired token',
    forbidden: 'You do not have permission to perform this action',
    inactive: 'Account is disabled',
  },
  user: {
    notFound: 'User not found',
    updated: 'User updated successfully',
    deleted: 'User deleted successfully',
  },
  health: {
    ok: 'Service is healthy',
  },
} as const;

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };
export type TranslationSchema = DeepString<typeof en>;
