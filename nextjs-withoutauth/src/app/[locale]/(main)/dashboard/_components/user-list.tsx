'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useUsers } from '@/hooks/queries/use-users';

export function UserList() {
  const t = useTranslations();
  const { data, isPending, isError, refetch, isFetching } = useUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Dashboard.usersTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Spinner label={t('Common.loading')} />
        ) : isError ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-destructive">{t('Dashboard.loadError')}</p>
            <Button size="sm" variant="outline" onClick={() => refetch()} isLoading={isFetching}>
              {t('Common.retry')}
            </Button>
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('Dashboard.empty')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((user) => (
              <li key={user.id} className="flex flex-col py-3">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
