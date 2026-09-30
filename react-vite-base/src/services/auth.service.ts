import { api } from '@/lib/axios';
import type { LoginPayload, LoginResponse } from '@/types/auth';
import type { User } from '@/types/user';

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>('/auth/login', payload, {
      skipAuthRefresh: true,
    });
    return data;
  },

  async logout() {
    await api.post('/auth/logout', null, { skipAuthRefresh: true });
  },

  async me() {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
