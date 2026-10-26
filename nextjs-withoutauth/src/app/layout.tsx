import type { ReactNode } from 'react';

import './globals.css';

/**
 * The real root layout (with <html>/<body>) lives in `app/[locale]/layout.tsx`.
 * This pass-through layout is required so `app/not-found.tsx` and route handlers
 * outside the `[locale]` segment work.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
