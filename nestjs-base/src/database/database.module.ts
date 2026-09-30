import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';
import { buildTypeOrmOptions } from './typeorm.options';

/**
 * Kết nối DB chính: PostgreSQL qua TypeORM.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Muốn đổi DB? Xem ví dụ đầy đủ (copy-paste được) trong:
 *   src/database/database.alternatives.ts
 *     - MySQL / MariaDB (TypeORM)      - SQLite (TypeORM)
 *     - MSSQL (TypeORM)                - Oracle (TypeORM)
 *     - MongoDB (@nestjs/mongoose)     - Redis (ioredis / cache-manager)
 *     - Ghi chú về Prisma
 *
 * Ví dụ nhanh chạy SONG SONG một kết nối thứ 2 (named connection):
 *
 *   TypeOrmModule.forRootAsync({
 *     name: 'mysql',                               // tên connection
 *     inject: [ConfigService],
 *     useFactory: (config: ConfigService) => ({
 *       type: 'mysql',
 *       host: config.get('MYSQL_HOST'),
 *       port: config.get<number>('MYSQL_PORT', 3306),
 *       username: config.get('MYSQL_USER'),
 *       password: config.get('MYSQL_PASSWORD'),
 *       database: config.get('MYSQL_DB'),
 *       autoLoadEntities: true,
 *     }),
 *   }),
 *   // Trong feature module: TypeOrmModule.forFeature([Order], 'mysql')
 *   // Inject: @InjectRepository(Order, 'mysql')
 * ─────────────────────────────────────────────────────────────────────────────
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (db: ConfigType<typeof databaseConfig>) => ({
        ...buildTypeOrmOptions(db),
        // Runtime: tự nạp entity đã đăng ký qua TypeOrmModule.forFeature()
        entities: [],
        autoLoadEntities: true,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
  ],
})
export class DatabaseModule {}
