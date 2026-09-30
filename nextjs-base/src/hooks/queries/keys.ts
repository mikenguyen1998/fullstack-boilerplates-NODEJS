/** Centralised query keys (https://tkdodo.eu/blog/effective-react-query-keys). */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => [...queryKeys.users.all, 'list'] as const,
    detail: (id: string | number) => [...queryKeys.users.all, 'detail', id] as const,
  },
};
