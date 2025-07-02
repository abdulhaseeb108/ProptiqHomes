// ✅ index.js — FINAL VERSION (Backend Entry Point)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectMongoDB from './db.js';
import path from 'path';

// Load environment variables
dotenv.config();

const __dirname= path.resolve();
// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
console.log('⏳ Connecting to MongoDB...');
connectMongoDB()
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Import and use routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import listingRouter from './routes/listing.routes.js';


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname, 'client' , 'dist', 'index.html'))
})
// Optional route: message
try {
  const messageRouter = (await import('./routes/message.routes.js')).default;
  app.use('/api/message', messageRouter);
} catch (err) {
  console.warn('⚠️ message.routes.js not found or not used. Skipping...');
}

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
