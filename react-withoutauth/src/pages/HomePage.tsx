import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/constants';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">{t('home.title')}</h1>
      <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400">{t('home.subtitle')}</p>
      <Link to={ROUTES.dashboard}>
        <Button size="lg">{t('home.cta')}</Button>
      </Link>
    </section>
  );
}
