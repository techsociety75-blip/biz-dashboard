import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.POSTGRES_URL && process.env.POSTGRES_URL.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined
    });
  }
  return pool;
}

let initialized = false;

const DEFAULT_BUSINESSES = [
  { id: 'dairy', name: 'Dairy farm', tag: 'Agriculture', icon: 'milk', accent: '#D9C9A3', accent_dim: '#3a3528', sort_order: 0 },
  { id: 'foodapp', name: 'Food app', tag: 'Consumer · Online', icon: 'utensils', accent: '#E8744A', accent_dim: '#3d2218', sort_order: 1 },
  { id: 'gsm', name: 'GSM gateway', tag: 'Telecom infra', icon: 'antenna', accent: '#5B8FE8', accent_dim: '#1a2638', sort_order: 2 },
  { id: 'flashbots', name: 'Flash bots', tag: 'Trading automation', icon: 'bot', accent: '#9B7FE8', accent_dim: '#28223d', sort_order: 3 },
  { id: 'itservices', name: 'IT services', tag: 'B2B services', icon: 'server', accent: '#5BAFA0', accent_dim: '#1a3530', sort_order: 4 }
];

export async function ensureSchema() {
  if (initialized) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      business_id TEXT NOT NULL,
      entry_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'on_track',
      revenue NUMERIC NOT NULL DEFAULT 0,
      spent NUMERIC NOT NULL DEFAULT 0,
      tasks TEXT NOT NULL DEFAULT '',
      issues TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(business_id, entry_date)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT 'building',
      accent TEXT NOT NULL DEFAULT '#9b9888',
      accent_dim TEXT NOT NULL DEFAULT '#2a2a22',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const existing = await pool.query('SELECT COUNT(*) FROM businesses');
  if (Number(existing.rows[0].count) === 0) {
    for (const b of DEFAULT_BUSINESSES) {
      await pool.query(
        `INSERT INTO businesses (id, name, tag, icon, accent, accent_dim, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [b.id, b.name, b.tag, b.icon, b.accent, b.accent_dim, b.sort_order]
      );
    }
  }

  initialized = true;
}
