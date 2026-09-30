import { Logger as NestLogger, VersioningType } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { REQUEST_ID_HEADER } from './common/constants';
import { appConfig, setupSwagger } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  // ---------- Security & performance ----------
  app.set('trust proxy', 1); // cần khi chạy sau Nginx / Load balancer
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: config.corsOrigins.includes('*') ? true : config.corsOrigins,
    credentials: true,
    exposedHeaders: [REQUEST_ID_HEADER],
  });

  // ---------- Routing ----------
  app.setGlobalPrefix(config.apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.defaultVersion,
  });

  // ---------- Swagger ----------
  if (config.swaggerEnabled) {
    setupSwagger(app, { path: config.swaggerPath, title: config.name });
  }

  // ---------- Graceful shutdown (SIGTERM / SIGINT) ----------
  app.enableShutdownHooks();

  await app.listen(config.port, '0.0.0.0');

  const url = await app.getUrl();
  const logger = new NestLogger('Bootstrap');
  logger.log(
    `🚀 ${config.name} [${config.env}] running at ${url}/${config.apiPrefix}`,
  );
  if (config.swaggerEnabled) {
    logger.log(`📚 Swagger docs at ${url}/${config.swaggerPath}`);
  }
}

void bootstrap();
