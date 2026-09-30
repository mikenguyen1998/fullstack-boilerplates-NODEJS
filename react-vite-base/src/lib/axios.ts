import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import i18n from '@/lib/i18n';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthTokens } from '@/types/auth';

import { normalizeError } from './api-error';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  /** Set to true for requests that must never trigger a token refresh (login, refresh...). */
  skipAuthRefresh?: boolean;
};

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

const baseConfig = {
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
};

/** Main API client used by every service. */
export const api = axios.create(baseConfig);

/** Bare client for the refresh call — no interceptors, avoids infinite loops. */
const refreshClient = axios.create(baseConfig);

// ---------- Request interceptor ----------
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  config.headers.set(
    'Accept-Language',
    i18n.resolvedLanguage ?? i18n.language ?? env.defaultLanguage,
  );
  return config;
});

// ---------- Refresh-token queue ----------
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState();
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await refreshClient.post<AuthTokens>('/auth/refresh', { refreshToken });
  setTokens(data);
  return data.accessToken;
}

// ---------- Response interceptor ----------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequestConfig | undefined;

    const shouldRefresh =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.skipAuthRefresh &&
      !!useAuthStore.getState().refreshToken;

    if (!shouldRefresh) {
      if (error.response?.status === 401 && !original?.skipAuthRefresh) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(normalizeError(error));
    }

    // A refresh is already in flight: wait for it, then replay the request.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((token) => {
          original.headers.set('Authorization', `Bearer ${token}`);
          return api(original);
        })
        .catch((queueError: unknown) => Promise.reject(normalizeError(queueError)));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      flushQueue(null, newToken);
      original.headers.set('Authorization', `Bearer ${newToken}`);
      return await api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(normalizeError(refreshError));
    } finally {
      isRefreshing = false;
    }
  },
);
