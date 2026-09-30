import { api } from '@/lib/axios';
import type { LoginPayload, LoginResponse, User } from '@/types';

export const authService = {
  login: async (payload: LoginPayload) =>
    (await api.post<LoginResponse>('/auth/login', payload)).data,
  logout: async () => {
    await api.post('/auth/logout');
  },
  me: async () => (await api.get<User>('/auth/me')).data,
};
