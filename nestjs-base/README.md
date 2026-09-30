# NestJS Base — Boilerplate backend production-ready

Boilerplate **NestJS 11 + TypeScript** gồm sẵn: TypeORM/PostgreSQL, JWT auth (access + refresh token), phân quyền theo role, rate limit, i18n (en/vi), logging bằng pino, Swagger, health check, Docker.

## Mục lục

- [Tính năng](#tính-năng)
- [Yêu cầu](#yêu-cầu)
- [Bắt đầu nhanh](#bắt-đầu-nhanh)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Scripts](#scripts)
- [Cấu hình & biến môi trường](#cấu-hình--biến-môi-trường)
- [Format response](#format-response)
- [Xác thực & Guards](#xác-thực--guards)
- [Database & migrations](#database--migrations)
- [Đổi sang DB khác](#đổi-sang-db-khác)
- [i18n](#i18n)
- [Logging](#logging)
- [Testing](#testing)
- [Docker](#docker)

## Tính năng

| Nhóm | Thư viện / cách làm |
| --- | --- |
| Framework | NestJS 11 (Express), TypeScript 5 |
| Config | `@nestjs/config` + **Joi** validate env, namespace có kiểu: `app`, `database`, `jwt`, `redis` |
| Database | **TypeORM + PostgreSQL** (`pg`), migrations, `BaseEntity` (uuid, createdAt, updatedAt, deletedAt – soft delete) |
| DB khác | Ví dụ comment sẵn: MySQL/MariaDB, SQLite, MSSQL, Oracle, MongoDB (mongoose), Redis (ioredis / cache-manager), Prisma |
| Auth | `passport-local` (login), `passport-jwt` (access), strategy `jwt-refresh` (refresh token rotation, hash lưu DB), bcrypt |
| Guards | `JwtAuthGuard` (global) + `@Public()`, `RolesGuard` (global) + `@Roles()`, `ThrottlerGuard` (global), `ApiKeyGuard` (tuỳ chọn) |
| Common | Filters, interceptors (transform response, logging, timeout), ValidationPipe, middleware request-id & access log |
| API | Prefix `api`, URI versioning `v1`, Swagger tại `/docs` (Bearer + API key) |
| Bảo mật | helmet, CORS, compression, rate limit, redact log nhạy cảm |
| Observability | `nestjs-pino` (pino-pretty ở dev, JSON ở prod), request id, `@nestjs/terminus` health check |
| i18n | `nestjs-i18n` — tiếng Anh & tiếng Việt |
| Chất lượng | ESLint (typescript-eslint, type-checked) + Prettier, Jest unit test + e2e |
| Deploy | Dockerfile multi-stage (non-root, tini), docker-compose (app + postgres, các DB khác comment) |

## Yêu cầu

- Node.js >= 20.11 (khuyến nghị 22 LTS)
- npm >= 10
- Docker (tuỳ chọn, để chạy PostgreSQL)

## Bắt đầu nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file môi trường
cp .env.example .env
#   -> đổi JWT_ACCESS_SECRET / JWT_REFRESH_SECRET (openssl rand -base64 48)

# 3. Chạy PostgreSQL
docker compose up -d postgres

# 4. Chạy migrations (hoặc để DB_MIGRATIONS_RUN=true, app tự chạy khi khởi động)
npm run migration:run

# 5. Chạy dev (watch mode)
npm run start:dev
```

- API: <http://localhost:3000/api/v1>
- Swagger: <http://localhost:3000/docs>
- Health: <http://localhost:3000/api/health> (readiness) · <http://localhost:3000/api/health/live> (liveness)

## Cấu trúc thư mục

```
nestjs-base/
├── src/
│   ├── common/                     # Thành phần dùng chung
│   │   ├── constants/              # Metadata keys, header names, pagination defaults
│   │   ├── decorators/             # @Public, @Roles, @CurrentUser, @SkipTransform, @ApiPaginatedResponse
│   │   ├── dto/                    # PaginationDto
│   │   ├── enums/                  # Role, SortOrder
│   │   ├── filters/                # AllExceptionsFilter (error shape thống nhất + i18n)
│   │   ├── guards/                 # JwtAuthGuard, RolesGuard, ThrottlerBehindProxyGuard, ApiKeyGuard
│   │   ├── interceptors/           # TransformResponse, Logging, Timeout
│   │   ├── interfaces/             # ApiResponse, JwtPayload, AppRequest
│   │   ├── middlewares/            # RequestIdMiddleware, LoggerMiddleware
│   │   ├── pipes/                  # createValidationPipe()
│   │   └── utils/                  # paginate()
│   ├── config/                     # app/database/jwt/redis config, Joi schema, swagger
│   ├── database/
│   │   ├── entities/               # BaseEntity
│   │   ├── migrations/             # TypeORM migrations
│   │   ├── data-source.ts          # DataSource cho TypeORM CLI
│   │   ├── typeorm.options.ts      # Options dùng chung (runtime + CLI)
│   │   ├── database.module.ts      # TypeOrmModule.forRootAsync (PostgreSQL)
│   │   └── database.alternatives.ts# Ví dụ MySQL/MariaDB/SQLite/MSSQL/Oracle/Mongo/Redis/Prisma (comment)
│   ├── i18n/{en,vi}/               # File dịch: common.json, auth.json, users.json
│   ├── modules/
│   │   ├── auth/                   # register/login/refresh/logout/me, strategies, guards, dto
│   │   ├── users/                  # entity, service, controller, dto
│   │   └── health/                 # terminus health check
│   ├── app.module.ts
│   └── main.ts
├── test/                           # e2e tests
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Scripts

| Script | Mô tả |
| --- | --- |
| `npm run start:dev` | Chạy dev + watch |
| `npm run start:debug` | Chạy debug + watch |
| `npm run build` | Build ra `dist/` |
| `npm run start:prod` | Chạy bản build (`node dist/main`) |
| `npm run lint` / `lint:check` | ESLint (có / không auto-fix) |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` / `test:watch` / `test:cov` | Unit test (Jest) |
| `npm run test:e2e` | E2E test (cần PostgreSQL) |
| `npm run migration:generate --name=AddPostTable` | Sinh migration từ thay đổi entity |
| `npm run migration:create --name=SeedSomething` | Tạo migration rỗng |
| `npm run migration:run` / `migration:revert` / `migration:show` | Chạy / rollback / xem trạng thái migration |
| `npm run migration:run:prod` | Chạy migration từ `dist/` (production) |

## Cấu hình & biến môi trường

- Toàn bộ biến môi trường được **validate bằng Joi** (`src/config/env.validation.ts`). Thiếu biến bắt buộc → app dừng ngay khi khởi động.
- Config được chia namespace có kiểu, inject theo cách type-safe:

```ts
import type { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';

constructor(@Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>) {}
// this.jwt.accessSecret, this.jwt.accessExpiresIn ...
```

Xem đầy đủ trong `.env.example`.

## Format response

**Thành công** (`TransformResponseInterceptor`):

```json
{
  "success": true,
  "data": { "id": "…", "email": "john@example.com" },
  "meta": { "timestamp": "2026-01-01T00:00:00.000Z", "requestId": "…" }
}
```

Phân trang: trả về `paginate(items, total, page, limit)` từ service → `data` là mảng, `meta` có `page, limit, total, totalPages`.
Muốn trả response "raw" (file, health check…) → gắn `@SkipTransform()`.

**Lỗi** (`AllExceptionsFilter`):

```json
{
  "success": false,
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Dữ liệu không hợp lệ",
  "errors": [{ "field": "email", "message": "email must be an email" }],
  "path": "/api/v1/auth/register",
  "method": "POST",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "requestId": "…"
}
```

Filter tự map lỗi TypeORM: unique violation (`23505`) → 409, `EntityNotFoundError` → 404.

## Xác thực & Guards

### Luồng auth

| Endpoint | Mô tả |
| --- | --- |
| `POST /api/v1/auth/register` | Đăng ký (public) → trả `accessToken`, `refreshToken`, `user` |
| `POST /api/v1/auth/login` | Đăng nhập email + password (public, LocalAuthGuard) |
| `POST /api/v1/auth/refresh` | Body `{ refreshToken }` → cặp token mới (rotation; token cũ dùng lại sẽ bị từ chối và thu hồi phiên) |
| `POST /api/v1/auth/logout` | Thu hồi refresh token |
| `GET /api/v1/auth/me` | Thông tin user hiện tại |

Gửi access token: `Authorization: Bearer <accessToken>`.

### Guards global (đăng ký trong `app.module.ts`, thứ tự: Throttler → JWT → Roles)

**1. JwtAuthGuard** — mọi route mặc định **yêu cầu đăng nhập**. Mở public bằng `@Public()`:

```ts
@Public()
@Get('ping')
ping() { return 'pong'; }
```

**2. RolesGuard** — giới hạn theo role với `@Roles()` (áp dụng cho method hoặc cả controller):

```ts
@Roles(Role.ADMIN)
@Delete(':id')
remove(@Param('id', ParseUUIDPipe) id: string) {}
```

**3. ThrottlerGuard** (`ThrottlerBehindProxyGuard`, đọc IP thật sau proxy) — mặc định `THROTTLE_LIMIT` request / `THROTTLE_TTL_MS`:

```ts
@Throttle({ default: { limit: 5, ttl: 60_000 } }) // tuỳ chỉnh theo route
@SkipThrottle()                                   // bỏ qua
```

**4. ApiKeyGuard** (tuỳ chọn, không global) — xác thực header `x-api-key` với danh sách `API_KEYS`:

```ts
@Public()               // bỏ qua JWT
@UseGuards(ApiKeyGuard) // chỉ cần API key
@Post('webhook')
handleWebhook() {}
```

### Lấy user hiện tại

```ts
@Get('profile')
profile(@CurrentUser() user: AuthUser) {}          // { id, email, role }

@Get('my-id')
myId(@CurrentUser('id') userId: string) {}
```

> Tạo admin đầu tiên: đăng ký bình thường rồi cập nhật trong DB
> `UPDATE users SET role = 'admin' WHERE email = '...';` (hoặc viết migration seed).

## Database & migrations

- Kết nối chính: **PostgreSQL** qua `TypeOrmModule.forRootAsync` (`src/database/database.module.ts`), `autoLoadEntities: true`.
- Entity mới nên kế thừa `BaseEntity` (`src/database/entities/base.entity.ts`) và đăng ký qua `TypeOrmModule.forFeature([...])` trong module.
- `DB_SYNCHRONIZE=false` ở mọi môi trường thật — dùng migrations:

```bash
# Sửa entity -> sinh migration
npm run migration:generate --name=AddPhoneToUsers
npm run migration:run
```

- `src/database/data-source.ts` là DataSource cho TypeORM CLI, đọc `.env` và dùng chung `buildTypeOrmOptions()` với runtime.

## Đổi sang DB khác

Mọi ví dụ nằm trong **`src/database/database.alternatives.ts`** (đã comment, copy-paste được). Chỉ `pg` đang được cài.

| DB | Package cần cài | Cách làm |
| --- | --- | --- |
| MySQL / MariaDB | `npm i mysql2` | Thay block `type: 'postgres'` trong `typeorm.options.ts` bằng `mysqlOptions` (`type: 'mysql'` / `'mariadb'`) |
| SQLite | `npm i sqlite3` (hoặc `better-sqlite3`) | Dùng `sqliteOptions` |
| MSSQL | `npm i mssql` | Dùng `mssqlOptions` |
| Oracle | `npm i oracledb` | Dùng `oracleOptions` |
| MongoDB | `npm i @nestjs/mongoose mongoose` | `MongooseModule.forRootAsync(...)` + schema (không dùng TypeORM entity) |
| Redis (cache) | `npm i @nestjs/cache-manager cache-manager @keyv/redis keyv` | `CacheModule.registerAsync(...)` |
| Redis (client) | `npm i ioredis` | `RedisModule` với provider `REDIS_CLIENT` |
| Prisma | `npm i -D prisma && npm i @prisma/client` | Thay TypeORM bằng `PrismaService` (xem ghi chú trong file) |

Các bước chung khi đổi DB TypeORM:

1. `npm uninstall pg && npm i <driver>`
2. Sửa `buildTypeOrmOptions()` trong `src/database/typeorm.options.ts`.
3. Cập nhật `.env` (có sẵn block mẫu comment trong `.env.example`).
4. Đổi kiểu cột đặc thù Postgres trong entity (`timestamptz`, `enum`, …) — xem ghi chú ở từng block.
5. Xoá migrations cũ, sinh lại: `npm run migration:generate --name=Init`.
6. Bỏ comment service DB tương ứng trong `docker-compose.yml`.
7. Health check: đổi indicator trong `health.controller.ts` nếu cần (vd `MongooseHealthIndicator`).

Chạy **nhiều kết nối song song**: xem ví dụ named connection trong comment của `database.module.ts`.

## i18n

- File dịch: `src/i18n/{en,vi}/*.json` (tự copy vào `dist/` khi build).
- Ngôn ngữ được xác định theo thứ tự: query `?lang=vi` → header `x-lang: vi` → `Accept-Language`, fallback `FALLBACK_LANGUAGE`.
- Throw exception với **i18n key**, filter sẽ tự dịch:

```ts
throw new NotFoundException('users.NOT_FOUND'); // -> "Không tìm thấy người dùng" (vi)
```

- Dùng trực tiếp trong service: inject `I18nService` hoặc `I18nContext.current()?.t('common.NOT_FOUND')`.

## Logging

- `nestjs-pino`: dev → `pino-pretty` dễ đọc; production → JSON (phù hợp ELK / Loki / CloudWatch).
- `RequestIdMiddleware`: gắn `x-request-id` (tái sử dụng nếu gateway gửi lên) vào request/response và mọi response body.
- `LoggerMiddleware`: access log `METHOD URL STATUS ms [requestId]`; `LoggingInterceptor`: log thời gian handler ở mức `debug`.
- Tự động redact `authorization`, `cookie`, `x-api-key`, `password`, `refreshToken`.

## Testing

```bash
npm test          # unit tests (không cần DB)
npm run test:cov  # coverage

# e2e (cần PostgreSQL + .env)
docker compose up -d postgres
npm run migration:run
npm run test:e2e
```

Unit test mẫu: `auth.service.spec.ts`, `users.service.spec.ts`, `roles.guard.spec.ts`, `transform-response.interceptor.spec.ts`.

## Docker

```bash
cp .env.example .env    # chỉnh secret
docker compose up -d --build
docker compose logs -f app
```

- `Dockerfile` 3 stage: `deps` → `build` (compile + prune devDeps) → `runtime` (node:22-slim, user `node`, `tini` để nhận SIGTERM, HEALTHCHECK `/api/health/live`).
- App bật `enableShutdownHooks()` → đóng kết nối DB gọn gàng khi container dừng.
- Các service MySQL, MariaDB, MSSQL, Oracle, MongoDB, Redis có sẵn trong `docker-compose.yml` (đang comment).
