-- =============================================================================
--  MEDITHREX — Complete PostgreSQL Database Script
--  Run this file directly in psql, pgAdmin, DBeaver, or TablePlus
--
--  Usage (psql):
--    psql -U postgres -c "CREATE DATABASE medithrex;"
--    psql -U postgres -d medithrex -f medithrex.sql
--
--  Usage (pgAdmin):
--    1. Create a database named "medithrex"
--    2. Open Query Tool → paste this file → Run (F5)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. SAFETY — drop existing tables in correct dependency order (optional)
--    Uncomment the block below only if you want a clean re-install
-- ─────────────────────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS contact_messages CASCADE;
-- DROP TABLE IF EXISTS quote_items      CASCADE;
-- DROP TABLE IF EXISTS quotes           CASCADE;
-- DROP TABLE IF EXISTS order_items      CASCADE;
-- DROP TABLE IF EXISTS orders           CASCADE;
-- DROP TABLE IF EXISTS products         CASCADE;
-- DROP TABLE IF EXISTS users            CASCADE;


-- =============================================================================
-- 1. TABLES
-- =============================================================================

-- ── USERS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL          PRIMARY KEY,
    name        VARCHAR(150)    NOT NULL,
    email       VARCHAR(150)    UNIQUE NOT NULL,
    phone       VARCHAR(30),
    company     VARCHAR(150),
    county      VARCHAR(80),
    country     VARCHAR(80)     DEFAULT 'Kenya',
    password    TEXT            NOT NULL,
    role        VARCHAR(20)     DEFAULT 'user'
                                CHECK (role IN ('user', 'admin')),
    created_at  TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE  users              IS 'Registered Medithrex customer and admin accounts';
COMMENT ON COLUMN users.role         IS 'user = customer, admin = back-office staff';
COMMENT ON COLUMN users.password     IS 'bcrypt hash — never store plain text';

-- ── PRODUCTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id                SERIAL          PRIMARY KEY,
    name              VARCHAR(200)    NOT NULL,
    sku               VARCHAR(60)     UNIQUE,
    description       TEXT            NOT NULL,
    short_description VARCHAR(300),
    category          VARCHAR(100)    NOT NULL,
    price             NUMERIC(14, 2),                 -- NULL when price_on_request = TRUE
    price_on_request  BOOLEAN         DEFAULT FALSE,
    images            TEXT[]          DEFAULT '{}',   -- array of image URLs
    brand             VARCHAR(100),
    origin            VARCHAR(100),
    in_stock          BOOLEAN         DEFAULT TRUE,
    featured          BOOLEAN         DEFAULT FALSE,
    tags              TEXT[]          DEFAULT '{}',
    specifications    JSONB           DEFAULT '[]',   -- [{key, value}, ...]
    created_at        TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE  products                IS 'Medical and laboratory equipment catalogue';
COMMENT ON COLUMN products.specifications IS 'JSON array: [{"key":"Detector Size","value":"43x43 cm"}, ...]';
COMMENT ON COLUMN products.images        IS 'Array of public image URLs';

-- ── ORDERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL          PRIMARY KEY,
    order_number    VARCHAR(30)     UNIQUE NOT NULL,  -- e.g. MTX-12345678
    user_id         INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    total_amount    NUMERIC(14, 2),
    status          VARCHAR(30)     DEFAULT 'Pending'
                                    CHECK (status IN (
                                        'Pending', 'Confirmed', 'Processing',
                                        'Shipped', 'Delivered', 'Cancelled'
                                    )),
    payment_method  VARCHAR(40)     DEFAULT 'Invoice',  -- Invoice, M-Pesa, Bank Transfer, Credit Card
    payment_status  VARCHAR(20)     DEFAULT 'Unpaid'
                                    CHECK (payment_status IN ('Unpaid', 'Paid', 'Partial')),
    -- Shipping address (denormalised for historical accuracy)
    street          VARCHAR(200),
    city            VARCHAR(100),
    county          VARCHAR(80),
    country         VARCHAR(80)     DEFAULT 'Kenya',
    notes           TEXT,
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Customer equipment purchase orders';

-- ── ORDER ITEMS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL          PRIMARY KEY,
    order_id    INTEGER         REFERENCES orders(id)   ON DELETE CASCADE,
    product_id  INTEGER         REFERENCES products(id) ON DELETE SET NULL,
    name        VARCHAR(200),   -- snapshot of product name at time of order
    quantity    INTEGER         NOT NULL DEFAULT 1,
    price       NUMERIC(14, 2)  -- unit price snapshot at time of order
);

COMMENT ON TABLE  order_items       IS 'Line items belonging to an order';
COMMENT ON COLUMN order_items.name  IS 'Snapshot of product name — preserved even if product is deleted';
COMMENT ON COLUMN order_items.price IS 'Unit price at time of purchase';

-- ── QUOTES ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
    id            SERIAL          PRIMARY KEY,
    quote_number  VARCHAR(30)     UNIQUE NOT NULL,    -- e.g. QT-12345678
    user_id       INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    -- Contact info (captured even for guest users)
    name          VARCHAR(150)    NOT NULL,
    email         VARCHAR(150)    NOT NULL,
    phone         VARCHAR(30)     NOT NULL,
    company       VARCHAR(150),
    county        VARCHAR(80),
    message       TEXT,
    status        VARCHAR(30)     DEFAULT 'New'
                                  CHECK (status IN (
                                      'New', 'Reviewed', 'Quoted', 'Accepted', 'Declined'
                                  )),
    quoted_price  NUMERIC(14, 2), -- filled by admin after review
    admin_notes   TEXT,           -- internal admin notes
    created_at    TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE quotes IS 'Equipment quote requests submitted by customers or guests';

-- ── QUOTE ITEMS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_items (
    id           SERIAL          PRIMARY KEY,
    quote_id     INTEGER         REFERENCES quotes(id)   ON DELETE CASCADE,
    product_id   INTEGER         REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200),   -- free-text name (may not match a product ID)
    quantity     INTEGER         DEFAULT 1,
    notes        TEXT            -- customer specifications / model preferences
);

COMMENT ON TABLE quote_items IS 'Individual equipment lines within a quote request';

-- ── CONTACT MESSAGES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
    id          SERIAL          PRIMARY KEY,
    name        VARCHAR(150)    NOT NULL,
    email       VARCHAR(150)    NOT NULL,
    phone       VARCHAR(30),
    subject     VARCHAR(200),
    message     TEXT            NOT NULL,
    is_read     BOOLEAN         DEFAULT FALSE,
    created_at  TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE contact_messages IS 'Inbound messages from the Contact Us form';


-- =============================================================================
-- 2. INDEXES  (improve query performance)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured   ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock   ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_sku        ON products(sku);

CREATE INDEX IF NOT EXISTS idx_orders_user_id      ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at   ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_quotes_email        ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id      ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status       ON quotes(status);

CREATE INDEX IF NOT EXISTS idx_contact_is_read     ON contact_messages(is_read);


-- =============================================================================
-- 3. SEED DATA — Demo Users
--    Passwords are bcrypt hashes (cost factor 10):
--      admin@medithrex.co.ke  →  Admin@2024
--      jane@hospital.co.ke    →  User@2024
-- =============================================================================

INSERT INTO users (name, email, phone, company, password, role)
VALUES
    (
        'Admin Medithrex',
        'admin@medithrex.co.ke',
        '0790080903',
        'Medithrex Medical Solutions',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- placeholder hash
        'admin'
    ),
    (
        'Jane Wanjiru',
        'jane@hospital.co.ke',
        '0712345678',
        'Kenyatta National Hospital',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- placeholder hash
        'user'
    )
ON CONFLICT (email) DO NOTHING;

-- NOTE: The hashes above are placeholders. For correct password hashing run:
--   npm run db:seed
-- This will insert properly hashed passwords using bcrypt with your local Node.js.
-- Alternatively, generate hashes with: node -e "const b=require('bcryptjs');b.hash('Admin@2024',10).then(console.log)"


-- =============================================================================
-- 4. SEED DATA — 12 Demo Products
-- =============================================================================

INSERT INTO products
    (name, sku, description, short_description, category, price, price_on_request,
     images, brand, origin, in_stock, featured, tags, specifications)
VALUES

-- 1. X-Ray
(
    'Digital X-Ray System DR-3000',
    'MTX-IMG-001',
    'High-resolution digital radiography system with advanced image processing, wireless detector, and DICOM compatibility. Ideal for hospitals and diagnostic centers.',
    'Advanced DR system with wireless detector',
    'Imaging Equipment',
    2850000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600'],
    'Philips',
    'Netherlands',
    TRUE,
    TRUE,
    ARRAY['xray','imaging','diagnostic'],
    '[{"key":"Detector Size","value":"43x43 cm"},{"key":"Resolution","value":"3.1 lp/mm"},{"key":"Power","value":"380V/50Hz"}]'
),

-- 2. Hematology Analyzer
(
    'Automated Hematology Analyzer BC-6800',
    'MTX-LAB-001',
    'Full 5-part differential hematology analyzer with 60 samples/hour throughput. Features advanced algorithms for reliable CBC with differential results.',
    '5-part differential, 60 samples/hour',
    'Laboratory Equipment',
    485000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600'],
    'Mindray',
    'China',
    TRUE,
    TRUE,
    ARRAY['hematology','CBC','blood count'],
    '[{"key":"Throughput","value":"60 samples/hr"},{"key":"Parameters","value":"29 parameters"},{"key":"Sample Volume","value":"9.9µL"}]'
),

-- 3. ICU Monitor
(
    'ICU Patient Monitor PM-9000',
    'MTX-MON-001',
    'Comprehensive bedside monitor for ICU and critical care. Monitors ECG, SpO2, NIBP, temperature, and CO2 with 15" touchscreen display and central station connectivity.',
    'Multi-parameter ICU monitor, 15" touch',
    'Patient Monitoring',
    320000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600'],
    'GE Healthcare',
    'USA',
    TRUE,
    TRUE,
    ARRAY['ICU','monitoring','critical care'],
    '[{"key":"Display","value":"15\" color touchscreen"},{"key":"Parameters","value":"ECG, SpO2, NIBP, Temp, CO2"},{"key":"Battery","value":"4 hours backup"}]'
),

-- 4. Laparoscopic Tower (Price on Request)
(
    'Laparoscopic Surgery Tower',
    'MTX-SRG-001',
    'Complete HD laparoscopic surgery system including 10mm 0° and 30° telescopes, full HD camera, LED light source, insufflator, and 27" HD monitor. Ready-to-use surgical package.',
    'Complete HD laparoscopy package',
    'Surgical Instruments',
    NULL,
    TRUE,
    ARRAY['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600'],
    'Karl Storz',
    'Germany',
    TRUE,
    TRUE,
    ARRAY['laparoscopy','surgery','HD'],
    '[{"key":"Camera","value":"Full HD 1080p"},{"key":"Light Source","value":"LED 300W"},{"key":"Monitor","value":"27\" HD Medical Grade"}]'
),

-- 5. Ultrasound
(
    'Ultrasound System DC-70',
    'MTX-IMG-002',
    'Premium color Doppler ultrasound with 21.5" LED monitor. Supports abdominal, cardiac, obstetric, and vascular applications with excellent image clarity.',
    'Premium color Doppler, multi-application',
    'Imaging Equipment',
    1250000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600'],
    'Mindray',
    'China',
    TRUE,
    FALSE,
    ARRAY['ultrasound','doppler','imaging'],
    '[{"key":"Monitor","value":"21.5\" LED"},{"key":"Probes","value":"Convex, Linear, Phased"},{"key":"Storage","value":"500GB HDD"}]'
),

-- 6. Biochemistry Analyzer
(
    'Biochemistry Analyzer BS-200E',
    'MTX-LAB-002',
    'Fully automated random access biochemistry analyzer. 200 tests per hour with 45-position onboard reagent capacity. Ideal for medium to large volume labs.',
    'Fully automated, 200 tests/hour',
    'Laboratory Equipment',
    680000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600'],
    'Mindray',
    'China',
    TRUE,
    FALSE,
    ARRAY['biochemistry','clinical chemistry','analyzer'],
    '[{"key":"Throughput","value":"200 tests/hr"},{"key":"Sample Types","value":"Serum, plasma, urine"},{"key":"Reagent Positions","value":"45 onboard"}]'
),

-- 7. Defibrillator
(
    'Defibrillator BeneHeart D6',
    'MTX-MON-002',
    'Biphasic defibrillator with AED, pacing, and monitoring functions. Large 7.5" display, rechargeable battery, and comprehensive cardiac monitoring capabilities.',
    'Biphasic defib with AED & pacing',
    'Patient Monitoring',
    185000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600'],
    'Mindray',
    'China',
    TRUE,
    FALSE,
    ARRAY['defibrillator','AED','cardiac'],
    '[{"key":"Energy","value":"1-360 Joules"},{"key":"Display","value":"7.5\" color LCD"},{"key":"Battery","value":"3 hours operation"}]'
),

-- 8. Dental Unit (Out of stock)
(
    'Dental Unit CEFLA C-PLEX',
    'MTX-DEN-001',
    'Modern dental treatment unit with LED operating light, integrated scaler, air rotor, micromotor, and three-way syringe. Ergonomic design for both dentist and patient comfort.',
    'Full dental unit with LED light',
    'Dental Equipment',
    420000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1609207807107-e8e3fb78f4d3?w=600'],
    'CEFLA',
    'Italy',
    FALSE,
    FALSE,
    ARRAY['dental','dentistry','treatment unit'],
    '[{"key":"Light","value":"LED 30,000 lux"},{"key":"Chair","value":"Electric 4-movement"},{"key":"Water Bottle","value":"750ml"}]'
),

-- 9. Surgical Suction
(
    'Surgical Suction Unit',
    'MTX-SRG-002',
    'High-performance surgical suction machine for operating theatres and ICUs. Dual jar system, adjustable vacuum, portable design with silent motor operation.',
    'Dual jar, high-performance suction',
    'Surgical Instruments',
    45000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600'],
    'Medela',
    'Switzerland',
    TRUE,
    FALSE,
    ARRAY['suction','surgical','theatre'],
    '[{"key":"Vacuum","value":"-0.08 MPa max"},{"key":"Jar Capacity","value":"2x 1000ml"},{"key":"Noise Level","value":"<60dB"}]'
),

-- 10. PCR Machine (Price on Request)
(
    'PCR Thermocycler GeneAmp 9700',
    'MTX-LAB-003',
    'Fast and reliable PCR thermocycler with 96-well block, gradient function, and PC connectivity. Essential for molecular diagnostics, research, and infectious disease testing.',
    '96-well PCR with gradient & PC link',
    'Laboratory Equipment',
    NULL,
    TRUE,
    ARRAY['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600'],
    'Applied Biosystems',
    'USA',
    TRUE,
    FALSE,
    ARRAY['PCR','molecular','diagnostics'],
    '[{"key":"Well Plate","value":"96-well standard"},{"key":"Ramp Rate","value":"3.3°C/sec"},{"key":"Temp Range","value":"0-100°C"}]'
),

-- 11. Hospital Bed
(
    'Hospital Bed with Mattress',
    'MTX-GEN-001',
    'Electric 3-function hospital bed with ABS side rails, central locking castors, IV pole socket, and premium anti-decubitus mattress. Ideal for wards and private rooms.',
    'Electric 3-function bed + mattress',
    'Rehabilitation Equipment',
    95000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600'],
    'Linet',
    'Czech Republic',
    TRUE,
    FALSE,
    ARRAY['hospital bed','ward','electric'],
    '[{"key":"Functions","value":"3 electric motors"},{"key":"Load Capacity","value":"250kg"},{"key":"Dimensions","value":"2100x900mm"}]'
),

-- 12. Autoclave
(
    'Autoclave Steam Sterilizer 23L',
    'MTX-CON-001',
    'Benchtop pre-vacuum autoclave for sterilizing wrapped and unwrapped instruments. 23-liter chamber, multiple sterilization cycles, and digital display for complete control.',
    'Pre-vacuum benchtop autoclave, 23L',
    'Consumables & Supplies',
    75000.00,
    FALSE,
    ARRAY['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600'],
    'Tuttnauer',
    'Israel',
    TRUE,
    FALSE,
    ARRAY['autoclave','sterilizer','infection control'],
    '[{"key":"Chamber Volume","value":"23 Liters"},{"key":"Temperature","value":"121/134°C"},{"key":"Cycles","value":"3 standard + custom"}]'
)

ON CONFLICT (sku) DO NOTHING;


-- =============================================================================
-- 5. VERIFICATION QUERIES  (run these to confirm everything loaded correctly)
-- =============================================================================

-- Check table row counts
SELECT
    'users'            AS table_name, COUNT(*) AS rows FROM users            UNION ALL
SELECT 'products',                                     COUNT(*) FROM products UNION ALL
SELECT 'orders',                                       COUNT(*) FROM orders   UNION ALL
SELECT 'order_items',                                  COUNT(*) FROM order_items UNION ALL
SELECT 'quotes',                                       COUNT(*) FROM quotes   UNION ALL
SELECT 'quote_items',                                  COUNT(*) FROM quote_items UNION ALL
SELECT 'contact_messages',                             COUNT(*) FROM contact_messages
ORDER BY table_name;

-- Show all products
-- SELECT id, sku, name, category, price, price_on_request, in_stock, featured FROM products ORDER BY id;

-- Show all users (without password)
-- SELECT id, name, email, role, created_at FROM users;


-- =============================================================================
-- 6. USEFUL ADMIN QUERIES (reference)
-- =============================================================================

-- View all orders with customer name
-- SELECT o.order_number, u.name, u.email, o.total_amount, o.status, o.payment_status, o.created_at
-- FROM orders o LEFT JOIN users u ON o.user_id = u.id
-- ORDER BY o.created_at DESC;

-- View all quote requests
-- SELECT q.quote_number, q.name, q.email, q.company, q.status, q.created_at
-- FROM quotes q ORDER BY q.created_at DESC;

-- Products by category count
-- SELECT category, COUNT(*) AS total, SUM(CASE WHEN in_stock THEN 1 ELSE 0 END) AS in_stock
-- FROM products GROUP BY category ORDER BY total DESC;

-- Update order status (example)
-- UPDATE orders SET status = 'Confirmed' WHERE order_number = 'MTX-12345678';

-- Update quote status and add quoted price (example)
-- UPDATE quotes SET status = 'Quoted', quoted_price = 485000 WHERE quote_number = 'QT-12345678';

-- Mark contact message as read
-- UPDATE contact_messages SET is_read = TRUE WHERE id = 1;


-- =============================================================================
-- END OF MEDITHREX DATABASE SCRIPT
-- =============================================================================
