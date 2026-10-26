import request from 'supertest';
import { expect, it, vi } from 'vitest';

import { createApp } from '@/app.js';
import { userService } from '@/modules/user/user.service.js';

vi.mock('@/modules/user/user.service.js', () => ({
  userService: {
    create: vi.fn().mockResolvedValue({ id: 'example', email: 'john@example.com' }),
    list: vi.fn().mockResolvedValue({ items: [], meta: { total: 0 } }),
  },
}));

it('lists users without credentials while preserving query validation', async () => {
  const app = createApp();
  const response = await request(app).get('/api/v1/users');
  expect(response.status).toBe(200);
  expect(userService.list).toHaveBeenCalledOnce();

  const invalid = await request(app).get('/api/v1/users?limit=0');
  expect(invalid.status).toBe(422);
  expect(userService.list).toHaveBeenCalledOnce();
});

it('creates a user with an email and no password', async () => {
  const response = await request(createApp())
    .post('/api/v1/users')
    .send({ email: 'john@example.com' });
  expect(response.status).toBe(201);
  expect(userService.create).toHaveBeenCalledWith({ email: 'john@example.com' });
});
