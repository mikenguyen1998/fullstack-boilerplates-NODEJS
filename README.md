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

Both auth frontends can connect to **any backend that implements the session API
contract below**: Express, NestJS, FastAPI, or another framework. Set
`AUTH_BACKEND_URL` to your backend's origin. Requests use a same-origin
`/api/auth` proxy, and the backend owns credentials, session storage, expiry,
and logout revocation. No JWT, refresh-token flow, or browser token storage is
required.

| Endpoint | Contract |
| --- | --- |
| `POST /api/auth/login` | Accept `{ "email": "...", "password": "..." }`; return `200` and set the session cookie, or `401` for invalid credentials |
| `GET /api/auth/session` | Validate the cookie; return `200` with `{ "email": "..." }`, or `401` for an invalid/expired session |
| `POST /api/auth/logout` | Revoke the session, clear its cookie, and return `204` |

Use an HttpOnly, host-only cookie with `Path=/`, `SameSite=Lax`, and `Secure`
under HTTPS. The backend must validate the frontend's exact Origin and
`X-CSRF-Protection: 1` on auth POST requests, and disable caching on auth
responses. Next.js also needs `AUTH_SESSION_COOKIE` set to the backend's cookie
name; the default is `app_session`. React lets the browser manage cookies.
If your backend uses different paths or response shapes, adapt the frontend
session calls and proxy to match.

`fastapi-base` is one optional implementation of this contract, with a single
configured account and SQLite sessions. The Express and NestJS samples currently
have public APIs; add matching auth routes before using either as an auth backend.

## Get one base

### Code only, keeping the base folder name

Use [degit](https://github.com/Rich-Harris/degit) to download a single base without
the repository's Git history or `.git` folder:

```bash
npx degit mikenguyen1998/fullstack-boilerplates-NODEJS/react-auth react-auth
cd react-auth
cp .env.example .env
# Configure AUTH_BACKEND_URL for your chosen session backend.
npm ci
npm run dev
```

The source folder and destination are both `react-auth`, so its name stays the
same. Replace both occurrences with any base name in the table, such as
`nextjs-auth`, `react-withoutauth`, or `fastapi-base`. Use an empty destination
and follow the selected base's README for its own setup commands.
Keep the repository's [MIT license notice](./LICENSE) when redistributing code.

### Sparse clone with Git history

Use Git sparse checkout to download one sample without checking out the other
bases. Replace `react-withoutauth` with the folder you want from the table above.

```bash
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/mikenguyen1998/fullstack-boilerplates-NODEJS.git my-project
cd my-project
git sparse-checkout set react-withoutauth
cd react-withoutauth
cp .env.example .env
npm ci
npm run dev
```

Sparse checkout keeps repository-level files such as README and LICENSE, but
only checks out the selected sample folder. Follow that folder's README for its
setup commands: FastAPI uses Python, and Express/NestJS need PostgreSQL and
migrations rather than the frontend commands above.

### Get an auth frontend

Select only the frontend if you already have a compatible session backend:

```bash
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/mikenguyen1998/fullstack-boilerplates-NODEJS.git my-project
cd my-project
git sparse-checkout set react-auth # or nextjs-auth
```

Configure `AUTH_BACKEND_URL` in the selected frontend's `.env`. No particular
backend folder or sibling directory is required. If you want to try the optional
Python implementation too, run `git sparse-checkout add fastapi-base` and follow
its README.

### Start your own repository

The sparse clone still belongs to this boilerplate repository. To make a
base an independent project, run this from the sparse clone's root **before
installing dependencies**:

```bash
cp -R react-withoutauth ../my-app
cp LICENSE ../my-app/LICENSE
cd ../my-app
git init
```

Use a new, empty destination. The copied folder has no original Git history or
remote. For another sample, replace `react-withoutauth` with its folder name.
Auth frontend folders can also be copied independently and connected to your
existing backend through `AUTH_BACKEND_URL`.

## Get all bases

To explore every sample, clone the complete repository:

```bash
git clone https://github.com/mikenguyen1998/fullstack-boilerplates-NODEJS.git
cd fullstack-boilerplates-NODEJS
```

## Run your selected base

Use Node.js 24 for the web templates and Node.js backends. FastAPI requires
Python 3.10+; its CI and Docker image use Python 3.12.

For an authenticated web app, start your chosen session backend, then run:

```bash
cd react-auth # or nextjs-auth
cp .env.example .env
# Edit AUTH_BACKEND_URL to point to your backend.
# Next.js: also match AUTH_SESSION_COOKIE to the backend cookie name.
npm ci
npm run dev
```

Open `http://localhost:5173` for React or `http://localhost:3000` for Next.js.
Configure the backend to trust that exact frontend origin, including its port,
and log in with an account managed by your backend.

To use the optional Python backend, follow the [FastAPI setup](./fastapi-base/README.md)
and set `AUTH_BACKEND_URL=http://127.0.0.1:8000` in the frontend. This is an
example pairing, not a dependency of either auth frontend.

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
Docker commands. The auth frontend Compose files run only the frontend and
connect to the backend URL you supply; they do not build or select a backend.

For deployment, enable HTTPS, use Secure cookies, configure the backend's trusted
frontend origins, and persist its session storage. Backend account management,
rate limiting, expiry, and database choices are independent of the frontend.

[MIT License](./LICENSE)
