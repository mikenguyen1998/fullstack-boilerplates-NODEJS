import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { authService } from '@/services/auth.service';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth.store';

/** Current user profile; only runs when a token is present. */
export function useMeQuery() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await authService.me();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
}

export function useLoginMutation() {
  const login = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
    },
  });
}

export function useLogoutMutation() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    // Always clear local session, even if the server call fails.
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}
