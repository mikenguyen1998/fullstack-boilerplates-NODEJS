import { AxiosError, AxiosHeaders } from 'axios';
import { expect, it, vi } from 'vitest';

import { api } from './axios';

it('returns a 401 error without refreshing tokens or retrying the request', async () => {
  const adapter = vi.fn((config) =>
    Promise.reject(
      new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, undefined, {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Access denied' },
        headers: new AxiosHeaders(),
        config,
      }),
    ),
  );

  await expect(api.get('/users', { adapter })).rejects.toMatchObject({ message: 'Access denied' });
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(adapter.mock.calls[0]?.[0].headers.has('Authorization')).toBe(false);
  expect(adapter.mock.calls[0]?.[0].headers.has('Accept-Language')).toBe(true);
});
