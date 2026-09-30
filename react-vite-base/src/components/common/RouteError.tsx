import { isRouteErrorResponse, useRouteError } from 'react-router';

import { ErrorFallback } from './ErrorFallback';

/** Used as `errorElement` on routes — catches loader/render/lazy-import errors. */
export function RouteError() {
  const error = useRouteError();
  const normalized = isRouteErrorResponse(error)
    ? new Error(`${error.status} ${error.statusText}`)
    : error;
  return <ErrorFallback error={normalized} />;
}
