'use client';

import type { ReactNode } from 'react';

import { QueryProvider } from './query-provider';
import { StoreHydration } from './store-hydration';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <StoreHydration />
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
