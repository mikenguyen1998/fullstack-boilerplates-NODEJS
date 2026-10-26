import { isServer, QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

import { ApiError } from '@/types';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR we usually want a staleTime > 0 to avoid refetching immediately on the client.
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      dehydrate: {
        // Also dehydrate pending queries so streaming works with prefetch without await.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Server: always a new client per request (never share data between users).
 * Browser: a singleton so React suspense/re-renders don't recreate it.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
