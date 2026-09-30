import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS, SUPPORTED_LANGUAGES } from '@/config/constants';
import { env } from '@/config/env';
import en from '@/locales/en/translation.json';
import vi from '@/locales/vi/translation.json';

export const resources = {
  en: { translation: en },
  vi: { translation: vi },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: env.defaultLanguage,
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEYS.language,
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
