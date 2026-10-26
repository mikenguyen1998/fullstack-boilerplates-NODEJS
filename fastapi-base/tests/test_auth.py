import sqlite3
import time

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.auth import COOKIE, Settings, create_auth_router, token_hash
from app.passwords import hash_password, verify_password

PASSWORD = "a-long-test-password"
HASH = hash_password(PASSWORD)
HEADERS = {"Origin": "http://localhost:5173", "X-CSRF-Protection": "1"}
LOGIN = {"email": "owner@example.com", "password": PASSWORD}


@pytest.fixture
def settings(tmp_path):
    return Settings(
        "owner@example.com",
        HASH,
        str(tmp_path / "auth.db"),
        ("http://localhost:5173",),
        False,
    )


def client_for(settings):
    app = FastAPI()
    app.include_router(create_auth_router(settings))
    return TestClient(app)


def test_session_lifecycle_and_persistence(settings):
    with client_for(settings) as client:
        assert client.get("/api/auth/session").status_code == 401
        response = client.post("/api/auth/login", json=LOGIN, headers=HEADERS)
        assert response.status_code == 200
        assert response.json() == {"email": "owner@example.com"}
        assert response.headers["cache-control"] == "no-store"
        cookie = response.headers["set-cookie"].lower()
        assert "httponly" in cookie and "samesite=lax" in cookie
        assert "max-age=28800" in cookie
        token = client.cookies.get(COOKIE)
        with sqlite3.connect(settings.database) as db:
            stored = db.execute("SELECT token FROM sessions").fetchone()[0]
        assert stored == token_hash(token) and stored != token

    with client_for(settings) as client:
        client.cookies.set(COOKIE, token)
        assert client.get("/api/auth/session").status_code == 200
        assert client.post("/api/auth/logout", headers=HEADERS).status_code == 204
        assert client.get("/api/auth/session").status_code == 401
        client.cookies.set(COOKIE, token)
        assert client.get("/api/auth/session").status_code == 401


def test_rotation_expiry_and_tampering(settings):
    with client_for(settings) as client:
        client.post("/api/auth/login", json=LOGIN, headers=HEADERS)
        original = client.cookies.get(COOKIE)
        client.post("/api/auth/login", json=LOGIN, headers=HEADERS)
        rotated = client.cookies.get(COOKIE)
        assert rotated != original
        client.cookies.clear()
        client.cookies.set(COOKIE, original)
        assert client.get("/api/auth/session").status_code == 401
        client.cookies.set(COOKIE, "forged-token")
        assert client.get("/api/auth/session").status_code == 401
        with sqlite3.connect(settings.database) as db:
            db.execute("UPDATE sessions SET expires = ?", (int(time.time()) - 1,))
        client.cookies.set(COOKIE, rotated)
        assert client.get("/api/auth/session").status_code == 401


@pytest.mark.parametrize(
    "headers",
    [
        {},
        {"Origin": "http://localhost:5173"},
        {"Origin": "https://evil.example", "X-CSRF-Protection": "1"},
        {"Origin": "http://localhost:5173.evil.example", "X-CSRF-Protection": "1"},
        {"Origin": "null", "X-CSRF-Protection": "1"},
    ],
)
def test_csrf_on_login_and_logout(settings, headers):
    with client_for(settings) as client:
        assert (
            client.post("/api/auth/login", json=LOGIN, headers=headers).status_code
            == 403
        )
        assert client.post("/api/auth/logout", headers=headers).status_code == 403


def test_bad_credentials_and_rate_limit(settings):
    with client_for(settings) as client:
        for _ in range(5):
            response = client.post(
                "/api/auth/login", json={**LOGIN, "password": "wrong"}, headers=HEADERS
            )
            assert response.status_code == 401
            assert COOKIE not in client.cookies
        assert (
            client.post("/api/auth/login", json=LOGIN, headers=HEADERS).status_code
            == 429
        )


def test_disabled_until_configured(tmp_path):
    settings = Settings("", "", str(tmp_path / "auth.db"), (), False)
    with client_for(settings) as client:
        assert client.get("/api/auth/session").status_code == 503


def test_password_hash():
    assert verify_password(PASSWORD, HASH)
    assert not verify_password("wrong", HASH)
    assert PASSWORD not in HASH
