/**
 * ============================================================================
 *  ALTERNATIVE: MySQL (commented out — not used by default)
 * ============================================================================
 *
 * Option A — keep Prisma, switch provider (recommended, minimal code change):
 *   1. npm install @prisma/adapter-mariadb   (works for MySQL & MariaDB)
 *   2. prisma/schema.prisma:  datasource db { provider = "mysql" }
 *   3. .env: DATABASE_URL=mysql://root:root@localhost:3306/express_base
 *   4. src/database/prisma.ts: replace PrismaPg with
 *        import { PrismaMariaDb } from '@prisma/adapter-mariadb';
 *        const adapter = new PrismaMariaDb(env.DATABASE_URL);
 *   5. Re-run: npm run prisma:generate && npm run prisma:migrate
 *
 * Option B — raw driver with mysql2 (shown below):
 *   1. npm install mysql2
 *   2. Add MYSQL_URL to .env and src/config/env.ts
 *   3. Rename this file to `mysql.ts`, un-comment, wire into src/database/index.ts
 *   4. (docker-compose) un-comment the `mysql` service.
 */

// import mysql from 'mysql2/promise';
//
// import { env } from '@/config/env.js';
// import { logger } from '@/config/logger.js';
//
// let pool: mysql.Pool | undefined;
//
// export function getMySqlPool(): mysql.Pool {
//   pool ??= mysql.createPool({
//     uri: env.MYSQL_URL,
//     connectionLimit: 10,
//     waitForConnections: true,
//     namedPlaceholders: true,
//   });
//   return pool;
// }
//
// export async function connectMySql(): Promise<void> {
//   const conn = await getMySqlPool().getConnection();
//   await conn.ping();
//   conn.release();
//   logger.info('MySQL connected');
// }
//
// export async function disconnectMySql(): Promise<void> {
//   await pool?.end();
//   pool = undefined;
// }
//
// // Usage:
// // const [rows] = await getMySqlPool().execute('SELECT * FROM users WHERE id = :id', { id });

export {};
