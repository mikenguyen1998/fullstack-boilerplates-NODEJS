import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">{t('Errors.notFoundTitle')}</h1>
      <p className="text-muted-foreground">{t('Errors.notFoundDescription')}</p>
      <Link href="/" className="underline underline-offset-4">
        {t('Common.backHome')}
      </Link>
    </div>
  );
}
