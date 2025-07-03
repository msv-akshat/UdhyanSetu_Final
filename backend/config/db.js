// config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export const connectDB = async () => {
  try {
    const client = await db.connect();
    console.log('✅ PostgreSQL database connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
};
