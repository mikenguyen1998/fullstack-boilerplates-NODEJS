# Fullstack TypeScript Boilerplates

[![CI](https://github.com/mikenguyen1998/fullstack-boilerplates-NODEJS/actions/workflows/ci.yml/badge.svg)](https://github.com/mikenguyen1998/fullstack-boilerplates-NODEJS/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Bộ 4 base project **TypeScript** production-ready — 2 frontend (React + Vite, Next.js) và 2 backend (Express, NestJS). Mỗi project nằm trong một folder độc lập với `package.json`, `README.md`, `Dockerfile` riêng, đã cấu hình sẵn lint, format, test và CI.

> Production-ready TypeScript starter kits: React + Vite, Next.js, Express and NestJS — with auth, i18n, validation, logging, Docker and CI out of the box.

## Các project

| Folder | Loại | Stack chính |
| --- | --- | --- |
| [`react-vite-base`](./react-vite-base) | SPA frontend | React 19, Vite, React Router 7, TanStack Query, Zustand, Axios, i18next, React Hook Form + Zod, Tailwind CSS v4, Vitest |
| [`nextjs-base`](./nextjs-base) | Frontend (App Router) | Next.js 16, next-intl, TanStack Query (SSR prefetch), Zustand, Axios, React Hook Form + Zod, Tailwind CSS v4, Vitest |
| [`express-base`](./express-base) | REST API | Express 5, Prisma 7 (PostgreSQL), JWT access/refresh, Zod, pino, helmet / cors / rate-limit, i18next, Swagger, Vitest + Supertest |
| [`nestjs-base`](./nestjs-base) | REST API | NestJS 11, TypeORM (PostgreSQL + config mẫu cho MySQL, SQLite, MSSQL, Oracle, MongoDB, Redis), Passport JWT, Guards, Interceptors, Filters, nestjs-i18n, Terminus, Swagger, Jest |

## Tính năng chung

**Frontend**
- Axios instance: gắn Bearer token + `Accept-Language`, tự refresh token khi 401 (hàng đợi request), chuẩn hoá lỗi
- TanStack Query + Zustand (auth store persist, theme light/dark/system)
- i18n en / vi, route bảo vệ (protected / guest), lazy loading
- Env được validate bằng Zod

**Backend**
- Auth: register / login / refresh / me, access + refresh token, phân quyền theo role
- Validation, error handler thống nhất, response wrapper, pagination
- Security: helmet, CORS, rate limit, request-id
- Logging với pino, i18n message lỗi, health check, Swagger tại `/docs`
- Graceful shutdown, migration, Docker + docker-compose (PostgreSQL)

## Bắt đầu nhanh

```bash
git clone git@github.com:mikenguyen1998/fullstack-boilerplates-NODEJS.git
cd fullstack-boilerplates-NODEJS/<project>
cp .env.example .env
npm install
npm run dev          # NestJS: npm run start:dev
```

Backend cần PostgreSQL — chạy nhanh bằng Docker trong folder `express-base` hoặc `nestjs-base`:

```bash
docker compose up -d postgres
```

### Chỉ lấy một project

```bash
npx degit mikenguyen1998/fullstack-boilerplates-NODEJS/nestjs-base my-api
```

## Scripts chung

| Script | Mô tả |
| --- | --- |
| `dev` / `start:dev` | Chạy môi trường dev |
| `build` | Build production |
| `lint` / `format` | ESLint + Prettier |
| `typecheck` | Kiểm tra kiểu TypeScript |
| `test` | Chạy unit test |

Chi tiết cấu trúc thư mục và cấu hình xem `README.md` trong từng folder.

## Yêu cầu

- Node.js >= 22 (khuyến nghị 24)
- Docker (tuỳ chọn, cho PostgreSQL)

## License

[MIT](./LICENSE)
