/**
 * Minimal browser cookie helpers (client-side only).
 * On the server use `cookies()` from `next/headers` instead.
 */
interface CookieOptions {
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}

const isBrowser = () => typeof document !== 'undefined';

export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (!isBrowser()) return;
  const {
    maxAge,
    path = '/',
    sameSite = 'Lax',
    secure = window.location.protocol === 'https:',
  } = options;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;
  if (maxAge !== undefined) cookie += `; Max-Age=${maxAge}`;
  if (secure) cookie += '; Secure';
  document.cookie = cookie;
}

export function removeCookie(name: string, path = '/'): void {
  setCookie(name, '', { maxAge: 0, path });
}
