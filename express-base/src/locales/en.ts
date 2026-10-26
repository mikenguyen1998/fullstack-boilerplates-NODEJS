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
