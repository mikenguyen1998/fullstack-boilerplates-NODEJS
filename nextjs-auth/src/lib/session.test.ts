import { afterEach, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { cookie, redirect } = vi.hoisted(() => ({ cookie: vi.fn(), redirect: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: cookie }) }));
vi.mock('next/navigation', () => ({ redirect }));

import { requireSession } from './session';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

it('redirects before requesting private data when no cookie exists', async () => {
  redirect.mockImplementation(() => {
    throw new Error('redirect');
  });
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  await expect(requireSession()).rejects.toThrow('redirect');
  expect(redirect).toHaveBeenCalledWith('/login');
  expect(fetchMock).not.toHaveBeenCalled();
});

it('rejects a forged cookie using backend validation', async () => {
  cookie.mockReturnValue({ value: 'forged' });
  redirect.mockImplementation(() => {
    throw new Error('redirect');
  });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
  await expect(requireSession()).rejects.toThrow('redirect');
  expect(redirect).toHaveBeenCalledWith('/login');
});

it('reads the backend session without caching private data', async () => {
  cookie.mockReturnValue({ value: 'valid' });
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ email: 'owner@example.com' }));
  vi.stubGlobal('fetch', fetchMock);
  await expect(requireSession()).resolves.toEqual({ email: 'owner@example.com' });
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('/api/auth/session'),
    expect.objectContaining({
      cache: 'no-store',
      headers: { Cookie: 'app_session=valid' },
    }),
  );
});

it('fails closed when the backend is unavailable', async () => {
  cookie.mockReturnValue({ value: 'valid' });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
  await expect(requireSession()).rejects.toThrow('Authentication service unavailable');
});
