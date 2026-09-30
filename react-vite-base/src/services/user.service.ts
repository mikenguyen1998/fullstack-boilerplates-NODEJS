import { api } from '@/lib/axios';
import type { Paginated, PaginationParams } from '@/types/api';
import type { User } from '@/types/user';

export type UpdateUserPayload = Partial<Pick<User, 'name' | 'avatarUrl'>>;

export const userService = {
  async list(params: PaginationParams = {}) {
    const { data } = await api.get<Paginated<User>>('/users', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async update(id: string, payload: UpdateUserPayload) {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },
};
