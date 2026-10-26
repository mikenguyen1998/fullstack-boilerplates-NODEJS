import axios from 'axios';

import { env } from '@/config/env';
import i18n from '@/lib/i18n';

import { normalizeError } from './api-error';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  config.headers.set(
    'Accept-Language',
    i18n.resolvedLanguage ?? i18n.language ?? env.defaultLanguage,
  );
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);
