export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const STORAGE_KEYS = {
  auth: 'app-auth',
  ui: 'app-ui',
  language: 'app-language',
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  users: '/users',
} as const;
