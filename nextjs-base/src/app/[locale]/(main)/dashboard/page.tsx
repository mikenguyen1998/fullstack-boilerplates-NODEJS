import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { queryKeys } from '@/hooks/queries/keys';
import type { Locale } from '@/i18n/routing';
import { getQueryClient } from '@/lib/query-client';
import { serverFetch } from '@/lib/server-fetch';
import type { User } from '@/types';

import { UserList } from './_components/user-list';
import { Welcome } from './_components/welcome';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/dashboard'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Dashboard' });
  return { title: t('title') };
}

export default async function DashboardPage({ params }: PageProps<'/[locale]/dashboard'>) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Dashboard');

  // Prefetch on the server; the client `useUsers()` hook picks this data up
  // from the dehydrated cache without refetching (same query key).
  // prefetchQuery never throws — on failure the client will retry and show an error state.
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => serverFetch<User[]>('/users', { next: { revalidate: 60 } }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <Welcome />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />
      </HydrationBoundary>
    </div>
  );
}
