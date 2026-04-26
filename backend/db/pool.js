import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;
const useSsl = process.env.PG_SSL === 'true' || (connectionString && process.env.PG_SSL !== 'false');

const pool = new Pool({
  ...(connectionString
    ? { connectionString }
    : {
        host:     process.env.PG_HOST     || 'localhost',
        port:     parseInt(process.env.PG_PORT || '5432'),
        database: process.env.PG_DATABASE || 'medithrex',
        user:     process.env.PG_USER     || 'postgres',
        password: process.env.PG_PASSWORD || 'postgres',
      }),
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

// Helper — run a query with automatic client release
export const query = (text, params) => pool.query(text, params);

// Helper — get a client for transactions
export const getClient = () => pool.connect();

export default pool;
