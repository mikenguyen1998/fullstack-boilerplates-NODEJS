import Link from 'next/link';

import { routing } from '@/i18n/routing';

/** Fallback for requests that never reached the `[locale]` segment. */
export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans">
        <h1 className="text-2xl font-semibold">404 - Not Found</h1>
        <Link href="/" className="underline">
          Home
        </Link>
      </body>
    </html>
  );
}
