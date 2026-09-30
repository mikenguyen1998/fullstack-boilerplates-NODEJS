import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { buildTypeOrmOptions } from './typeorm.options';

/**
 * DataSource cho TypeORM CLI (đọc biến môi trường từ .env).
 *   npm run migration:generate --name=AddSomething
 *   npm run migration:run
 *   npm run migration:revert
 */
const AppDataSource = new DataSource(buildTypeOrmOptions(databaseConfig()));

export default AppDataSource;
