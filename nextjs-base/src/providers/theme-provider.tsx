'use client';

import { useEffect, type ReactNode } from 'react';

import { useUiStore } from '@/stores/ui.store';

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    // Skip until the persisted value has been rehydrated, so we don't override
    // the class set by the inline script with the default state.
    if (!useUiStore.persist.hasHydrated()) {
      return useUiStore.persist.onFinishHydration((s) => applyTheme(s.theme));
    }
    applyTheme(theme);
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  return <>{children}</>;
}
