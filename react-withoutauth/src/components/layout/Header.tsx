import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';

import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ROUTES } from '@/config/constants';
import { cn } from '@/utils/cn';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
  );

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.home} className="text-brand-600 font-semibold">
            {t('common.appName')}
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink to={ROUTES.home} end className={navLinkClass}>
              {t('nav.home')}
            </NavLink>
            <NavLink to={ROUTES.dashboard} className={navLinkClass}>
              {t('nav.dashboard')}
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
