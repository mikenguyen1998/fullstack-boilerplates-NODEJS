'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { ROUTES } from '@/config/constants';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(() => {
    logout();
    queryClient.clear();
    router.replace(ROUTES.login);
    router.refresh();
  }, [logout, queryClient, router]);
}
