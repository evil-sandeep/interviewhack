import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import healthRoutes from './routes/healthRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 🛡️ SECURITY & PERFORMANCE MIDDLEWARE
// ==========================================

// Helmet protects from well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet()); 

// Compression decreases the size of response bodies, increasing app speed drastically
app.use(compression());

// Define generic API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 150, // Limit each IP to 150 requests per `window`
  message: { success: false, error: 'Too many requests generated from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure CORS for Production readiness
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // Restrict to front-end domain in production!
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter purely to programmatic routes
app.use('/api/', apiLimiter);

// ==========================================
// 🗄️ DATABASE & ROUTES
// ==========================================
connectDB();

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes); 
app.use('/api/auth', authRoutes);

// Error Handling Middleware Pipeline
app.use((err, req, res, next) => {
  console.error("Unhandled Sever Error:", err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Malfunction' });
});

app.listen(PORT, () => {
  console.log(`Server executing securely on port ${PORT}`);
});
