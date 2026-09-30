import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_KEY_HEADER } from '../common/constants';

export function setupSwagger(
  app: INestApplication,
  opts: { path: string; title: string },
): void {
  const config = new DocumentBuilder()
    .setTitle(opts.title)
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addApiKey(
      { type: 'apiKey', name: API_KEY_HEADER, in: 'header' },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(opts.path, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
