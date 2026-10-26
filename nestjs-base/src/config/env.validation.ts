import * as Joi from 'joi';

/**
 * Validate biến môi trường ngay khi ứng dụng khởi động.
 * Thiếu / sai kiểu => app sẽ fail-fast với thông báo rõ ràng.
 */
export const envValidationSchema = Joi.object({
  // ---------- App ----------
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  APP_NAME: Joi.string().default('nestjs-base'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().default('api'),
  API_DEFAULT_VERSION: Joi.string().default('1'),
  CORS_ORIGINS: Joi.string().default('*'),
  REQUEST_TIMEOUT_MS: Joi.number().integer().min(1000).default(30000),
  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_PATH: Joi.string().default('docs'),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .default('info'),
  FALLBACK_LANGUAGE: Joi.string().valid('en', 'vi').default('en'),
  THROTTLE_TTL_MS: Joi.number().integer().min(1).default(60000),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),

  // ---------- Database (PostgreSQL) ----------
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),
  DB_SCHEMA: Joi.string().default('public'),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),
  DB_MIGRATIONS_RUN: Joi.boolean().default(false),
  DB_POOL_MAX: Joi.number().integer().min(1).default(10),

  // ---------- Redis (tùy chọn) ----------
  REDIS_ENABLED: Joi.boolean().default(false),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_DB: Joi.number().integer().min(0).default(0),
  REDIS_TTL_MS: Joi.number().integer().min(0).default(60000),
});
