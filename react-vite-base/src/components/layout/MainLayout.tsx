import { Outlet, useNavigation } from 'react-router';

import { PageLoader } from '@/components/common/PageLoader';

import { Header } from './Header';

export function MainLayout() {
  const navigation = useNavigation();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {navigation.state === 'loading' ? <PageLoader /> : <Outlet />}
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} React Vite Base
      </footer>
    </div>
  );
}
