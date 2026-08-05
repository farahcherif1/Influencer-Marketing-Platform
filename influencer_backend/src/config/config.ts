import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // Load environment variables

const isProduction = process.env.NODE_ENV === 'prod';

export const getDatabaseConfig = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: isProduction ? false : true, // Ensure this is false for migrations
  ssl: isProduction
    ? { rejectUnauthorized: true } // RDS / production
    : false, // local dev
});
