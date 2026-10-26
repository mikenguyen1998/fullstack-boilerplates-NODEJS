import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES, type Language } from '@/config/constants';

const LABELS: Record<Language, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? 'en') as Language;

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t('common.language')}</span>
      <select
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="h-9 rounded-lg border border-slate-300 bg-white px-2 dark:border-slate-700 dark:bg-slate-900"
        aria-label={t('common.language')}
      >
        {SUPPORTED_LANGUAGES.map((lng) => (
          <option key={lng} value={lng}>
            {LABELS[lng]}
          </option>
        ))}
      </select>
    </label>
  );
}
