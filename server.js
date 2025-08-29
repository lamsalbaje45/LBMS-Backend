import express from 'express';
import mongoose from 'mongoose';
import router from './Routes/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = 3000;
const MONGODB_URI = process.env.MONGO_URI;
const connectDB = mongoose.connect(MONGODB_URI);
connectDB
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

app.use(cors({
  origin:['http://localhost:5173','https://lbms-frontend-five.vercel.app/'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router); // Assuming you have a router defined elsewhere
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

