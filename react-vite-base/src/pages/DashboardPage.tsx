import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useUsersQuery } from '@/hooks/queries/useUsers';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, isPending, isError, error } = useUsersQuery({ page: 1, pageSize: 10 });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('dashboard.welcome')}</p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-medium">{t('dashboard.users')}</h2>
        {isPending ? (
          <Spinner />
        ) : isError ? (
          <p className="text-red-600">
            {t('dashboard.loadError')} ({error.message})
          </p>
        ) : data.items.length === 0 ? (
          <p className="text-slate-500">{t('dashboard.empty')}</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.items.map((u) => (
              <li key={u.id} className="flex justify-between py-2 text-sm">
                <span>{u.name}</span>
                <span className="text-slate-500">{u.email}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
