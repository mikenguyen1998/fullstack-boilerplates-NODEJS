# Next.js Base

Bộ khung (boilerplate) **Next.js App Router + TypeScript** sẵn sàng cho production, đồng bộ stack với React SPA base.

## Công nghệ

| Nhóm          | Thư viện                                                                    |
| ------------- | --------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack, `output: 'standalone'`), React 19        |
| Ngôn ngữ      | TypeScript (strict, `noUncheckedIndexedAccess`)                             |
| Styling       | Tailwind CSS v4, `clsx` + `tailwind-merge` (`cn()`), dark mode theo class   |
| i18n          | next-intl v4 — locale `vi` (mặc định) / `en`, segment `[locale]`            |
| Data fetching | Axios (client), `serverFetch` (RSC), TanStack Query v5 + Devtools           |
| State         | Zustand v5 (`auth` có persist, `ui`/theme) — SSR-safe                       |
| Form          | React Hook Form + Zod v4 (`@hookform/resolvers`)                            |
| Env           | Zod (`src/config/env.ts`, `src/config/env.server.ts`)                       |
| Chất lượng    | ESLint 9 (flat config, `eslint-config-next`) + Prettier (+ tailwind plugin) |
| Test          | Vitest + Testing Library (jsdom)                                            |
| Triển khai    | Dockerfile multi-stage (standalone), healthcheck `/api/health`              |

## Cấu trúc thư mục

```
.
├── messages/                    # File dịch: en.json, vi.json
├── public/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/login/    # Trang đăng nhập (RHF + Zod), _components/login-form.tsx
│   │   │   ├── (main)/dashboard/# Trang cần đăng nhập, ví dụ prefetch + HydrationBoundary
│   │   │   ├── [...rest]/       # Catch-all -> not-found có dịch
│   │   │   ├── layout.tsx       # Root layout thật (<html>, providers, font, theme script)
│   │   │   ├── page.tsx         # Trang chủ
│   │   │   ├── loading.tsx | error.tsx | not-found.tsx
│   │   ├── api/health/route.ts  # Health check
│   │   ├── layout.tsx           # Layout pass-through
│   │   ├── not-found.tsx        # 404 ngoài segment [locale]
│   │   ├── global-error.tsx
│   │   └── globals.css          # Tailwind v4 + design tokens (light/dark)
│   ├── components/
│   │   ├── ui/                  # Button, Input, Label, Card, Spinner
│   │   ├── common/              # LanguageSwitcher, ThemeToggle
│   │   └── layout/              # Header, Footer, UserMenu
│   ├── config/                  # env.ts (public), env.server.ts (server-only), constants.ts
│   ├── hooks/
│   │   ├── queries/             # queryKeys, useUsers, useLogin
│   │   └── use-hydrated.ts, use-logout.ts
│   ├── i18n/                    # routing.ts, request.ts, navigation.ts
│   ├── lib/                     # axios.ts, server-fetch.ts, query-client.ts, theme-script.ts, validations/
│   ├── providers/               # QueryProvider, ThemeProvider, StoreHydration, AppProviders
│   ├── services/                # auth.service.ts, user.service.ts
│   ├── stores/                  # auth.store.ts, ui.store.ts (Zustand)
│   ├── types/                   # api.ts (ApiError), auth.ts, user.ts, next-intl.d.ts
│   ├── utils/                   # cn, cookie, storage, safeRedirectPath
│   ├── __tests__/               # Test mẫu (Vitest)
│   └── proxy.ts                 # next-intl + bảo vệ route (Next 16: middleware -> proxy)
├── Dockerfile
├── next.config.ts               # Security headers, standalone, next-intl plugin
├── vitest.config.mts
└── .env.example
```

## Bắt đầu

Yêu cầu: **Node.js >= 20.9** (khuyến nghị 24 LTS), npm.

```bash
npm install
cp .env.example .env.local   # chỉnh NEXT_PUBLIC_API_URL trỏ tới backend
npm run dev                  # http://localhost:3000 -> tự redirect sang /vi
```

## Scripts

| Lệnh                | Mô tả                                                |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Chạy môi trường phát triển                           |
| `npm run build`     | Build production (standalone)                        |
| `npm run start`     | Chạy bản build (`next start`)                        |
| `npm run lint`      | ESLint (`lint:fix` để tự sửa)                        |
| `npm run format`    | Prettier format toàn bộ (`format:check` để kiểm tra) |
| `npm run test`      | Chạy Vitest một lần (`test:watch`, `test:coverage`)  |
| `npm run typecheck` | `next typegen` + `tsc --noEmit`                      |

## Biến môi trường

| Biến                      | Phạm vi | Mặc định                    | Ghi chú                                            |
| ------------------------- | ------- | --------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`    | public  | `Next.js Base`              |                                                    |
| `NEXT_PUBLIC_APP_URL`     | public  | `http://localhost:3000`     | Dùng cho `metadataBase`                            |
| `NEXT_PUBLIC_API_URL`     | public  | `http://localhost:8080/api` | baseURL của axios; được thêm vào CSP `connect-src` |
| `NEXT_PUBLIC_API_TIMEOUT` | public  | `15000`                     | ms                                                 |
| `API_INTERNAL_URL`        | server  | —                           | URL nội bộ cho RSC (fallback về public URL)        |

> Biến `NEXT_PUBLIC_*` được **inline lúc build** — thay đổi cần build lại (Docker: truyền qua `--build-arg`).
> Env được validate bằng Zod ngay khi chạy `next.config.ts`; giá trị sai sẽ làm build/start thất bại.

## Các luồng chính

### i18n (next-intl)

- Cấu hình ở `src/i18n/routing.ts` (`locales: ['en','vi']`, `defaultLocale: 'vi'`, `localePrefix: 'always'`).
- Luôn dùng `Link`, `useRouter`, `usePathname`, `redirect` từ `@/i18n/navigation` để giữ locale.
- Server: `getTranslations()`; Client: `useTranslations()`. Key được type-check dựa trên `messages/en.json`.
- Thêm ngôn ngữ: thêm vào `routing.locales` + tạo `messages/<locale>.json` + label trong `LanguageSwitcher`.

### Xác thực & `proxy.ts`

- Đăng nhập gọi `POST {API}/auth/login` → trả về `{ accessToken, refreshToken, user }`.
- Store `auth` lưu session (localStorage) và ghi `access_token` vào cookie để `proxy.ts` và RSC đọc được.
- `proxy.ts`: chưa có cookie mà vào route trong `PROTECTED_ROUTES` → redirect `/{locale}/login?callbackUrl=...`; đã đăng nhập mà vào `/login` → redirect `/dashboard`. Sau đó chuyển cho middleware của next-intl.
- Đây chỉ là **kiểm tra lạc quan** (optimistic). Phân quyền thực sự phải nằm ở API.
- Khuyến nghị production: để backend (hoặc một Route Handler BFF) set cookie `httpOnly` thay vì ghi cookie từ JS.

### Axios (`src/lib/axios.ts`)

- `baseURL = NEXT_PUBLIC_API_URL`, tự gắn `Authorization: Bearer <token>` và `Accept-Language`.
- Khi gặp **401**: gọi `POST /auth/refresh` **một lần**, các request khác xếp hàng chờ rồi retry với token mới. Refresh thất bại → logout + chuyển về trang login.
- Lỗi luôn được chuẩn hoá thành `ApiError` (`status`, `code`, `errors`).

### Fetch phía server (`src/lib/server-fetch.ts`)

`serverFetch<T>(path, { query, body, next: { revalidate, tags } })` — chỉ dùng trong Server Components / Route Handlers / Server Actions; tự forward token từ cookie và locale.

### TanStack Query + SSR

`dashboard/page.tsx` minh hoạ: `getQueryClient()` → `prefetchQuery` bằng `serverFetch` → `<HydrationBoundary state={dehydrate(qc)}>` → client component `useUsers()` dùng lại cache (cùng `queryKey`). Devtools chỉ bật ở môi trường dev.

### Zustand SSR-safe

Store tạo với `skipHydration: true` và storage an toàn (`safeLocalStorage`) — không chạm `localStorage` trên server. `<StoreHydration />` rehydrate sau khi mount; dùng `useHydrated()` trước khi render dữ liệu phụ thuộc store. Theme được áp dụng trước khi paint bằng inline script (tránh nháy màn hình).

## Bảo mật

`next.config.ts` thêm các header: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS, `Permissions-Policy`, `COOP`; tắt `X-Powered-By`. CSP hiện cho phép `'unsafe-inline'` cho script; nếu cần chặt hơn, chuyển sang CSP dùng nonce trong `proxy.ts` (xem tài liệu Next.js "Content Security Policy"). `safeRedirectPath` chặn open-redirect với `callbackUrl`.

## Docker

```bash
docker build -t nextjs-base \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_APP_URL=https://app.example.com .

docker run -p 3000:3000 -e API_INTERNAL_URL=http://backend:8080/api nextjs-base
```

Image chạy `node server.js` với user không phải root, có `HEALTHCHECK` gọi `/api/health`.

## Ghi chú

- Next.js 16 đổi `middleware.ts` → `proxy.ts` (runtime Node.js), và `next lint` đã bị bỏ — dùng `eslint` trực tiếp.
- `next build` mặc định dùng Turbopack.
- Với route có `loading.tsx`, trang 404 từ `notFound()` được stream nên HTTP status là 200 kèm `<meta name="robots" content="noindex">` (hành vi mặc định của Next.js).
