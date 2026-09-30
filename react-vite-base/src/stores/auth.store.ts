import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/config/constants';
import type { AuthTokens, LoginResponse } from '@/types/auth';
import type { User } from '@/types/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  /** Save tokens + user after a successful login. */
  login: (payload: LoginResponse) => void;
  /** Update tokens only (used by the refresh flow). */
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const initialState = { accessToken: null, refreshToken: null, user: null };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      login: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      logout: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, refreshToken, user }) => ({ accessToken, refreshToken, user }),
      version: 1,
    },
  ),
);

// Selectors
export const selectIsAuthenticated = (state: AuthState) => Boolean(state.accessToken);
export const selectUser = (state: AuthState) => state.user;
