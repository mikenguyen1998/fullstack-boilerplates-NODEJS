'use client';

import { useTranslations } from 'next-intl';

import { useHydrated } from '@/hooks/use-hydrated';
import { useAuthStore } from '@/stores/auth.store';

export function Welcome() {
  const t = useTranslations('Dashboard');
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);

  if (!hydrated || !user) return null;
  return <p className="mt-1 text-muted-foreground">{t('welcome', { name: user.name })}</p>;
}
