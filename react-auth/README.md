# react-auth

Minimal React + Vite + TypeScript web starter with login, logout, and a protected
dashboard. Home is public. FastAPI owns the server-side sessions and credentials.
No JWT, token storage, registration, or role system is included.

## Setup

Start [FastAPI](../fastapi-base/README.md) with a configured email/password hash
in one terminal. Then run inside `react-auth`, using Node.js 24:

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/auth` to
`http://127.0.0.1:8000`, so browser requests and cookies stay on the web origin.
Use `localhost`, not `127.0.0.1`, unless you also change `AUTH_ORIGINS` on FastAPI.
The dev server uses port 5173 strictly to keep that origin consistent.

Log in with the account configured on FastAPI. The `/dashboard` loader validates
the session with the backend and redirects unauthorized visitors to `/login`.
The API must also validate sessions on any private data routes you add; client
routing alone does not protect backend data. Logout revokes the session before
navigating away. Errors are shown without treating a backend outage as login.

Edit `src/pages.tsx` for login and dashboard, `src/router.tsx` for routing, and
`src/styles.css` for styling.

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
account and the generated hash. Then run:

```bash
docker compose up --build
```

Open `http://localhost:8080`. Compose runs Nginx and FastAPI together; Nginx proxies
`/api/auth` and falls back to `index.html` for frontend routes. Session storage
uses a named volume. The Nginx image expects a reachable `backend:8000`, so use
Compose or supply that backend hostname when running it yourself.

For another host, update the backend's `AUTH_ORIGINS` and the Nginx upstream.
For HTTPS, set `AUTH_COOKIE_SECURE=true` on the backend. `npm run preview` only
serves built assets; use Compose for a production-style auth preview.
