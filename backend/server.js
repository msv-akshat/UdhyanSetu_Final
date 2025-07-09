// server.js
import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://udhyansetu-final.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());



// Connect to database
connectDB();

// Use routes
app.use('/', router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
