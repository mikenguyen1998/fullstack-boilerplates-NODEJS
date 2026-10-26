# fastapi-base — Without Authentication

Independent Python 3.10+ backend starter using FastAPI, Pydantic and Uvicorn.
All endpoints are public. No authentication or database setup is required.

## Setup

Run these commands inside `fastapi-base`:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive Swagger documentation is at
`/docs`, ReDoc at `/redoc`, and the OpenAPI schema at `/openapi.json`.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/health` | Returns `{"status":"ok"}` |
| POST | `/api/v1/examples` | Validates and echoes a JSON body without storing it |

```bash
curl http://127.0.0.1:8000/health
curl -X POST http://127.0.0.1:8000/api/v1/examples \
  -H 'Content-Type: application/json' \
  -d '{"name":"Sample","quantity":2}'
```

Names are trimmed and must contain 1–100 characters. Quantity must be an integer
from 1–1000. Invalid input returns FastAPI's standard `422` validation response.
Add application routes to `app/main.py`; introduce database storage when needed.

## Checks

```bash
ruff check .
ruff format --check .
python -m pytest
```

## Docker

```bash
docker build -t fastapi-base .
docker run --rm -p 8000:8000 fastapi-base
```

The container runs Uvicorn as a non-root user without development auto-reload.
