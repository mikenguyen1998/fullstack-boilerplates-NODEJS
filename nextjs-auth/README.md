# nextjs-auth

Minimal Next.js App Router + TypeScript web starter with login, logout, and a
protected server-rendered dashboard. Connect it to any backend implementing the
session API below: Express, NestJS, FastAPI, or another framework. The backend
owns credentials and sessions; the frontend has no JWT or browser token storage.

## Setup

Use Node.js 24. Start your chosen session backend, then run inside `nextjs-auth`:

```bash
cp .env.example .env
# Set AUTH_BACKEND_URL to your backend's origin.
# Set AUTH_SESSION_COOKIE to the session cookie name issued by that backend.
npm ci
npm run dev
```

Open `http://localhost:3000`. Log in with credentials managed by your backend.
`AUTH_BACKEND_URL` is server-only and defaults to `http://127.0.0.1:8080`.
Use an origin without a trailing slash or API path. `AUTH_SESSION_COOKIE` defaults
to `app_session`; for example, set it to `connect.sid` for a backend using that
cookie name. Restart the server after changing configuration.

The `/api/auth/[action]` route forwards only login, session, and logout to the
configured backend, including the session cookie and original CSRF headers.
The dashboard calls `requireSession()` on the server: a cookie alone is never
accepted as proof of login. The backend validates the session before rendering.
Private fetches disable caching.

## Backend session contract

| Endpoint                | Expected behavior                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `POST /api/auth/login`  | Accept JSON `{ "email": "...", "password": "..." }`; return `200` and a session cookie, or `401` for invalid credentials |
| `GET /api/auth/session` | Validate the session cookie and return `200` with `{ "email": "..." }`, or `401`                                         |
| `POST /api/auth/logout` | Revoke the session, clear the cookie, and return `204`                                                                   |

Issue an HttpOnly, host-only cookie with `Path=/`, `SameSite=Lax`, and `Secure`
under HTTPS. Match its name with `AUTH_SESSION_COOKIE`. Use the single session
cookie for authentication; other cookies are not forwarded to the backend.
The proxy passes Set-Cookie headers back to the browser.

Auth POST requests include `X-CSRF-Protection: 1`. The backend must validate it
and the original frontend Origin; allow the exact frontend origin including
scheme and port. Auth responses should use `Cache-Control: no-store`.
Call `requireSession()` in future protected pages and validate sessions on
private backend routes too. Registration and roles belong to your backend.

For another API contract, adapt `src/lib/session.ts`, `src/app/api/auth/[action]/route.ts`,
`src/app/login/page.tsx`, and `src/app/dashboard/logout.tsx`. Styling lives in
`src/app/globals.css`.

The repository's `fastapi-base` is an optional example implementation. Express
and NestJS bases need matching auth routes added before they can serve this app.
No sibling backend directory is required.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

## Docker

Start your backend separately. Supply a URL reachable from the frontend container.
For a backend running on your host at port 8080:

```bash
AUTH_BACKEND_URL=http://host.docker.internal:8080 docker compose up --build
```

Open `http://localhost:3000`. Compose runs only Next.js; it does not select or
start a backend. Set `AUTH_SESSION_COOKIE` in `.env` or your shell if it differs
from `app_session`. Use a service hostname or HTTPS origin for a remote backend.
`localhost` inside the container refers to the container, not your host backend.

For production, enable HTTPS, use Secure cookies, and configure the backend's
trusted frontend origins. `AUTH_BACKEND_URL` is read at runtime. For a local
production build, run `npm run build` then `npm start`; the postbuild step copies
static assets into the standalone output.
