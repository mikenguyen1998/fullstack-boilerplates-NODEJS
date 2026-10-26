import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  opts: { path: string; title: string },
): void {
  const config = new DocumentBuilder()
    .setTitle(opts.title)
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(opts.path, app, document);
}
