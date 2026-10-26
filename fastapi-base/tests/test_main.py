import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_example_is_public_and_validated():
    response = client.post("/api/v1/examples", json={"name": " Sample ", "quantity": 2})
    assert response.status_code == 200
    assert response.json() == {"name": "Sample", "quantity": 2}


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"name": "   ", "quantity": 1},
        {"name": "x" * 101, "quantity": 1},
        {"name": "Sample", "quantity": 0},
        {"name": "Sample", "quantity": 1001},
        {"name": "Sample", "quantity": True},
        {"name": "Sample", "quantity": 1, "unexpected": "value"},
    ],
)
def test_invalid_example(payload):
    assert client.post("/api/v1/examples", json=payload).status_code == 422


def test_public_example_remains_in_openapi():
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "securitySchemes" not in schema["components"]
    assert "security" not in schema
    assert "/api/v1/examples" in schema["paths"]
