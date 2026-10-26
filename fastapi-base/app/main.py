from fastapi import FastAPI, Request
from pydantic import BaseModel, ConfigDict, Field

from app.auth import Settings, create_auth_router

app = FastAPI(
    title="FastAPI Base",
    description="Public examples and optional server-side session authentication.",
    version="1.0.0",
)

app.include_router(create_auth_router(Settings.from_env()))


@app.middleware("http")
async def no_auth_cache(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api/auth/"):
        response.headers["Cache-Control"] = "no-store"
    return response


class Example(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str = Field(min_length=1, max_length=100)
    quantity: int = Field(strict=True, ge=1, le=1000)


@app.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/examples", tags=["Examples"])
def validate_example(example: Example) -> Example:
    """Validate and echo a request body; no data is persisted."""
    return example
