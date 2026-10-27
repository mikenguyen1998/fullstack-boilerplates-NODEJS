// @vitest-environment node
import { once } from 'node:events';
import { createServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import { expect, it, vi } from 'vitest';

it('proxies sessions to the configured backend instead of a fixed service', async () => {
  const backend = createServer((request, response) => {
    response.writeHead(request.url === '/api/auth/session' ? 200 : 404, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({ email: 'node@example.com' }));
  });
  backend.listen(0, '127.0.0.1');
  await once(backend, 'listening');
  const address = backend.address();
  if (!address || typeof address === 'string') throw new Error('No backend address');
  vi.stubEnv('AUTH_BACKEND_URL', `http://127.0.0.1:${address.port}`);
  const web = await createViteServer({ server: { host: '127.0.0.1', port: 0 } });
  try {
    await web.listen();
    const webAddress = web.httpServer?.address();
    if (!webAddress || typeof webAddress === 'string') throw new Error('No web address');
    const response = await fetch(`http://127.0.0.1:${webAddress.port}/api/auth/session`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ email: 'node@example.com' });
  } finally {
    await web.close();
    backend.closeAllConnections();
    await new Promise<void>((resolve) => backend.close(() => resolve()));
    vi.unstubAllEnvs();
  }
});
