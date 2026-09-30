import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ROUTES } from '@/config/constants';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export default function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations('Home');

  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t('subtitle')}</p>
        <div className="flex gap-3">
          <Link
            href={ROUTES.login}
            className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground"
          >
            {t('getStarted')}
          </Link>
          <Link
            href={ROUTES.dashboard}
            className="inline-flex h-11 items-center rounded-md border border-border px-6 font-medium hover:bg-muted"
          >
            {t('goToDashboard')}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
