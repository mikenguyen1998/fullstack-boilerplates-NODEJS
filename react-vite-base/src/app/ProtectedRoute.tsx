import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/config/constants';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth.store';

/** Renders child routes only when authenticated; otherwise redirects to /login. */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Inverse guard: authenticated users visiting /login are sent to the dashboard. */
export function GuestRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;
  return <Outlet />;
}
