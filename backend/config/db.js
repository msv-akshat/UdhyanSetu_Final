// config/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,           // sql108.infinityfree.com
  user: process.env.DB_USER,           // if0_39247593
  password: process.env.DB_PASSWORD,   // your vPanel password
  database: process.env.DB_NAME,       // if0_39247593_udhyan_db
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const connectDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
};
