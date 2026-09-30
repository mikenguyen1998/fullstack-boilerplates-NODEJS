import { Suspense, type ReactNode } from 'react';

import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ThemeToggle } from '@/components/common/theme-toggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <div className="absolute top-4 right-4 flex gap-2">
        <Suspense>
          <LanguageSwitcher />
        </Suspense>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
