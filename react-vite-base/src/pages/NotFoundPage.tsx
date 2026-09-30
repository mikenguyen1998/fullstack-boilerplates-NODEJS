import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/constants';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-brand-600 text-7xl font-bold">404</p>
      <h1 className="text-2xl font-semibold">{t('errors.notFoundTitle')}</h1>
      <p className="text-slate-600 dark:text-slate-400">{t('errors.notFoundDesc')}</p>
      <Link to={ROUTES.home}>
        <Button>{t('common.backHome')}</Button>
      </Link>
    </div>
  );
}
