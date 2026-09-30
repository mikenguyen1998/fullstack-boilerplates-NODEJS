import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '@/app.js';

// These tests never touch the database: the Prisma client is created lazily
// and only the liveness endpoints are exercised.
const app = createApp();

describe('Health', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: { status: 'ok' } });
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('GET /api/v1/health returns localized message (vi)', async () => {
    const res = await request(app).get('/api/v1/health').set('Accept-Language', 'vi');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Dịch vụ hoạt động bình thường');
  });

  it('returns standardized 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, error: { code: 'NOT_FOUND' } });
  });

  it('protects /auth/me with JWT', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('validates request body with Zod', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
