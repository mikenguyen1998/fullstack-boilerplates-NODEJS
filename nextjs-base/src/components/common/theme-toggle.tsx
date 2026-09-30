'use client';

import { useTranslations } from 'next-intl';

import { useHydrated } from '@/hooks/use-hydrated';
import { useUiStore, type Theme } from '@/stores/ui.store';
import { cn } from '@/utils/cn';

const THEMES: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('Common.theme');
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const hydrated = useHydrated();

  return (
    <select
      aria-label={t('label')}
      value={hydrated ? theme : 'system'}
      onChange={(e) => setTheme(e.target.value as Theme)}
      className={cn('h-9 rounded-md border border-border bg-background px-2 text-sm', className)}
    >
      {THEMES.map((value) => (
        <option key={value} value={value}>
          {t(value)}
        </option>
      ))}
    </select>
  );
}
