import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { openApiSpec } from './openapi.js';

/** Mounts Swagger UI at /docs and the raw spec at /docs.json. */
export function setupSwagger(app: Express): void {
  app.get('/docs.json', (_req, res) => {
    res.json(openApiSpec);
  });
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'Express Base API Docs',
      swaggerOptions: { persistAuthorization: true },
    }),
  );
}
