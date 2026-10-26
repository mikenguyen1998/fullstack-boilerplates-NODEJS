import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ROUTES } from '@/config/constants';
import { env } from '@/config/env';
import { Link } from '@/i18n/navigation';

export function Header() {
  const t = useTranslations('Nav');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <nav className="flex items-center gap-6">
          <Link href={ROUTES.home} className="font-semibold">
            {env.NEXT_PUBLIC_APP_NAME}
          </Link>
          <Link
            href={ROUTES.dashboard}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('dashboard')}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Suspense>
            <LanguageSwitcher />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
