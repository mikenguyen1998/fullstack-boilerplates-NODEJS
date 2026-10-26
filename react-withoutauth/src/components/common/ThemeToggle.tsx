import { useTranslation } from 'react-i18next';

import { useUiStore, type Theme } from '@/stores/ui.store';

const THEMES: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      aria-label={t('common.theme.label')}
      className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
    >
      {THEMES.map((value) => (
        <option key={value} value={value}>
          {t(`common.theme.${value}`)}
        </option>
      ))}
    </select>
  );
}
