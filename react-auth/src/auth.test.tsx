import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';

import { routes } from './router';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('redirects a direct dashboard visit to login when the session is invalid', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
  const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] });
  render(<RouterProvider router={router} />);
  expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/login');
});

it('logs in and loads the protected dashboard from the backend session', async () => {
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ email: 'owner@example.com' }));
  vi.stubGlobal('fetch', fetchMock);
  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  render(<RouterProvider router={router} />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email'), 'owner@example.com');
  await user.type(screen.getByLabelText('Password'), 'a-long-password');
  await user.click(screen.getByRole('button', { name: 'Log in' }));
  expect(await screen.findByText('Signed in as owner@example.com.')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/auth/login',
    expect.objectContaining({
      method: 'POST',
      credentials: 'same-origin',
      headers: expect.objectContaining({ 'X-CSRF-Protection': '1' }),
    }),
  );
  expect(fetchMock).toHaveBeenCalledWith('/api/auth/session', expect.anything());
});

it('shows a credential error without opening the dashboard', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  render(<RouterProvider router={router} />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email'), 'owner@example.com');
  await user.type(screen.getByLabelText('Password'), 'wrong-password');
  await user.click(screen.getByRole('button', { name: 'Log in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.');
  expect(router.state.location.pathname).toBe('/login');
});

it('shows a service error instead of treating a backend outage as a logged-out session', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/dashboard'] })} />,
  );
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load this page.');
});
