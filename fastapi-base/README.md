# fastapi-base

Python 3.10+ backend starter with public examples and optional server-side session
authentication for `react-auth` and `nextjs-auth`. Uses FastAPI, Pydantic, Uvicorn,
and the Python standard library for password hashing and SQLite session storage.

## Setup

Run inside `fastapi-base`:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
export AUTH_EMAIL=owner@example.com
export AUTH_PASSWORD_HASH="$(python -m app.passwords)"
uvicorn app.main:app --reload
```

The password command prompts twice and requires at least 12 characters. It
outputs a salted PBKDF2-SHA256 hash, not the password. Keep the hash in your local
secret configuration. Without an email and hash, auth routes return `503`; public
routes still work. No default account or registration endpoint is provided.

API: `http://127.0.0.1:8000`. Swagger: `/docs`. ReDoc: `/redoc`.
OpenAPI: `/openapi.json`.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/health` | Returns `{"status":"ok"}` |
| POST | `/api/v1/examples` | Validates and echoes `name` and `quantity`; no persistence |
| POST | `/api/auth/login` | Validates email/password and sets an HttpOnly session cookie |
| GET | `/api/auth/session` | Returns `{ "email": "..." }` or `401` for an invalid/expired session |
| POST | `/api/auth/logout` | Revokes the session and clears the cookie; returns `204` |

The public example trims names and accepts 1–100 characters. Quantity must be an
integer from 1–1000. Invalid bodies return `422`.

Auth POST requests require `Origin` matching `AUTH_ORIGINS` and
`X-CSRF-Protection: 1`. Browser apps use same-origin proxies, so cross-origin
credentialed CORS is not enabled. Session responses are not cached.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `AUTH_EMAIL` | Unset | Single account email |
| `AUTH_PASSWORD_HASH` | Unset | Output of `python -m app.passwords` |
| `AUTH_DATABASE` | `data/auth.sqlite3` | Persistent SQLite sessions and login attempt counters |
| `AUTH_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Exact allowed frontend origins, comma-separated |
| `AUTH_COOKIE_SECURE` | `false` | Set to `true` under HTTPS |

Sessions last eight hours. Only SHA-256 hashes of random session tokens are
stored in SQLite; the cookie contains the opaque token and uses HttpOnly,
SameSite=Lax, and Path=/. Login replaces the current session; logout revokes it.
There is no JWT, refresh token, browser token storage, or password-reset flow.

Login is limited to five attempts per minute across the configured account,
including attempts with an unknown email. The limit cannot be bypassed by changing
forwarded IP headers. For a multi-user service, use a managed auth system or
shared database and per-user/IP rate limiting.
Keep one backend instance with persistent local storage for this sample.

## Checks

```bash
ruff check .
ruff format --check .
python -m pytest
```

Tests cover public routes, credential failures, session persistence, rotation,
expiry, logout revocation, cookie tampering, CSRF, and login throttling.

## Docker

With `AUTH_EMAIL` and `AUTH_PASSWORD_HASH` exported in your shell:

```bash
docker build -t fastapi-base .
docker run --rm -p 8000:8000 \
  -e AUTH_EMAIL -e AUTH_PASSWORD_HASH \
  -v fastapi-auth-data:/app/data fastapi-base
```

The container runs as a non-root user and persists sessions in `/app/data`.
The auth frontends can use this backend by setting their `AUTH_BACKEND_URL` to
its reachable origin. Their Compose files run only the frontend; start this
backend separately.
For HTTPS deployment, set `AUTH_COOKIE_SECURE=true` and exact `AUTH_ORIGINS`.
