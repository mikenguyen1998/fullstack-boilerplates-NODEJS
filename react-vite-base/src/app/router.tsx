import { createBrowserRouter, type RouteObject } from 'react-router';

import { PageLoader } from '@/components/common/PageLoader';
import { RouteError } from '@/components/common/RouteError';
import { MainLayout } from '@/components/layout/MainLayout';

/** Lazy-load a page module whose default export is the component. */
const page = (loader: () => Promise<{ default: React.ComponentType }>) => async () => ({
  Component: (await loader()).default,
});

export const routes: RouteObject[] = [
  {
    errorElement: <RouteError />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, lazy: page(() => import('@/pages/HomePage')) },
          { path: 'dashboard', lazy: page(() => import('@/pages/DashboardPage')) },
        ],
      },
      { path: '*', lazy: page(() => import('@/pages/NotFoundPage')) },
    ],
  },
];

export const router = createBrowserRouter(routes);
