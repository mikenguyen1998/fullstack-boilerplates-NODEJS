import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAuth1792972800000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "password", DROP COLUMN "refresh_token_hash", DROP COLUMN "last_login_at", DROP COLUMN "role"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL DEFAULT '', ADD COLUMN "refresh_token_hash" varchar(255), ADD COLUMN "last_login_at" timestamptz, ADD COLUMN "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT`,
    );
  }
}
