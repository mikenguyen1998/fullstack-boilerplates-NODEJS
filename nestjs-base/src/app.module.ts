import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { join } from 'path';
import type { IncomingMessage } from 'http';

import { LANG_HEADER, REQUEST_ID_HEADER } from './common/constants';
import { AllExceptionsFilter } from './common/filters';
import {
  JwtAuthGuard,
  RolesGuard,
  ThrottlerBehindProxyGuard,
} from './common/guards';
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformResponseInterceptor,
} from './common/interceptors';
import { LoggerMiddleware, RequestIdMiddleware } from './common/middlewares';
import { createValidationPipe } from './common/pipes';
import {
  appConfig,
  databaseConfig,
  envValidationSchema,
  jwtConfig,
  redisConfig,
} from './config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // ---------- Config ----------
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false, allowUnknown: true },
    }),

    // ---------- Logger (pino) ----------
    LoggerModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (app: ConfigType<typeof appConfig>) => ({
        pinoHttp: {
          level: app.logLevel,
          // Access log do LoggerMiddleware đảm nhiệm -> tắt autoLogging để tránh trùng
          autoLogging: false,
          genReqId: (req: IncomingMessage) => {
            const header = req.headers[REQUEST_ID_HEADER];
            return typeof header === 'string' ? header : randomUUID();
          },
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.headers["x-api-key"]',
              'req.body.password',
              'req.body.refreshToken',
            ],
            censor: '[REDACTED]',
          },
          transport: app.isProduction
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:HH:MM:ss.l',
                  ignore: 'pid,hostname,req,res',
                },
              },
        },
      }),
    }),

    // ---------- i18n (en / vi) ----------
    I18nModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (app: ConfigType<typeof appConfig>) => ({
        fallbackLanguage: app.fallbackLanguage,
        loaderOptions: {
          path: join(__dirname, 'i18n'),
          watch: !app.isProduction,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver([LANG_HEADER]),
        AcceptLanguageResolver,
      ],
    }),

    // ---------- Rate limit ----------
    ThrottlerModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (app: ConfigType<typeof appConfig>) => ({
        throttlers: [
          { name: 'default', ttl: app.throttleTtlMs, limit: app.throttleLimit },
        ],
        errorMessage: 'common.TOO_MANY_REQUESTS',
      }),
    }),

    // ---------- Infrastructure ----------
    DatabaseModule,

    // ---------- Feature modules ----------
    HealthModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    // Guards (thứ tự thực thi: Throttler -> JWT -> Roles)
    { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },

    // Pipes
    { provide: APP_PIPE, useFactory: createValidationPipe },

    // Filters
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    // Interceptors (request: trên -> dưới, response: dưới -> trên)
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*path');
  }
}
