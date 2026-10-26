from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict, Field

app = FastAPI(
    title="FastAPI Base",
    description="Public API starter without authentication.",
    version="1.0.0",
)


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
