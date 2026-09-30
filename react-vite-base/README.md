# React Vite Base

Bộ khung (boilerplate) **React 19 + TypeScript + Vite** sẵn sàng cho production, đã tích hợp sẵn routing, quản lý state, gọi API, đa ngôn ngữ, form validation, testing, lint/format và Docker.

## Công nghệ sử dụng

| Nhóm            | Thư viện                                                               |
| --------------- | ---------------------------------------------------------------------- |
| Core            | React 19, TypeScript 6 (strict), Vite 8                                |
| Routing         | React Router 7 (data router `createBrowserRouter`, lazy route)         |
| Server state    | TanStack Query 5 (+ Devtools khi dev)                                  |
| Client state    | Zustand 5 (middleware `persist`)                                       |
| HTTP            | Axios (interceptor Bearer token, Accept-Language, refresh-token queue) |
| i18n            | i18next, react-i18next, i18next-browser-languagedetector (`en`, `vi`)  |
| Form            | React Hook Form + Zod 4 (`@hookform/resolvers`)                        |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`), `clsx` + `tailwind-merge`       |
| Chất lượng code | ESLint 10 (flat config) + typescript-eslint, Prettier, `.editorconfig` |
| Testing         | Vitest + Testing Library + jsdom                                       |
| Triển khai      | Dockerfile multi-stage + Nginx (SPA fallback)                          |

## Yêu cầu

- Node.js >= 20.19 (khuyến nghị 22 LTS trở lên)
- npm >= 10

## Bắt đầu nhanh

```bash
npm install
cp .env.example .env      # rồi chỉnh VITE_API_URL
npm run dev               # http://localhost:5173
```

## Scripts

| Lệnh                              | Mô tả                                                |
| --------------------------------- | ---------------------------------------------------- |
| `npm run dev`                     | Chạy dev server (HMR)                                |
| `npm run build`                   | Type-check (`tsc -b`) và build production ra `dist/` |
| `npm run preview`                 | Xem thử bản build tại http://localhost:4173          |
| `npm run lint` / `lint:fix`       | Kiểm tra / tự sửa lỗi ESLint                         |
| `npm run format` / `format:check` | Format / kiểm tra format bằng Prettier               |
| `npm run test` / `test:watch`     | Chạy test Vitest (một lần / chế độ watch)            |
| `npm run typecheck`               | Kiểm tra kiểu TypeScript, không xuất file            |

## Cấu trúc thư mục

```
.
├── public/                  # File tĩnh (favicon...)
├── src/
│   ├── app/
│   │   ├── providers/       # AppProviders, QueryProvider, ThemeProvider
│   │   ├── router.tsx       # Khai báo route (createBrowserRouter + lazy)
│   │   ├── ProtectedRoute.tsx  # Guard: ProtectedRoute / GuestRoute
│   │   └── App.tsx
│   ├── components/
│   │   ├── ui/              # Component nguyên thủy: Button, Input, Card, Spinner
│   │   ├── common/          # ErrorBoundary, RouteError, LanguageSwitcher, ThemeToggle, PageLoader
│   │   └── layout/          # MainLayout, AuthLayout, Header
│   ├── features/            # Module theo nghiệp vụ (vd: auth/components, auth/schemas)
│   ├── pages/               # Page component (default export, được lazy-load)
│   ├── hooks/
│   │   ├── queries/         # Hook TanStack Query bọc services (useAuth, useUsers)
│   │   └── ...              # Hook dùng chung (useDebounce, useThemeEffect)
│   ├── lib/                 # axios, api-error, i18n, query-client, query-keys
│   ├── services/            # Lớp gọi API thuần (auth.service, user.service)
│   ├── stores/              # Zustand store (auth.store, ui.store)
│   ├── locales/{en,vi}/     # File dịch translation.json
│   ├── types/               # Kiểu dữ liệu dùng chung (+ type-safe cho i18next)
│   ├── utils/               # Hàm tiện ích (cn, format)
│   ├── config/              # env.ts (biến môi trường đã validate), constants.ts
│   ├── styles/              # index.css (Tailwind v4 + theme)
│   ├── test/                # setup Vitest, test-utils
│   ├── main.tsx
│   └── vite-env.d.ts        # Khai báo kiểu cho import.meta.env
├── Dockerfile / nginx.conf
├── eslint.config.js / .prettierrc.json / .editorconfig
└── vite.config.ts / tsconfig*.json
```

Import tuyệt đối qua alias `@/` → `src/`, ví dụ: `import { api } from '@/lib/axios'`.

## Luồng dữ liệu

```
Page / Component
   └─ hooks/queries (useQuery / useMutation)
        └─ services/*.service.ts
             └─ lib/axios.ts (api instance)  →  Backend
```

- **Component không gọi axios trực tiếp** — luôn qua hook trong `hooks/queries`, hook gọi `services`.
- Query key tập trung trong `src/lib/query-keys.ts`.
- Mọi lỗi API được chuẩn hóa thành `ApiError` (`status`, `code`, `message`, `details`, `isNetworkError`) trong `src/lib/api-error.ts`.

## Xác thực (Auth)

- `useAuthStore` lưu `accessToken`, `refreshToken`, `user` và được persist vào `localStorage` (key `app-auth`).
- Request interceptor tự gắn `Authorization: Bearer <token>` và `Accept-Language` theo ngôn ngữ hiện tại.
- Khi nhận **401**: interceptor gọi `POST /auth/refresh` **một lần duy nhất**; các request khác bị 401 trong lúc đó được đưa vào hàng đợi và phát lại sau khi có token mới. Refresh thất bại → `logout()` và `ProtectedRoute` tự chuyển về `/login`.
- Request có thể bỏ qua cơ chế refresh bằng `{ skipAuthRefresh: true }` (đã dùng cho login/logout).
- Các endpoint mặc định (`/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/logout`, `/users`) nằm trong `src/services` và `src/lib/axios.ts` — chỉnh lại cho khớp backend của bạn.

## Routing

| Path         | Mô tả                                             |
| ------------ | ------------------------------------------------- |
| `/`          | Trang chủ (public)                                |
| `/login`     | Đăng nhập (chỉ khi chưa đăng nhập — `GuestRoute`) |
| `/dashboard` | Cần đăng nhập (`ProtectedRoute`)                  |
| `*`          | Trang 404                                         |

Thêm trang mới: tạo file trong `src/pages` (default export), rồi khai báo trong `src/app/router.tsx` bằng `lazy: page(() => import('@/pages/NewPage'))`.

## Đa ngôn ngữ (i18n)

- File dịch: `src/locales/en/translation.json`, `src/locales/vi/translation.json`.
- Ngôn ngữ được phát hiện theo thứ tự: `localStorage` → trình duyệt → thẻ `<html lang>`; mặc định lấy từ `VITE_DEFAULT_LANGUAGE`.
- Key dịch được type-check (xem `src/types/i18next.d.ts`) — gõ sai key sẽ báo lỗi TypeScript.
- Đổi ngôn ngữ bằng component `LanguageSwitcher`.
- Thêm ngôn ngữ: tạo thư mục mới trong `locales`, thêm vào `SUPPORTED_LANGUAGES` (`src/config/constants.ts`) và `resources` (`src/lib/i18n.ts`).

## Form & Validation

Ví dụ tại `src/features/auth`: schema Zod (`login.schema.ts`) + React Hook Form (`LoginForm.tsx`). Thông báo lỗi trong schema là **key i18n**, được dịch khi hiển thị.

## Theme

`useUiStore` lưu `theme` (`light` | `dark` | `system`) và trạng thái sidebar. `ThemeProvider` bật/tắt class `dark` trên `<html>`; Tailwind dùng `@custom-variant dark` nên các class `dark:*` hoạt động theo class này.

## Biến môi trường

| Biến                    | Mô tả                            | Mặc định          |
| ----------------------- | -------------------------------- | ----------------- |
| `VITE_API_URL`          | Base URL của API                 | `/api`            |
| `VITE_APP_NAME`         | Tên ứng dụng                     | `React Vite Base` |
| `VITE_DEFAULT_LANGUAGE` | Ngôn ngữ mặc định (`en` \| `vi`) | `en`              |
| `VITE_PORT`             | Cổng dev server                  | `5173`            |

Biến được khai báo kiểu trong `src/vite-env.d.ts` và validate bằng Zod trong `src/config/env.ts`. Luôn dùng `env` từ `@/config/env` thay vì `import.meta.env`.

> Lưu ý: biến `VITE_*` được **nhúng vào bundle lúc build**, không đặt secret vào đây.

## Testing

```bash
npm run test
```

Test mẫu: `src/features/auth/components/LoginForm.test.tsx`. Dùng `renderWithProviders` (`src/test/test-utils.tsx`) để render component kèm QueryClient và Router.

## Docker

```bash
docker build -t react-vite-base --build-arg VITE_API_URL=https://api.example.com .
docker run -p 8080:80 react-vite-base
# Mở http://localhost:8080
```

- Stage 1–2: cài dependency (`npm ci`) và build bằng Node 22 Alpine.
- Stage 3: phục vụ `dist/` bằng Nginx; `nginx.conf` có SPA fallback (`try_files ... /index.html`), gzip, cache dài hạn cho `/assets/`, không cache `index.html`, endpoint `/healthz`.

## Quy ước

- Component: `PascalCase.tsx`; hook: `useXxx.ts`; service: `xxx.service.ts`; store: `xxx.store.ts`.
- Page dùng `export default` (để lazy-load), các module khác dùng named export.
- Chạy `npm run lint && npm run typecheck && npm run test` trước khi commit.
