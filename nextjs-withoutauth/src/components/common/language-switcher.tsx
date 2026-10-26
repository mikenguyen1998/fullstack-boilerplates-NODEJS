'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useTransition, type ChangeEvent } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/utils/cn';

const LABELS: Record<Locale, string> = { en: 'English', vi: 'Tiếng Việt' };

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    const query = searchParams.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      aria-label={t('language')}
      value={locale}
      onChange={onChange}
      disabled={isPending}
      className={cn(
        'h-9 rounded-md border border-border bg-background px-2 text-sm disabled:opacity-50',
        className,
      )}
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LABELS[l]}
        </option>
      ))}
    </select>
  );
}
