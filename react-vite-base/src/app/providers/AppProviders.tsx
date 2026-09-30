import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import i18n from '@/lib/i18n';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
