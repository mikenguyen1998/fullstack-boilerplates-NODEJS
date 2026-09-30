/**
 * Central place to connect / disconnect every datastore the app uses.
 * To enable an alternative datastore, un-comment its example file
 * (e.g. mongoose.example.ts -> mongoose.ts) and wire it in here.
 */
import { connectPrisma, disconnectPrisma } from './prisma.js';
// import { connectMongo, disconnectMongo } from './mongoose.js';
// import { connectMySql, disconnectMySql } from './mysql.js';
// import { connectRedis, disconnectRedis } from './redis.js';

export async function connectDatabases(): Promise<void> {
  await connectPrisma();
  // await connectMongo();
  // await connectMySql();
  // await connectRedis();
}

export async function disconnectDatabases(): Promise<void> {
  await Promise.allSettled([
    disconnectPrisma(),
    // disconnectMongo(),
    // disconnectMySql(),
    // disconnectRedis(),
  ]);
}

export { prisma, pingPrisma } from './prisma.js';
