# react-withoutauth — Without Authentication

Authentication-free starter. Dashboard and user routes are public.
Language switching (English/Vietnamese), validation, error handling and the original build tooling are retained.

## Setup

```bash
cp .env.example .env
npm ci
npm run dev
```

Configure the API URL in `.env`. The home page and `/dashboard` are public (Next.js adds the locale prefix). Theme settings persist in Zustand. Axios sends the active locale and normalizes API errors.

The user service illustrates API access. Match its response shape and fields to your API: Express returns a wrapped paginated list with `name`, while NestJS uses `fullName`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
