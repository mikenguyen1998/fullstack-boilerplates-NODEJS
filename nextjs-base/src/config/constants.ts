export const AUTH_COOKIE = 'access_token';
/** Cookie lifetime in seconds (7 days). Should match / exceed your refresh token lifetime. */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const STORAGE_KEYS = {
  auth: 'auth-storage',
  ui: 'ui-storage',
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
} as const;

/** Paths (without locale prefix) that require authentication. */
export const PROTECTED_ROUTES: readonly string[] = [ROUTES.dashboard];
/** Paths (without locale prefix) that authenticated users should not see. */
export const AUTH_ROUTES: readonly string[] = [ROUTES.login];
