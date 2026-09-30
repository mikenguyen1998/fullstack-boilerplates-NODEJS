/**
 * ============================================================================
 *  CẤU HÌNH DATABASE THAY THẾ (TẤT CẢ ĐỀU ĐANG ĐƯỢC COMMENT)
 * ============================================================================
 *
 *  Kết nối đang ACTIVE: PostgreSQL (TypeORM) — xem `database.module.ts`.
 *
 *  Cách đổi sang DB khác (TypeORM):
 *    1. Cài driver tương ứng (xem từng mục bên dưới).
 *    2. Sửa `buildTypeOrmOptions()` trong `typeorm.options.ts`
 *       (thay `type: 'postgres'` + các option đặc thù bằng block tương ứng).
 *    3. Cập nhật biến môi trường trong `.env` (DB_HOST, DB_PORT, ...).
 *    4. Sửa kiểu cột đặc thù Postgres trong entity (`timestamptz`, enum, uuid...)
 *       và tạo lại migrations (`npm run migration:generate --name=Init`).
 *    5. Bật service tương ứng trong `docker-compose.yml`.
 *
 *  Các block dưới đây là object `DataSourceOptions` — có thể dán thẳng vào
 *  `buildTypeOrmOptions()` (bỏ comment) để thay block postgres.
 * ============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1) MySQL / MariaDB (TypeORM)
//    npm i mysql2
//    docker: image mysql:8.4 hoặc mariadb:11 (port 3306)
// ─────────────────────────────────────────────────────────────────────────────
// export const mysqlOptions = (db: DatabaseConfig): DataSourceOptions => ({
//   type: 'mysql',            // MariaDB: dùng 'mariadb'
//   host: db.host,
//   port: db.port,            // 3306
//   username: db.username,
//   password: db.password,
//   database: db.database,
//   charset: 'utf8mb4_unicode_ci',
//   timezone: 'Z',
//   synchronize: false,
//   logging: db.logging,
//   entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
//   migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
//   extra: { connectionLimit: db.poolMax },
// });
// Lưu ý entity: đổi `timestamptz` -> `timestamp` (hoặc `datetime`).

// ─────────────────────────────────────────────────────────────────────────────
// 2) SQLite (TypeORM) — phù hợp dev/test/embedded
//    npm i sqlite3            (hoặc: npm i better-sqlite3 và type: 'better-sqlite3')
// ─────────────────────────────────────────────────────────────────────────────
// export const sqliteOptions = (): DataSourceOptions => ({
//   type: 'sqlite',
//   database: process.env.SQLITE_PATH ?? 'data/app.sqlite', // ':memory:' cho test
//   synchronize: false,
//   logging: false,
//   entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
//   migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
// });
// Lưu ý entity: `timestamptz` -> `datetime`, enum -> `simple-enum`.

// ─────────────────────────────────────────────────────────────────────────────
// 3) Microsoft SQL Server (TypeORM)
//    npm i mssql
//    docker: mcr.microsoft.com/mssql/server:2022-latest (port 1433)
// ─────────────────────────────────────────────────────────────────────────────
// export const mssqlOptions = (db: DatabaseConfig): DataSourceOptions => ({
//   type: 'mssql',
//   host: db.host,
//   port: db.port,            // 1433
//   username: db.username,
//   password: db.password,
//   database: db.database,
//   schema: 'dbo',
//   synchronize: false,
//   logging: db.logging,
//   options: {
//     encrypt: db.ssl,              // Azure SQL: true
//     trustServerCertificate: true, // dev / self-signed cert
//   },
//   pool: { max: db.poolMax },
//   entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
//   migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
// });
// Lưu ý entity: `timestamptz` -> `datetime2` (hoặc `datetimeoffset`).

// ─────────────────────────────────────────────────────────────────────────────
// 4) Oracle (TypeORM)
//    npm i oracledb
//    (node-oracledb >= 6 chạy "Thin mode" mặc định, không cần Oracle Instant Client)
//    docker: gvenzl/oracle-free:23-slim (port 1521)
// ─────────────────────────────────────────────────────────────────────────────
// export const oracleOptions = (db: DatabaseConfig): DataSourceOptions => ({
//   type: 'oracle',
//   host: db.host,
//   port: db.port,            // 1521
//   username: db.username,
//   password: db.password,
//   serviceName: process.env.ORACLE_SERVICE_NAME ?? 'FREEPDB1', // hoặc: sid: 'XE'
//   // connectString: 'host:1521/FREEPDB1',                      // thay cho host/port/serviceName
//   synchronize: false,
//   logging: db.logging,
//   entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
//   migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
// });
// Lưu ý entity: `timestamptz` -> `timestamp with time zone`, tên bảng/cột nên viết HOA
// hoặc luôn dùng quoted identifiers; `uuid` -> `varchar2(36)`.

// ─────────────────────────────────────────────────────────────────────────────
// 5) MongoDB (@nestjs/mongoose) — ODM riêng, KHÔNG dùng TypeORM entity
//    npm i @nestjs/mongoose mongoose
//    docker: mongo:8 (port 27017)
//    .env: MONGODB_URI=mongodb://root:root@localhost:27017/nestjs_base?authSource=admin
// ─────────────────────────────────────────────────────────────────────────────
// // app.module.ts (hoặc database.module.ts)
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigService } from '@nestjs/config';
//
// MongooseModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => ({
//     uri: config.getOrThrow<string>('MONGODB_URI'),
//     maxPoolSize: 10,
//     serverSelectionTimeoutMS: 5000,
//   }),
// }),
//
// // cats/schemas/cat.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';
//
// @Schema({ timestamps: true, collection: 'cats' })
// export class Cat {
//   @Prop({ required: true, index: true }) name: string;
//   @Prop() age?: number;
// }
// export type CatDocument = HydratedDocument<Cat>;
// export const CatSchema = SchemaFactory.createForClass(Cat);
//
// // cats/cats.module.ts
// MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])
//
// // cats/cats.service.ts
// constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}
//
// // Health check: MongooseHealthIndicator.pingCheck('mongodb') (@nestjs/terminus)

// ─────────────────────────────────────────────────────────────────────────────
// 6) Redis
//    Env đã có sẵn trong `src/config/redis.config.ts` (REDIS_*).
//    docker: redis:7-alpine (port 6379)
//
//  6a) Cache (@nestjs/cache-manager + Keyv Redis)
//      npm i @nestjs/cache-manager cache-manager @keyv/redis keyv
// ─────────────────────────────────────────────────────────────────────────────
// // app.module.ts
// import { CacheModule } from '@nestjs/cache-manager';
// import KeyvRedis from '@keyv/redis';
// import { redisConfig } from './config/redis.config';
//
// CacheModule.registerAsync({
//   isGlobal: true,
//   inject: [redisConfig.KEY],
//   useFactory: (redis: ConfigType<typeof redisConfig>) => ({
//     ttl: redis.ttlMs,
//     stores: [
//       new KeyvRedis(
//         `redis://${redis.password ? `:${redis.password}@` : ''}${redis.host}:${redis.port}/${redis.db}`,
//       ),
//     ],
//   }),
// }),
//
// // Sử dụng:
// constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
// await this.cache.set('key', value, 60_000);
// const v = await this.cache.get<string>('key');
// // Hoặc cache response GET: @UseInterceptors(CacheInterceptor)

// ─────────────────────────────────────────────────────────────────────────────
//  6b) Redis client trực tiếp (ioredis) — pub/sub, lock, queue, rate-limit store...
//      npm i ioredis
// ─────────────────────────────────────────────────────────────────────────────
// // src/database/redis/redis.module.ts
// import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
// import type { ConfigType } from '@nestjs/config';
// import Redis from 'ioredis';
// import { redisConfig } from '../../config/redis.config';
//
// export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
//
// @Global()
// @Module({
//   providers: [
//     {
//       provide: REDIS_CLIENT,
//       inject: [redisConfig.KEY],
//       useFactory: (cfg: ConfigType<typeof redisConfig>) =>
//         new Redis({
//           host: cfg.host,
//           port: cfg.port,
//           password: cfg.password,
//           db: cfg.db,
//           maxRetriesPerRequest: 3,
//           lazyConnect: false,
//         }),
//     },
//   ],
//   exports: [REDIS_CLIENT],
// })
// export class RedisModule implements OnApplicationShutdown {
//   constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}
//   async onApplicationShutdown() {
//     await this.redis.quit();
//   }
// }
//
// // Sử dụng: constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}
// // Throttler lưu trên Redis (multi-instance): npm i @nest-lab/throttler-storage-redis
// //   ThrottlerModule.forRootAsync({ ..., useFactory: () => ({ throttlers: [...],
// //     storage: new ThrottlerStorageRedisService(redisClient) }) })

// ─────────────────────────────────────────────────────────────────────────────
// 7) Prisma (thay thế TypeORM)
// ─────────────────────────────────────────────────────────────────────────────
//  Nếu muốn dùng Prisma thay vì TypeORM:
//    npm i -D prisma && npm i @prisma/client
//    npx prisma init --datasource-provider postgresql   (mysql | sqlserver | sqlite | mongodb | cockroachdb)
//  - Khai báo model trong prisma/schema.prisma, chạy `npx prisma migrate dev`.
//  - Gỡ TypeORM: xoá DatabaseModule khỏi AppModule, xoá entities/migrations/data-source.ts.
//  - Tạo PrismaService:
//
// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
//
// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
//   async onModuleInit() { await this.$connect(); }
//   async onModuleDestroy() { await this.$disconnect(); }
// }
//
//  - Đăng ký PrismaService trong một @Global() PrismaModule và inject vào service.
//  - Health check: PrismaHealthIndicator.pingCheck('database', prismaService).
//  - AllExceptionsFilter: map `Prisma.PrismaClientKnownRequestError` (P2002 -> 409, P2025 -> 404).

export {};
