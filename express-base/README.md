# Express Base

Boilerplate backend **Node.js + Express 5 + TypeScript** sẵn sàng cho production: cấu hình env có kiểm tra bằng Zod, JWT auth + phân quyền theo role, Prisma (PostgreSQL), i18n (en/vi), Swagger, logging bằng pino, graceful shutdown, ESLint/Prettier, Vitest và Docker.

## Công nghệ chính

| Nhóm                | Thư viện                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Runtime / Framework | Node.js ≥ 22.12, Express 5, TypeScript 6 (strict, ESM)                                        |
| Dev / Build         | `tsx` (watch), `tsc` + `tsc-alias` (alias `@/` → `src/`)                                      |
| Cấu hình            | `dotenv` + `zod` (`src/config/env.ts`)                                                        |
| Bảo mật             | `helmet`, `cors`, `express-rate-limit`, `compression`                                         |
| Logging             | `pino`, `pino-http`, `pino-pretty` (chỉ ở môi trường dev)                                     |
| Auth                | `jsonwebtoken` (access + refresh token), `bcryptjs`                                           |
| Database            | Prisma 7 + PostgreSQL (`@prisma/adapter-pg`) — kèm ví dụ MongoDB / MySQL / Redis (đã comment) |
| i18n                | `i18next` + `i18next-http-middleware` (en, vi)                                                |
| API docs            | `swagger-ui-express` (OpenAPI 3.1) tại `/docs`                                                |
| Chất lượng code     | ESLint (flat config) + `typescript-eslint`, Prettier                                          |
| Test                | Vitest + Supertest                                                                            |

## Cấu trúc thư mục

```
express-base/
├── prisma/
│   └── schema.prisma            # Model User, enum Role
├── prisma.config.ts             # Cấu hình Prisma CLI (schema, migrations, DATABASE_URL)
├── src/
│   ├── app.ts                   # Khởi tạo Express app + middlewares (dùng cho cả test)
│   ├── server.ts                # Entry point: kết nối DB, listen, graceful shutdown
│   ├── routes.ts                # Gom router của các module dưới API_PREFIX
│   ├── config/
│   │   ├── env.ts               # Đọc & validate biến môi trường bằng Zod
│   │   ├── logger.ts            # pino logger
│   │   └── i18n.ts              # Cấu hình i18next
│   ├── database/
│   │   ├── prisma.ts            # PrismaClient singleton (PostgreSQL)
│   │   ├── index.ts             # connect/disconnect tất cả datastore
│   │   ├── mongoose.example.ts  # (comment) MongoDB + mongoose
│   │   ├── mysql.example.ts     # (comment) MySQL: Prisma adapter hoặc mysql2
│   │   └── redis.example.ts     # (comment) Redis + ioredis
│   ├── docs/                    # OpenAPI spec + Swagger UI
│   ├── locales/                 # en.ts, vi.ts — thông điệp API
│   ├── middlewares/             # auth, validate, error-handler, not-found, rate-limit, request-id, http-logger, security
│   ├── modules/
│   │   ├── auth/                # register / login / refresh / me
│   │   ├── user/                # CRUD user (ADMIN), có phân trang
│   │   └── health/              # liveness / readiness
│   ├── types/                   # Kiểu dùng chung, mở rộng Express.Request
│   ├── utils/                   # errors (AppError/HttpError), response, pagination, jwt, async-handler
│   └── generated/prisma/        # Prisma Client (sinh tự động, không commit)
├── tests/                       # Vitest + Supertest
├── Dockerfile                   # Multi-stage build
├── docker-compose.yml           # app + postgres (mongo/mysql/redis đã comment sẵn)
└── eslint.config.js, .prettierrc, tsconfig*.json, vitest.config.ts
```

Mỗi module gồm: `*.routes.ts` (định tuyến) → `*.controller.ts` (xử lý request/response) → `*.service.ts` (nghiệp vụ, truy cập DB) và `*.schema.ts` (Zod validation).

## Bắt đầu nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file môi trường
cp .env.example .env        # sửa JWT_*_SECRET, DATABASE_URL...

# 3. Chạy PostgreSQL (hoặc dùng DB có sẵn)
docker compose up -d postgres

# 4. Sinh Prisma Client & chạy migration
npm run prisma:generate
npm run prisma:migrate      # lần đầu sẽ hỏi tên migration, ví dụ: init

# 5. Chạy dev (watch mode)
npm run dev
```

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs` (spec JSON: `/docs.json`)
- Health: `GET /health` (liveness, không cần DB), `GET /api/v1/health/ready` (kiểm tra DB)

## Scripts

| Script                            | Mô tả                                         |
| --------------------------------- | --------------------------------------------- |
| `npm run dev`                     | Chạy dev với `tsx watch` (tự reload)          |
| `npm run build`                   | Build ra `dist/` bằng `tsc` + `tsc-alias`     |
| `npm start`                       | Chạy bản build (`node dist/server.js`)        |
| `npm run lint` / `lint:fix`       | ESLint                                        |
| `npm run format` / `format:check` | Prettier                                      |
| `npm test` / `test:watch`         | Vitest                                        |
| `npm run typecheck`               | Kiểm tra kiểu TypeScript (không emit)         |
| `npm run prisma:generate`         | Sinh Prisma Client vào `src/generated/prisma` |
| `npm run prisma:migrate`          | Tạo & áp dụng migration (dev)                 |
| `npm run prisma:deploy`           | Áp dụng migration ở production                |
| `npm run prisma:studio`           | Mở Prisma Studio                              |

## Biến môi trường

Xem `.env.example`. Tất cả được validate trong `src/config/env.ts`; app sẽ dừng ngay nếu thiếu/sai.

| Biến                                              | Mặc định          | Mô tả                                               |
| ------------------------------------------------- | ----------------- | --------------------------------------------------- |
| `NODE_ENV`                                        | `development`     | `development` \| `production` \| `test`             |
| `PORT`, `HOST`                                    | `3000`, `0.0.0.0` | Cổng / host lắng nghe                               |
| `API_PREFIX`                                      | `/api/v1`         | Tiền tố cho các route                               |
| `CORS_ORIGINS`                                    | `*`               | Danh sách origin, phân tách bằng dấu phẩy           |
| `TRUST_PROXY`                                     | `false`           | Bật khi chạy sau reverse proxy / load balancer      |
| `LOG_LEVEL`                                       | `info`            | Mức log của pino                                    |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`          | `900000`, `100`   | Giới hạn request cho `/api/*` (auth: 20 req/cửa sổ) |
| `DEFAULT_LANGUAGE`                                | `en`              | Ngôn ngữ mặc định (`en` \| `vi`)                    |
| `DATABASE_URL`                                    | —                 | Chuỗi kết nối PostgreSQL (**bắt buộc**)             |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`         | —                 | Secret ≥ 32 ký tự (**bắt buộc**)                    |
| `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` | `15m`, `7d`       | Thời hạn token                                      |
| `BCRYPT_SALT_ROUNDS`                              | `10`              | Số vòng hash mật khẩu                               |
| `DOCS_ENABLED`                                    | `false`           | Bật Swagger tại `/docs`                             |

## API

| Method               | Endpoint                                                                      | Quyền                      |
| -------------------- | ----------------------------------------------------------------------------- | -------------------------- |
| GET                  | `/health`, `/api/v1/health`                                                   | Public                     |
| GET                  | `/api/v1/health/ready`                                                        | Public                     |
| POST                 | `/api/v1/auth/register`                                                       | Public                     |
| POST                 | `/api/v1/auth/login`                                                          | Public                     |
| POST                 | `/api/v1/auth/refresh`                                                        | Public (cần refresh token) |
| GET                  | `/api/v1/auth/me`                                                             | Đã đăng nhập               |
| GET                  | `/api/v1/users?page=1&limit=20&search=&role=&sortBy=createdAt&sortOrder=desc` | ADMIN                      |
| GET / PATCH / DELETE | `/api/v1/users/:id`                                                           | ADMIN                      |

### Định dạng response

```jsonc
// Thành công
{ "success": true, "message": "Success", "data": { ... } }

// Phân trang
{ "success": true, "message": "Success", "data": [ ... ],
  "meta": { "pagination": { "page": 1, "limit": 20, "total": 42, "totalPages": 3, "hasNextPage": true, "hasPrevPage": false } } }

// Lỗi
{ "success": false, "message": "Validation failed",
  "error": { "code": "VALIDATION_ERROR", "details": [ ... ] }, "requestId": "..." }
```

Trong controller dùng `success(req, res, data, { message, statusCode })` và `paginated(req, res, items, meta)` từ `@/utils/response`. Ném lỗi bằng `throw HttpError.notFound('user.notFound')` — error handler tập trung sẽ dịch message và trả về đúng định dạng.

### i18n

Thông điệp API được dịch theo `?lang=vi` hoặc header `Accept-Language: vi`. Thêm/sửa chuỗi trong `src/locales/en.ts` và `src/locales/vi.ts` (file `vi.ts` được type-check theo cấu trúc của `en.ts`).

### Auth & phân quyền

```ts
router.get('/admin-only', authenticate, authorize('ADMIN'), handler);
```

- `authenticate`: đọc `Authorization: Bearer <accessToken>`, gắn `req.user`.
- `authorize(...roles)`: chặn nếu role của user không nằm trong danh sách.
- Refresh token gắn với `tokenVersion` của user — tăng giá trị này để thu hồi toàn bộ refresh token (đăng xuất mọi thiết bị, đổi mật khẩu...).

Tạo tài khoản ADMIN đầu tiên: đăng ký bình thường rồi cập nhật role trong DB (ví dụ qua `npm run prisma:studio`).

## Database

- **Chính:** PostgreSQL qua Prisma (`src/database/prisma.ts`, client được khởi tạo lazy — import không mở kết nối).
- **Thay thế / bổ sung:** xem các file `*.example.ts` trong `src/database/` (MongoDB/mongoose, MySQL, Redis/ioredis). Mỗi file có hướng dẫn: cài package, thêm biến env, đổi tên file bỏ `.example`, bỏ comment và gọi trong `src/database/index.ts`. Các service tương ứng đã có sẵn (comment) trong `docker-compose.yml`.

## Docker

```bash
# Build & chạy app + postgres
docker compose up -d --build

# Chạy migration (từ máy local, trỏ vào postgres trong compose)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/express_base?schema=public npm run prisma:deploy
```

Image production dùng multi-stage build, chỉ chứa production dependencies, chạy bằng user `node` với `tini` để nhận tín hiệu `SIGTERM` (graceful shutdown: đóng HTTP server rồi ngắt kết nối DB, timeout 10s).

## Test

```bash
npm test
```

Test health (`tests/health.test.ts`) không cần database — biến môi trường cho test được đặt trong `tests/setup.ts`.
