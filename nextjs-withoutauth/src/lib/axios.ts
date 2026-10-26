'use client';

import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { env } from '@/config/env';
import { routing } from '@/i18n/routing';
import { ApiError, type ApiErrorPayload } from '@/types';

export const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const locale =
    typeof document === 'undefined'
      ? routing.defaultLocale
      : document.documentElement.lang || routing.defaultLocale;
  config.headers.set('Accept-Language', locale);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Partial<ApiErrorPayload>>) =>
    Promise.reject(
      new ApiError(error.response?.status ?? 0, {
        message: error.response?.data?.message ?? error.message,
        code: error.response?.data?.code ?? error.code,
        errors: error.response?.data?.errors,
      }),
    ),
);
