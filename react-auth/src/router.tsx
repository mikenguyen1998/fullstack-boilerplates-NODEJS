import { createBrowserRouter, Link, redirect } from 'react-router';

import { Layout } from './App';
import { authRequest } from './auth';
import { Dashboard, Login } from './pages';

export const routes = [
  {
    Component: Layout,
    hydrateFallbackElement: <main role="status">Loading…</main>,
    errorElement: (
      <main role="alert">
        Could not load this page. <a href="/">Try again</a>
      </main>
    ),
    children: [
      {
        index: true,
        element: (
          <>
            <h1>A simple session-based starter.</h1>
            <p>Home is public. Log in to view your dashboard.</p>
            <Link className="button" to="/dashboard">
              Open dashboard
            </Link>
          </>
        ),
      },
      { path: 'login', Component: Login },
      {
        path: 'dashboard',
        loader: async () => {
          const response = await authRequest('session');
          if (response.status === 401) throw redirect('/login');
          return response.json();
        },
        shouldRevalidate: () => true,
        Component: Dashboard,
      },
      {
        path: '*',
        element: (
          <>
            <h1>Page not found.</h1>
            <Link to="/">Back to home</Link>
          </>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
