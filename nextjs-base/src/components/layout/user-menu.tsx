'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/constants';
import { useHydrated } from '@/hooks/use-hydrated';
import { useLogout } from '@/hooks/use-logout';
import { Link } from '@/i18n/navigation';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth.store';

export function UserMenu() {
  const t = useTranslations('Nav');
  const hydrated = useHydrated();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  if (!hydrated) return <div className="h-9 w-20" aria-hidden />;

  if (!isAuthenticated) {
    return (
      <Link
        href={ROUTES.login}
        className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
      >
        {t('login')}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user && <span className="hidden text-sm sm:inline">{user.name}</span>}
      <Button variant="outline" size="sm" onClick={logout}>
        {t('logout')}
      </Button>
    </div>
  );
}
