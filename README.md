# Fullstack TypeScript Boilerplates — Without Authentication

Four independent TypeScript starters: React + Vite, Next.js, Express and NestJS.
This `without-auth` branch retains the original tooling, i18n, validation, logging,
user examples, health checks, Docker and CI, with authentication removed.

| Project | Stack |
| --- | --- |
| [react-vite-base](./react-vite-base) | React, Vite, React Router, TanStack Query, Zustand, Axios, Tailwind, Vitest |
| [nextjs-base](./nextjs-base) | Next.js App Router, next-intl, SSR prefetch, TanStack Query, Zustand, Axios, Vitest |
| [express-base](./express-base) | Express, Prisma/PostgreSQL, Zod, pino, Swagger, Vitest + Supertest |
| [nestjs-base](./nestjs-base) | NestJS, TypeORM/PostgreSQL, validation, i18n, pino, Swagger, Jest |

## Quick start

```bash
git clone --branch without-auth git@github.com:mikenguyen1998/fullstack-boilerplates-NODEJS.git
cd fullstack-boilerplates-NODEJS/<project>
cp .env.example .env
npm ci
npm run dev # NestJS: npm run start:dev
```

Use Node.js 24. Each project has its own package.json, lockfile, README and Dockerfile.
Backend projects need PostgreSQL; see their READMEs for migration commands.

All dashboard and user routes are public. There are no login/register endpoints,
passwords, JWT secrets, token stores, refresh flows or role guards.
Existing backend databases must apply the new forward migration, which removes
credential and role columns; use a fresh database for a new starter project.
Original migrations remain intact so existing migration histories still work.

Frontend API services are examples: adapt their user fields and response shapes to
your chosen backend (Express uses `name`, NestJS uses `fullName`).

## Checks

```bash
npm run lint # NestJS: npm run lint:check
npm run typecheck
npm test
npm run build
```

[MIT License](./LICENSE)
