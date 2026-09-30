import { createBrowserRouter, type RouteObject } from 'react-router';

import { PageLoader } from '@/components/common/PageLoader';
import { RouteError } from '@/components/common/RouteError';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';

import { GuestRoute, ProtectedRoute } from './ProtectedRoute';

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
          {
            element: <ProtectedRoute />,
            children: [{ path: 'dashboard', lazy: page(() => import('@/pages/DashboardPage')) }],
          },
        ],
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [{ path: 'login', lazy: page(() => import('@/pages/LoginPage')) }],
          },
        ],
      },
      { path: '*', lazy: page(() => import('@/pages/NotFoundPage')) },
    ],
  },
];

export const router = createBrowserRouter(routes);
