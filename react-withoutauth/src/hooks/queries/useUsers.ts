import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { userService, type UpdateUserPayload } from '@/services/user.service';
import type { PaginationParams } from '@/types/api';

export function useUsersQuery(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => userService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.update(id, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
