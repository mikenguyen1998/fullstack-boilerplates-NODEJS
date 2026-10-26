ALTER TABLE "users" DROP COLUMN "password_hash", DROP COLUMN "token_version", DROP COLUMN "last_login_at", DROP COLUMN "role";
DROP TYPE "Role";
