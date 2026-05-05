/**
 * DevPortfolio AI - Server Entry Point
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const githubRoutes = require('./routes/github');
const portfolioRoutes = require('./routes/portfolio');
const resumeRoutes = require('./routes/resume');
const aiRoutes = require('./routes/ai');
const deployRoutes = require('./routes/deploy');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Connect to MongoDB ---
connectDB();

// --- Security Middleware ---
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://devportfolio-ai-eight.vercel.app',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// --- Body Parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Logging (dev only) ---
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Static Uploads ---
app.use('/uploads', express.static('uploads'));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deploy', deployRoutes);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
