'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE, STORAGE_KEYS } from '@/config/constants';
import type { AuthTokens, User } from '@/types';
import { removeCookie, setCookie } from '@/utils/cookie';
import { safeLocalStorage } from '@/utils/storage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  setSession: (session: AuthTokens & { user: User }) => void;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = { user: null, accessToken: null, refreshToken: null };

/**
 * Auth store.
 * - The access token is mirrored into a cookie so `proxy.ts` (and RSC) can see it.
 * - `skipHydration: true` keeps SSR output deterministic; rehydration happens in
 *   <StoreHydration /> after mount (see src/providers/store-hydration.tsx).
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ user, accessToken, refreshToken }) => {
        setCookie(AUTH_COOKIE, accessToken, { maxAge: AUTH_COOKIE_MAX_AGE });
        set({ user, accessToken, refreshToken });
      },
      setTokens: ({ accessToken, refreshToken }) => {
        setCookie(AUTH_COOKIE, accessToken, { maxAge: AUTH_COOKIE_MAX_AGE });
        set({ accessToken, refreshToken });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        removeCookie(AUTH_COOKIE);
        set(initialState);
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(safeLocalStorage),
      partialize: ({ user, accessToken, refreshToken }) => ({ user, accessToken, refreshToken }),
      skipHydration: true,
    },
  ),
);

export const selectIsAuthenticated = (s: AuthStore) => Boolean(s.accessToken);
