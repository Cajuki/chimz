/**
 * Medithrex — PostgreSQL Schema Initialiser
 * Run: npm run db:init
 *
 * Creates all tables if they do not already exist.
 * Safe to run multiple times (idempotent).
 */

import { query } from './pool.js';

const createTables = async () => {
  console.log('🔧 Initialising Medithrex database schema...\n');

  // ── USERS ────────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(150)        NOT NULL,
      email       VARCHAR(150) UNIQUE NOT NULL,
      phone       VARCHAR(30),
      company     VARCHAR(150),
      county      VARCHAR(80),
      country     VARCHAR(80)         DEFAULT 'Kenya',
      password    TEXT                NOT NULL,
      role        VARCHAR(20)         DEFAULT 'user' CHECK (role IN ('user','admin')),
      created_at  TIMESTAMPTZ         DEFAULT NOW()
    );
  `);
  console.log('  ✅ users');

  // ── PRODUCTS ─────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id                SERIAL PRIMARY KEY,
      name              VARCHAR(200)  NOT NULL,
      sku               VARCHAR(60)   UNIQUE,
      description       TEXT          NOT NULL,
      short_description VARCHAR(300),
      category          VARCHAR(100)  NOT NULL,
      price             NUMERIC(14,2),
      price_on_request  BOOLEAN       DEFAULT FALSE,
      images            TEXT[]        DEFAULT '{}',
      brand             VARCHAR(100),
      origin            VARCHAR(100),
      in_stock          BOOLEAN       DEFAULT TRUE,
      featured          BOOLEAN       DEFAULT FALSE,
      tags              TEXT[]        DEFAULT '{}',
      specifications    JSONB         DEFAULT '[]',
      created_at        TIMESTAMPTZ   DEFAULT NOW()
    );
  `);
  console.log('  ✅ products');

  // ── ORDERS ───────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      order_number    VARCHAR(30)  UNIQUE NOT NULL,
      user_id         INTEGER      REFERENCES users(id) ON DELETE SET NULL,
      total_amount    NUMERIC(14,2),
      status          VARCHAR(30)  DEFAULT 'Pending'
                        CHECK (status IN ('Pending','Confirmed','Processing','Shipped','Delivered','Cancelled')),
      payment_method  VARCHAR(40)  DEFAULT 'Invoice',
      payment_status  VARCHAR(20)  DEFAULT 'Unpaid'
                        CHECK (payment_status IN ('Unpaid','Paid','Partial')),
      street          VARCHAR(200),
      city            VARCHAR(100),
      county          VARCHAR(80),
      country         VARCHAR(80)  DEFAULT 'Kenya',
      notes           TEXT,
      created_at      TIMESTAMPTZ  DEFAULT NOW()
    );
  `);
  console.log('  ✅ orders');

  // ── ORDER ITEMS ──────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id          SERIAL PRIMARY KEY,
      order_id    INTEGER      REFERENCES orders(id)   ON DELETE CASCADE,
      product_id  INTEGER      REFERENCES products(id) ON DELETE SET NULL,
      name        VARCHAR(200),
      quantity    INTEGER      NOT NULL DEFAULT 1,
      price       NUMERIC(14,2)
    );
  `);
  console.log('  ✅ order_items');

  // ── QUOTES ───────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id            SERIAL PRIMARY KEY,
      quote_number  VARCHAR(30)  UNIQUE NOT NULL,
      user_id       INTEGER      REFERENCES users(id) ON DELETE SET NULL,
      name          VARCHAR(150) NOT NULL,
      email         VARCHAR(150) NOT NULL,
      phone         VARCHAR(30)  NOT NULL,
      company       VARCHAR(150),
      county        VARCHAR(80),
      message       TEXT,
      status        VARCHAR(30)  DEFAULT 'New'
                      CHECK (status IN ('New','Reviewed','Quoted','Accepted','Declined')),
      quoted_price  NUMERIC(14,2),
      admin_notes   TEXT,
      created_at    TIMESTAMPTZ  DEFAULT NOW()
    );
  `);
  console.log('  ✅ quotes');

  // ── QUOTE ITEMS ──────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS quote_items (
      id           SERIAL PRIMARY KEY,
      quote_id     INTEGER      REFERENCES quotes(id) ON DELETE CASCADE,
      product_id   INTEGER      REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(200),
      quantity     INTEGER      DEFAULT 1,
      notes        TEXT
    );
  `);
  console.log('  ✅ quote_items');

  // ── CONTACT MESSAGES ─────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(150) NOT NULL,
      email       VARCHAR(150) NOT NULL,
      phone       VARCHAR(30),
      subject     VARCHAR(200),
      message     TEXT         NOT NULL,
      is_read     BOOLEAN      DEFAULT FALSE,
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );
  `);
  console.log('  ✅ contact_messages');

  // ── INDEXES ──────────────────────────────────────────────────────────────
  await query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_products_featured  ON products(featured);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_products_in_stock  ON products(in_stock);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id     ON orders(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_quotes_email        ON quotes(email);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_quotes_user_id      ON quotes(user_id);`);
  console.log('  ✅ indexes');

  console.log('\n✅ Schema initialised successfully.\n');
  console.log('👉 Next: run  npm run db:seed  to populate demo data.\n');
  process.exit(0);
};

createTables().catch(err => {
  console.error('\n❌ Schema initialisation failed:', err.message);
  console.error('\nMake sure PostgreSQL is running and your .env credentials are correct.\n');
  process.exit(1);
});
