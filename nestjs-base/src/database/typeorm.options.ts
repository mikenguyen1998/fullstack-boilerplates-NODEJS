import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from '../config/database.config';

/**
 * Build TypeORM options dùng chung cho:
 *  - DatabaseModule (runtime NestJS)
 *  - data-source.ts (TypeORM CLI: migration:generate / run / revert)
 */
// .ts khi chạy bằng ts-node (CLI/dev), .js khi chạy từ dist (tránh nạp nhầm *.d.ts)
const EXT = __filename.endsWith('.ts') ? 'ts' : 'js';

export function buildTypeOrmOptions(db: DatabaseConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    schema: db.schema,
    ssl: db.ssl ? { rejectUnauthorized: false } : false,
    synchronize: db.synchronize, // KHÔNG bật ở production, hãy dùng migrations
    logging: db.logging,
    migrationsRun: db.migrationsRun,
    migrationsTableName: 'migrations',
    entities: [join(__dirname, '..', '**', `*.entity.${EXT}`)],
    migrations: [join(__dirname, 'migrations', `*.${EXT}`)],
    extra: { max: db.poolMax },
  };
}
