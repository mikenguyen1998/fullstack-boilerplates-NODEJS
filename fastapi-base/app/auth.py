"""A single configured account with revocable, server-side SQLite sessions."""

import hashlib
import os
import secrets
import sqlite3
import time
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, ConfigDict, Field

from app.passwords import verify_password

COOKIE = "app_session"
TTL = 8 * 60 * 60


@dataclass(frozen=True)
class Settings:
    email: str
    password_hash: str
    database: str
    origins: tuple[str, ...]
    secure: bool

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            email=os.getenv("AUTH_EMAIL", "").strip().lower(),
            password_hash=os.getenv("AUTH_PASSWORD_HASH", ""),
            database=os.getenv("AUTH_DATABASE", "data/auth.sqlite3"),
            origins=tuple(
                value.strip()
                for value in os.getenv(
                    "AUTH_ORIGINS", "http://localhost:5173,http://localhost:3000"
                ).split(",")
                if value.strip()
            ),
            secure=os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true",
        )


class Login(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=1024)


class User(BaseModel):
    email: str


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_auth_router(settings: Settings) -> APIRouter:
    router = APIRouter(prefix="/api/auth", tags=["Auth"])
    if settings.password_hash:
        verify_password("", settings.password_hash)

    @contextmanager
    def connect():
        Path(settings.database).parent.mkdir(parents=True, exist_ok=True)
        db = sqlite3.connect(settings.database)
        db.execute(
            "CREATE TABLE IF NOT EXISTS sessions "
            "(token TEXT PRIMARY KEY, email TEXT NOT NULL, expires INTEGER NOT NULL)"
        )
        db.execute(
            "CREATE TABLE IF NOT EXISTS attempts "
            "(client TEXT PRIMARY KEY, count INTEGER NOT NULL, "
            "expires INTEGER NOT NULL)"
        )
        try:
            with db:
                yield db
        finally:
            db.close()

    def configured(response: Response) -> None:
        response.headers["Cache-Control"] = "no-store"
        if not settings.email or not settings.password_hash:
            raise HTTPException(503, "Configure AUTH_EMAIL and AUTH_PASSWORD_HASH")

    def csrf(request: Request) -> None:
        if (
            request.headers.get("origin") not in settings.origins
            or request.headers.get("x-csrf-protection") != "1"
        ):
            raise HTTPException(403, "Untrusted request origin or missing CSRF header")

    def session_user(request: Request) -> User:
        token = request.cookies.get(COOKIE, "")
        with connect() as db:
            row = db.execute(
                "SELECT email FROM sessions WHERE token = ? AND expires > ?",
                (token_hash(token), int(time.time())),
            ).fetchone()
        if row is None or row[0] != settings.email:
            raise HTTPException(401, "Please log in")
        return User(email=row[0])

    router.dependencies = [Depends(configured)]

    @router.post("/login", dependencies=[Depends(csrf)])
    def login(body: Login, request: Request, response: Response) -> User:
        now = int(time.time())
        # ponytail: one account-wide limit; add per-user/IP limits for multi-user apps.
        client = settings.email
        with connect() as db:
            db.execute("DELETE FROM attempts WHERE expires <= ?", (now,))
            db.execute("DELETE FROM sessions WHERE expires <= ?", (now,))
            db.execute(
                "INSERT INTO attempts VALUES (?, 1, ?) "
                "ON CONFLICT(client) DO UPDATE SET count = count + 1",
                (client, now + 60),
            )
            count = db.execute(
                "SELECT count FROM attempts WHERE client = ?", (client,)
            ).fetchone()[0]
        if count > 5:
            raise HTTPException(429, "Too many login attempts; try again in a minute")

        # Verify even an unknown email so both failures take the same slow path.
        valid = verify_password(body.password, settings.password_hash)
        if not valid or body.email.strip().lower() != settings.email:
            raise HTTPException(401, "Invalid email or password")

        token = secrets.token_urlsafe(32)
        with connect() as db:
            db.execute(
                "DELETE FROM sessions WHERE token = ?",
                (token_hash(request.cookies.get(COOKIE, "")),),
            )
            db.execute(
                "INSERT INTO sessions VALUES (?, ?, ?)",
                (token_hash(token), settings.email, now + TTL),
            )
        response.set_cookie(
            COOKIE,
            token,
            max_age=TTL,
            httponly=True,
            secure=settings.secure,
            samesite="lax",
            path="/",
        )
        return User(email=settings.email)

    @router.get("/session")
    def session(user: Annotated[User, Depends(session_user)]) -> User:
        return user

    @router.post("/logout", status_code=204, dependencies=[Depends(csrf)])
    def logout(request: Request, response: Response) -> None:
        with connect() as db:
            db.execute(
                "DELETE FROM sessions WHERE token = ?",
                (token_hash(request.cookies.get(COOKIE, "")),),
            )
        response.delete_cookie(
            COOKIE, path="/", secure=settings.secure, httponly=True, samesite="lax"
        )

    return router
