import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, type Location } from 'react-router';

import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/config/constants';
import { LoginForm } from '@/features/auth/components/LoginForm';
import type { LoginFormValues } from '@/features/auth/schemas/login.schema';
import { useLoginMutation } from '@/hooks/queries/useAuth';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLoginMutation();

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? ROUTES.dashboard;

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login.mutateAsync(values);
      await navigate(from, { replace: true });
    } catch {
      // Error is exposed via `login.error` and rendered by the form.
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-6 text-xl font-semibold">{t('auth.title')}</h1>
      <LoginForm onSubmit={handleSubmit} isSubmitting={login.isPending} error={login.error} />
    </Card>
  );
}
