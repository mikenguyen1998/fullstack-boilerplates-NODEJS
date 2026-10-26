import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

export default createIntlMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with an extension.
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
