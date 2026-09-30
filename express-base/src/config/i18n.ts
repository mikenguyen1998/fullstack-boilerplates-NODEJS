import i18next from 'i18next';
import { LanguageDetector } from 'i18next-http-middleware';

import { en } from '@/locales/en.js';
import { vi } from '@/locales/vi.js';

import { env } from './env.js';

export const supportedLanguages = ['en', 'vi'] as const;
export type Language = (typeof supportedLanguages)[number];

/**
 * Language is detected from (in order): ?lang=vi, then Accept-Language header.
 */
await i18next.use(LanguageDetector).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  fallbackLng: env.DEFAULT_LANGUAGE,
  supportedLngs: [...supportedLanguages],
  preload: [...supportedLanguages],
  interpolation: { escapeValue: false },
  detection: {
    order: ['querystring', 'header'],
    lookupQuerystring: 'lang',
    caches: false,
  },
});

export { i18next };
