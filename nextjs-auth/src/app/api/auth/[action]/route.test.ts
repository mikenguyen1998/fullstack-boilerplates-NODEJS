import { NextRequest } from 'next/server';
import { afterEach, expect, it, vi } from 'vitest';

import { GET, POST } from './route';

afterEach(() => vi.unstubAllGlobals());

it('passes browser CSRF headers and cookies to login, and returns the HttpOnly cookie', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    Response.json(
      { email: 'owner@example.com' },
      {
        headers: { 'Set-Cookie': 'app_session=new; Path=/; HttpOnly; SameSite=Lax' },
      },
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  const request = new NextRequest('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      Origin: 'http://localhost:3000',
      'X-CSRF-Protection': '1',
      Cookie: 'app_session=old; unrelated=secret',
    },
    body: JSON.stringify({ email: 'owner@example.com', password: 'test-password' }),
  });
  const response = await POST(request, { params: Promise.resolve({ action: 'login' }) });
  expect(response.status).toBe(200);
  expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  expect(response.headers.get('cache-control')).toBe('no-store');
  const options = fetchMock.mock.calls[0]![1];
  expect(options.headers.get('origin')).toBe('http://localhost:3000');
  expect(options.headers.get('x-csrf-protection')).toBe('1');
  expect(options.headers.get('cookie')).toBe('app_session=old');
});

it('does not invent an allowed origin or CSRF header for untrusted requests', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));
  vi.stubGlobal('fetch', fetchMock);
  const response = await POST(
    new NextRequest('http://localhost:3000/api/auth/logout', { method: 'POST' }),
    {
      params: Promise.resolve({ action: 'logout' }),
    },
  );
  expect(response.status).toBe(403);
  const headers = fetchMock.mock.calls[0]![1].headers;
  expect(headers.has('origin')).toBe(false);
  expect(headers.has('x-csrf-protection')).toBe(false);
});

it('does not forward arbitrary backend paths', async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  const response = await GET(new NextRequest('http://localhost:3000/api/auth/users'), {
    params: Promise.resolve({ action: 'users' }),
  });
  expect(response.status).toBe(404);
  expect(fetchMock).not.toHaveBeenCalled();
});

it('returns a non-cached service error if the backend is offline', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const response = await GET(new NextRequest('http://localhost:3000/api/auth/session'), {
    params: Promise.resolve({ action: 'session' }),
  });
  expect(response.status).toBe(502);
  expect(response.headers.get('cache-control')).toBe('no-store');
});
