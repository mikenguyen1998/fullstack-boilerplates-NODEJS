# nextjs-auth

Minimal Next.js App Router + TypeScript web starter with login, logout, and a
protected server-rendered dashboard. Home is public. FastAPI owns credentials
and server-side sessions; no JWT, browser token storage, registration, or roles.

## Setup

Start [FastAPI](../fastapi-base/README.md) with a configured email/password hash
in one terminal. Then run inside `nextjs-auth`, using Node.js 24:

```bash
cp .env.example .env
npm ci
npm run dev
```

Open `http://localhost:3000`. Log in with the account configured on FastAPI.
`AUTH_BACKEND_URL` defaults to `http://127.0.0.1:8000` and is server-only.
The `/api/auth/[action]` route forwards only login, session, and logout to FastAPI,
including the HttpOnly cookie and the original CSRF headers. No general-purpose
backend proxy is exposed.

The dashboard calls `requireSession()` on the server. A cookie alone is never
accepted as proof of login: FastAPI validates the stored session before the page
renders. Private fetches disable caching. Call this helper in future protected
pages and validate sessions again on any private backend routes you add.

Use `localhost`, not `127.0.0.1`, unless you change FastAPI's `AUTH_ORIGINS`.
Keep port 3000 or update the allowed origin if you choose another port.

Edit pages under `src/app`, session validation in `src/lib/session.ts`, and
styling in `src/app/globals.css`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

## Docker

Export `AUTH_EMAIL` and `AUTH_PASSWORD_HASH` in this terminal using your configured
account and generated hash. Then run:

```bash
docker compose up --build
```

Open `http://localhost:3000`. Compose runs Next.js and FastAPI together, with a
named session volume. `AUTH_BACKEND_URL=http://backend:8000` is set at runtime.

For production, set an exact frontend `AUTH_ORIGINS`, enable HTTPS, and set
`AUTH_COOKIE_SECURE=true` on FastAPI. To run a local production build, use
`npm run build` followed by `npm start`. The postbuild step copies static assets
into Next.js's standalone output.
