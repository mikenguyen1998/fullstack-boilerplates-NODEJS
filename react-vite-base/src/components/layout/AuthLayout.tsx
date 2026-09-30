import { Outlet } from 'react-router';

import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex justify-end gap-2 p-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
