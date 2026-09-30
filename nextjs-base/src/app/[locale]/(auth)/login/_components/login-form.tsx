'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/config/constants';
import { useLogin } from '@/hooks/queries/use-login';
import { useRouter } from '@/i18n/navigation';
import { createLoginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { ApiError } from '@/types';
import { safeRedirectPath } from '@/utils';

export function LoginForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const schema = useMemo(
    () => createLoginSchema((key, values) => t(`validation.${key}`, values)),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values).then(
      () => {
        router.replace(safeRedirectPath(searchParams.get('callbackUrl'), ROUTES.dashboard));
        router.refresh();
      },
      () => undefined, // error is rendered from `login.error`
    );
  });

  const serverError =
    login.error instanceof ApiError && login.error.message
      ? login.error.message
      : login.error
        ? t('loginFailed')
        : null;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t('passwordPlaceholder')}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting || login.isPending} className="w-full">
        {isSubmitting || login.isPending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
