'use client';

import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import { ROUTES } from '@/config/constants';
import { routing } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth.store';
import { ApiError, type ApiErrorPayload, type AuthTokens } from '@/types';

/**
 * Client-side axios instance.
 * For Server Components / Route Handlers use `serverFetch` from `@/lib/server-fetch`.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

const REFRESH_ENDPOINT = '/auth/refresh';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function currentLocale(): string {
  if (typeof document === 'undefined') return routing.defaultLocale;
  return document.documentElement.lang || routing.defaultLocale;
}

// ---------- Request: attach Bearer token + Accept-Language ----------
api.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  const token = useAuthStore.getState().accessToken;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Accept-Language', currentLocale());
  config.headers = headers;
  return config;
});

// ---------- Response: 401 -> refresh token (queued) -> retry, else logout ----------
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)));
  pendingQueue = [];
}

function forceLogout() {
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    const locale = currentLocale();
    const callbackUrl = window.location.pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '');
    const params = new URLSearchParams({ callbackUrl: callbackUrl || '/' });
    // Hard navigation on purpose: runs outside React and fully resets in-memory state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/${locale}${ROUTES.login}?${params.toString()}`;
  }
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error('No refresh token');
  // Use a bare axios call so this request bypasses our interceptors.
  const { data } = await axios.post<AuthTokens>(
    `${env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
    { refreshToken },
    { timeout: env.NEXT_PUBLIC_API_TIMEOUT },
  );
  useAuthStore.getState().setTokens(data);
  return data.accessToken;
}

function toApiError(error: AxiosError<Partial<ApiErrorPayload>>): ApiError {
  return new ApiError(error.response?.status ?? 0, {
    message: error.response?.data?.message ?? error.message,
    code: error.response?.data?.code ?? error.code,
    errors: error.response?.data?.errors,
  });
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<Partial<ApiErrorPayload>>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const isRefreshCall = original?.url?.includes(REFRESH_ENDPOINT);

    if (status !== 401 || !original || original._retry || isRefreshCall) {
      return Promise.reject(toApiError(error));
    }

    if (isRefreshing) {
      // Wait for the in-flight refresh, then replay this request.
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.set('Authorization', `Bearer ${token}`);
            resolve(api(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const token = await refreshAccessToken();
      flushQueue(null, token);
      original.headers.set('Authorization', `Bearer ${token}`);
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      forceLogout();
      return Promise.reject(toApiError(error));
    } finally {
      isRefreshing = false;
    }
  },
);
