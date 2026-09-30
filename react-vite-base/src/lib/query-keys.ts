import type { PaginationParams } from '@/types/api';

/** Centralized query-key factory — keeps cache keys consistent. */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: PaginationParams = {}) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
};
