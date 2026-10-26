import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

/**
 * E2E skeleton — cần PostgreSQL đang chạy và file `.env` (hoặc `.env.test`) hợp lệ.
 *   docker compose up -d postgres
 *   npm run migration:run
 *   npm run test:e2e
 */
describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Giữ giống main.ts (global guards/pipes/filters/interceptors đã khai báo trong AppModule)
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/health/live -> 200', () => {
    return request(app.getHttpServer())
      .get('/api/health/live')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('status', 'ok');
      });
  });

  it('GET /api/v1/auth/me returns 404', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toMatchObject({ success: false, statusCode: 404 });
      });
  });

  it('POST /api/v1/users validates payload without credentials -> 400', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({ email: 'not-an-email' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false);
        expect(Array.isArray(body.errors)).toBe(true);
      });
  });
});
