# express-base — Without Authentication

Authentication-free starter. Dashboard and user routes are public.
Language switching (English/Vietnamese), validation, error handling and the original build tooling are retained.

## Setup

```bash
cp .env.example .env
npm ci
docker compose up -d postgres
npm run prisma:generate
npm run prisma:deploy
npm run dev
```

Configure PostgreSQL in `.env`. Swagger is available at `/docs`. User endpoints are under `/api/v1/users`; health checks and rate limiting remain enabled.

The new forward migration drops password, token and role columns. Use a fresh database for new projects; back up existing data before applying migrations. Credential data cannot be recovered by rolling back.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
