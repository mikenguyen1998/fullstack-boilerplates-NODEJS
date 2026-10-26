export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const STORAGE_KEYS = {
  ui: 'app-ui',
  language: 'app-language',
} as const;

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  users: '/users',
} as const;
