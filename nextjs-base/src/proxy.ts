import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { AUTH_COOKIE, AUTH_ROUTES, PROTECTED_ROUTES, ROUTES } from '@/config/constants';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const matchesRoute = (pathname: string, routes: readonly string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

function splitLocale(pathname: string): { locale: string; path: string } {
  const [, maybeLocale, ...rest] = pathname.split('/');
  if (maybeLocale && (routing.locales as readonly string[]).includes(maybeLocale)) {
    return { locale: maybeLocale, path: `/${rest.join('/')}` };
  }
  return { locale: routing.defaultLocale, path: pathname };
}

/**
 * Next.js 16 "proxy" (formerly middleware):
 * 1. Optimistic auth check (cookie presence only) for protected / auth routes.
 * 2. Locale detection, redirects and rewrites via next-intl.
 *
 * Real authorization must still happen in the API / data layer.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { locale, path } = splitLocale(pathname);
  const isAuthenticated = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (!isAuthenticated && matchesRoute(path, PROTECTED_ROUTES)) {
    const url = new URL(`/${locale}${ROUTES.login}`, request.url);
    url.searchParams.set('callbackUrl', `${path}${search}`);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && matchesRoute(path, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL(`/${locale}${ROUTES.dashboard}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with an extension.
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
