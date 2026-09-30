'use client';

import { useQuery } from '@tanstack/react-query';

import { userService } from '@/services/user.service';

import { queryKeys } from './keys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: userService.list,
  });
}
