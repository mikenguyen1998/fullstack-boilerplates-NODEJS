# react-auth

Minimal React + Vite + TypeScript web starter with login, logout, and a protected
dashboard. Home is public. Connect it to any backend that implements the session
API below: Express, NestJS, FastAPI, or another framework. Credentials and session
storage belong to the backend.

## Setup

Use Node.js 24. Start your chosen session backend, then run inside `react-auth`:

```bash
cp .env.example .env
# Set AUTH_BACKEND_URL to your backend's origin, e.g. http://localhost:8080.
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite loads `AUTH_BACKEND_URL` from `.env` and proxies
`/api/auth` there. The URL is used by the server and is not exposed in the browser
bundle. Supply an origin without a trailing slash or API path. Restart Vite after
changing it. The default is `http://127.0.0.1:8080`.

Allow the exact frontend origin on the backend, including scheme and port.
The dev server uses port 5173 strictly to keep that origin consistent.
Log in with credentials managed by your backend.

## Backend session contract

| Endpoint                | Expected behavior                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `POST /api/auth/login`  | Accept JSON `{ "email": "...", "password": "..." }`; return `200` and a session cookie, or `401` for invalid credentials |
| `GET /api/auth/session` | Validate the session cookie and return `200` with `{ "email": "..." }`, or `401`                                         |
| `POST /api/auth/logout` | Revoke the session, clear the cookie, and return `204`                                                                   |

The backend must issue an HttpOnly, host-only cookie with `Path=/`,
`SameSite=Lax`, and `Secure` under HTTPS. The browser manages the cookie; React
does not read or store its token, and any cookie name can be used.
Auth POST requests include `X-CSRF-Protection: 1`; validate it and the original
frontend Origin on the backend. Auth responses should use `Cache-Control: no-store`.
The proxy forwards cookies, Set-Cookie, Origin, and the CSRF header.

The `/dashboard` loader validates the backend session and redirects unauthorized
visitors to `/login`. Backend private-data routes must also validate the session.
Errors are shown without treating a backend outage as a logged-out session.
No JWT, browser token storage, registration, or roles are built into this frontend.

For a different API contract, adapt `src/auth.ts`, `src/pages.tsx`, and
`src/router.tsx`, plus the proxy paths if needed. Edit `src/styles.css` for styling.

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

Start your backend separately. Then provide a URL reachable from the frontend
container. For a backend running on your host at port 8080:

```bash
AUTH_BACKEND_URL=http://host.docker.internal:8080 docker compose up --build
```

Open `http://localhost:5173`. Compose runs only Nginx serving the frontend.
Its startup template substitutes `AUTH_BACKEND_URL` into the auth proxy.
Use a service hostname or HTTPS origin instead when the backend runs elsewhere.
`localhost` inside the container refers to that container, not your host backend.

Configure your backend to trust `http://localhost:5173`. For HTTPS deployment,
enable Secure cookies on the backend. `npm run preview` only serves built assets;
use Compose for a production-style auth preview.
