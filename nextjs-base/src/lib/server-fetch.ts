import 'server-only';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { AUTH_COOKIE } from '@/config/constants';
import { serverEnv } from '@/config/env.server';
import { ApiError, type ApiErrorPayload } from '@/types';

type Query = Record<string, string | number | boolean | undefined | null>;

export interface ServerFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: Query;
  /** Attach the Bearer token from the auth cookie (default: true). */
  auth?: boolean;
  /** Next.js data cache options, e.g. `{ revalidate: 60, tags: ['users'] }`. */
  next?: NextFetchRequestConfig;
}

function buildUrl(path: string, query?: Query): string {
  const base = serverEnv.API_URL.replace(/\/$/, '');
  const url = new URL(/^https?:\/\//.test(path) ? path : `${base}/${path.replace(/^\//, '')}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

/**
 * Fetch helper for Server Components, Server Actions and Route Handlers.
 * Forwards the auth cookie as a Bearer token and the active locale as Accept-Language.
 */
export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const { body, query, auth = true, headers, ...init } = options;
  const finalHeaders = new Headers(headers);
  finalHeaders.set('Accept', 'application/json');
  finalHeaders.set('Accept-Language', await getLocale());

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (token) finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: finalHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    let payload: Partial<ApiErrorPayload> = {};
    try {
      payload = (await response.json()) as Partial<ApiErrorPayload>;
    } catch {
      // non-JSON error body
    }
    throw new ApiError(response.status, payload);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
