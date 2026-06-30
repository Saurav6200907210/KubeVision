import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER || 'kubevision',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'kubevision',
        password: process.env.DB_PASSWORD || 'password',
        port: parseInt(process.env.DB_PORT || '5432', 10),
      }
);

export const query = (text: string, params?: any[]) => pool.query(text, params);
