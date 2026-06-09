require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const path         = require('path');
const connectDB    = require('./config/db');
const routes       = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security & Logging ────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [
      'http://localhost:3000',
      'http://localhost:5500',
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  }
}));
app.use(morgan('dev'));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Static Frontend ───────────────────────────────────────────────────────────
// FRONTEND_PATH in .env uses Windows-native path (required on Windows + Git Bash)
const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ── DB Connection Middleware (lazy, cached — safe for serverless) ─────────────
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({ success: false, message: 'Database unavailable. Check MONGO_URI.', data: null });
  }
};

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', dbMiddleware, routes);

// Legacy /players route kept for backward compatibility
app.use('/players', dbMiddleware, require('./routes/playerRoutes'));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CRICKO API is running', data: { version: '2.0.0' } });
});

// ── 404 for Unknown API Calls ─────────────────────────────────────────────────
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found', data: null });
});

// ── Centralized Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// Local dev: start the server. Vercel: export the app as a handler.
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n  CRICKO API v2.0  →  http://localhost:${PORT}`);
    console.log(`  Admin Dashboard  →  http://localhost:${PORT}/admin.html`);
    console.log(`  Frontend path:      ${frontendPath}\n`);
  });
}

module.exports = app;
