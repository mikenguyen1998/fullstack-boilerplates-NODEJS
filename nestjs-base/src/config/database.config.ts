import { registerAs } from '@nestjs/config';

/**
 * Cấu hình DB chính (PostgreSQL).
 * Muốn đổi sang MySQL/MariaDB/MSSQL/Oracle/SQLite: xem `src/database/database.alternatives.ts`.
 */
export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'nestjs_base',
  schema: process.env.DB_SCHEMA ?? 'public',
  ssl: process.env.DB_SSL === 'true',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  poolMax: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
}));

export type DatabaseConfig = ReturnType<typeof databaseConfig>;
