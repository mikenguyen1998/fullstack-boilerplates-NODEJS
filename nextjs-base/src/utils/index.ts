export * from './cn';
export * from './cookie';

/** Only allow same-origin relative redirects (prevents open redirects). */
export function safeRedirectPath(path: string | null | undefined, fallback = '/'): string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return fallback;
  }
  return path;
}
