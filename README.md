# Fullstack Boilerplates

Independent web and backend samples. Choose a frontend with session authentication
or a public frontend without login. Each folder has its own dependencies,
Dockerfile, README, and CI checks; there is no root package.json.

## Choose a sample

| Sample | Authentication | Stack and purpose |
| --- | --- | --- |
| [nextjs-auth](./nextjs-auth/README.md) | Server-side session | Minimal Next.js App Router website with login, logout, and a protected server-rendered dashboard |
| [react-auth](./react-auth/README.md) | Server-side session | Minimal React + Vite website with login, logout, and a protected dashboard |
| [nextjs-withoutauth](./nextjs-withoutauth/README.md) | None | Next.js, next-intl, SSR prefetch, TanStack Query, Zustand, Axios; public home and dashboard |
| [react-withoutauth](./react-withoutauth/README.md) | None | React, Vite, React Router, TanStack Query, Zustand, Axios, Tailwind, i18next; public home and dashboard |
| [fastapi-base](./fastapi-base/README.md) | Optional session routes | Python, FastAPI, Pydantic, SQLite session storage, health and validation examples |
| [express-base](./express-base/README.md) | None | Express, Prisma/PostgreSQL, Zod, pino, Swagger, public user endpoints |
| [nestjs-base](./nestjs-base/README.md) | None | NestJS, TypeORM/PostgreSQL, validation, i18n, pino, Swagger, public user endpoints |

The original `nextjs-base` and `react-vite-base` folders are now
`nextjs-withoutauth` and `react-withoutauth`. The separate `web-base` has been
replaced by `react-auth`; its layout is reused in the minimal auth templates.

## Session authentication

For these web templates, use a server-side session identified by an HttpOnly
cookie. Both auth frontends connect to `fastapi-base` through a same-origin
`/api/auth` proxy. No JWT, refresh-token flow, or browser token storage is needed.

The backend provides `POST /api/auth/login`, `GET /api/auth/session`, and
`POST /api/auth/logout`. Configure one account using an email and password hash.
Sessions live in SQLite, expire after eight hours, rotate on login, and are
revoked on logout. Login and logout require an allowed Origin and a CSRF header.
There is no registration, password reset, role system, or external auth service.

## Get started

Use Node.js 24 for the web templates and Node.js backends. FastAPI requires
Python 3.10+; its CI and Docker image use Python 3.12.

```bash
git clone git@github.com:mikenguyen1998/fullstack-boilerplates-NODEJS.git
cd fullstack-boilerplates-NODEJS
```

For an authenticated web app, start FastAPI in one terminal:

```bash
cd fastapi-base
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
export AUTH_EMAIL=owner@example.com
export AUTH_PASSWORD_HASH="$(python -m app.passwords)"
uvicorn app.main:app --reload
```

The password command prompts for your own password and confirmation. There are
no default credentials. In a second terminal, start either frontend:

```bash
cd react-auth # or nextjs-auth
npm ci
npm run dev
```

Open `http://localhost:5173` for React or `http://localhost:3000` for Next.js.
Use `localhost` consistently: allowed origins match exactly, including the port.
The backend defaults already allow these two frontend origins.

For a public web app, no login or session backend is required:

```bash
cd react-withoutauth # or nextjs-withoutauth
cp .env.example .env
npm ci
npm run dev
```

The public templates retain i18n, theme settings, and example user API services.
Configure the API URL in `.env` if using those services. Match the response shape
to your chosen backend: Express uses `name`, while NestJS uses `fullName`.
FastAPI's validation example does not implement those user APIs.

Express and NestJS require PostgreSQL and migrations; follow their individual
READMEs. Existing databases must apply the authentication-removal migration,
which drops credential and role columns. Back up existing data before migrating.

## Checks

Run inside any frontend or Node.js backend:

```bash
npm run lint # NestJS: npm run lint:check
npm run typecheck
npm test
npm run build
```

With FastAPI's virtual environment activated, run inside `fastapi-base`:

```bash
ruff check .
ruff format --check .
python -m pytest
```

GitHub Actions checks all seven samples. Each sample's README includes its
Docker commands. The auth templates include Docker Compose for frontend and
FastAPI together, with a persistent session volume.

For deployment, enable HTTPS and `AUTH_COOKIE_SECURE=true`, configure exact
`AUTH_ORIGINS`, and persist the backend's session database. The simple auth
backend uses one configured account and one SQLite database file; use a managed
auth system or shared database when the app needs multiple users or replicas.

[MIT License](./LICENSE)
