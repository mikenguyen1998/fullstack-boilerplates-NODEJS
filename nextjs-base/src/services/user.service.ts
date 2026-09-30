import { api } from '@/lib/axios';
import type { User } from '@/types';

export const userService = {
  list: async () => (await api.get<User[]>('/users')).data,
  detail: async (id: User['id']) => (await api.get<User>(`/users/${id}`)).data,
};
