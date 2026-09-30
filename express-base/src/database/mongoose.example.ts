/**
 * ============================================================================
 *  ALTERNATIVE: MongoDB with Mongoose (commented out — not used by default)
 * ============================================================================
 *
 * How to enable:
 *   1. npm install mongoose
 *   2. Add to .env:            MONGODB_URI=mongodb://localhost:27017/express_base
 *   3. Add to src/config/env.ts: MONGODB_URI: z.string().url(),
 *   4. Rename this file to `mongoose.ts` and un-comment the code below.
 *   5. Call connectMongo()/disconnectMongo() from src/database/index.ts.
 *   6. (docker-compose) un-comment the `mongo` service.
 *
 * Note: Prisma also supports MongoDB (provider = "mongodb") if you prefer to keep
 * a single ORM — but migrations are not supported for MongoDB in Prisma.
 */

// import mongoose from 'mongoose';
//
// import { env } from '@/config/env.js';
// import { logger } from '@/config/logger.js';
//
// mongoose.set('strictQuery', true);
//
// export async function connectMongo(): Promise<typeof mongoose> {
//   mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'));
//   mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
//
//   const conn = await mongoose.connect(env.MONGODB_URI, {
//     maxPoolSize: 10,
//     serverSelectionTimeoutMS: 5_000,
//   });
//   logger.info('MongoDB connected');
//   return conn;
// }
//
// export async function disconnectMongo(): Promise<void> {
//   await mongoose.disconnect();
// }
//
// // Example model:
// // const UserSchema = new mongoose.Schema(
// //   { email: { type: String, unique: true, required: true }, name: String },
// //   { timestamps: true },
// // );
// // export const UserModel = mongoose.model('User', UserSchema);

export {};
