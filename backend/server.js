import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/pool.js';
import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes   from './routes/orders.js';
import quoteRoutes   from './routes/quotes.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/quotes',   quoteRoutes);
app.use('/api/contact',  contactRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS time');
    res.json({ status: 'Medithrex API Running', database: 'PostgreSQL', time: result.rows[0].time });
  } catch {
    res.status(503).json({ status: 'API Running', database: 'Disconnected' });
  }
});

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: `Route ${req.path} not found` }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const start = async () => {
  try {
    // Test DB connection before accepting traffic
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connection verified');
  } catch (err) {
    console.error('❌ Cannot connect to PostgreSQL:', err.message);
    console.error('\n👉 Make sure PostgreSQL is running and your .env is correct.\n');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Medithrex API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
};

start();
export default app;
