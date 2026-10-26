# Fullstack Boilerplates — Without Authentication

Six independent samples on the `without-auth` branch: the original four
TypeScript bases, a Python FastAPI backend, and a public website template.
Each sample has its own dependencies, README, Dockerfile, and CI checks.

## Choose a sample

| Project | Purpose | Stack |
| --- | --- | --- |
| [react-vite-base](./react-vite-base/README.md) | Frontend application with public home and dashboard pages | React, Vite, React Router, TanStack Query, Zustand, Axios, Tailwind, i18next, Vitest |
| [nextjs-base](./nextjs-base/README.md) | Frontend application with locale-prefixed public pages and SSR prefetch | Next.js App Router, next-intl, TanStack Query, Zustand, Axios, Vitest |
| [express-base](./express-base/README.md) | Backend with public user endpoints and PostgreSQL storage | Express, Prisma, Zod, pino, Swagger, Vitest + Supertest |
| [nestjs-base](./nestjs-base/README.md) | Backend with public user endpoints and PostgreSQL storage | NestJS, TypeORM, validation, i18n, pino, Swagger, Jest |
| [fastapi-base](./fastapi-base/README.md) | Python backend with health and validation examples | FastAPI, Pydantic, Uvicorn, OpenAPI, pytest, Ruff |
| [web-base](./web-base/README.md) | Public website template with Home, About, and 404 pages | React, Vite, TypeScript, React Router, plain CSS, Vitest |

All samples run without authentication. Login, registration, tokens, and route
guards are not included. Add authentication when your application needs accounts.

## Get the repository

```bash
git clone --branch without-auth git@github.com:mikenguyen1998/fullstack-boilerplates-NODEJS.git
cd fullstack-boilerplates-NODEJS
```

Run setup commands inside the sample you choose. There is no root package.json
or shared dependency installation.

## Public website

Use Node.js 24. This template needs no backend or environment file.

```bash
cd web-base
npm ci
npm run dev
```

Open `http://localhost:5173`. Edit `src/App.tsx` for pages and routes, and
`src/styles.css` for styling. See the [web template README](./web-base/README.md)
for Docker and static hosting instructions.

## Python backend

Use Python 3.10+; CI and Docker use Python 3.12. Node.js and PostgreSQL are not
required.

```bash
cd fastapi-base
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for interactive API documentation.
`GET /health` returns the service status. `POST /api/v1/examples` validates and
echoes a JSON body with `name` and `quantity`; it does not store data.
See the [FastAPI README](./fastapi-base/README.md) for validation rules and Docker.

## Original TypeScript bases

Use Node.js 24. For `react-vite-base` or `nextjs-base`:

```bash
cd react-vite-base # or nextjs-base
cp .env.example .env
npm ci
npm run dev
```

Configure the API URL in `.env`. These frontends retain language switching,
theme settings, and example user API services. Match user fields and response
shapes to your backend: Express uses `name`, while NestJS uses `fullName`.
The FastAPI validation example is not a replacement for those user APIs.

Express and NestJS require PostgreSQL and database migrations before starting.
Follow their individual setup instructions:

- [Express setup and Prisma migrations](./express-base/README.md)
- [NestJS setup and TypeORM migrations](./nestjs-base/README.md)

For existing Express or NestJS databases, the authentication-removal migration
removes credential and role columns. Back up existing data before migrating.
Original migrations remain intact; use a fresh database for a new project.

## Checks

Run inside any TypeScript sample:

```bash
npm run lint # NestJS: npm run lint:check
npm run typecheck
npm test
npm run build
```

With the FastAPI virtual environment activated, run inside `fastapi-base`:

```bash
ruff check .
ruff format --check .
python -m pytest
```

GitHub Actions runs the TypeScript checks for all five Node.js samples and a
separate Python job for FastAPI. Docker commands are in each sample's README.

[MIT License](./LICENSE)
