'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    // TODO: report to your error tracking service (Sentry, ...)
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">{t('Errors.errorTitle')}</h1>
      <p className="text-muted-foreground">{t('Errors.errorDescription')}</p>
      <Button onClick={reset}>{t('Common.retry')}</Button>
    </div>
  );
}
