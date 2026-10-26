"""Generate a password hash with: python -m app.passwords."""

import getpass
import hashlib
import hmac
import secrets

ITERATIONS = 600_000


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), ITERATIONS
    ).hex()
    return f"pbkdf2_sha256${ITERATIONS}${salt}${digest}"


def verify_password(password: str, encoded: str) -> bool:
    algorithm, iterations, salt, expected = encoded.split("$")
    if algorithm != "pbkdf2_sha256" or int(iterations) != ITERATIONS:
        raise ValueError("Unsupported password hash")
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), ITERATIONS
    ).hex()
    return hmac.compare_digest(digest, expected)


if __name__ == "__main__":
    password = getpass.getpass("Password (at least 12 characters): ")
    if len(password) < 12:
        raise SystemExit("Use at least 12 characters")
    if password != getpass.getpass("Confirm password: "):
        raise SystemExit("Passwords do not match")
    print(hash_password(password))
