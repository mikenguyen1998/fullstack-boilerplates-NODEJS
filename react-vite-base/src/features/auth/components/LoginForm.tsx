import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isApiError } from '@/lib/api-error';

import { loginSchema, PASSWORD_MIN_LENGTH, type LoginFormValues } from '../schemas/login.schema';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<unknown> | void;
  isSubmitting?: boolean;
  error?: unknown;
}

export function LoginForm({ onSubmit, isSubmitting = false, error }: LoginFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  // Zod messages are i18n keys (see login.schema.ts)
  const tr = (key?: string) =>
    key ? t(key as 'validation.required', { min: PASSWORD_MIN_LENGTH }) : undefined;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={tr(errors.email?.message)}
        {...register('email')}
      />
      <Input
        label={t('auth.password')}
        type="password"
        autoComplete="current-password"
        error={tr(errors.password?.message)}
        {...register('password')}
      />
      {error != null && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {t('auth.failed', { message: isApiError(error) ? error.message : String(error) })}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? t('auth.submitting') : t('auth.submit')}
      </Button>
    </form>
  );
}
