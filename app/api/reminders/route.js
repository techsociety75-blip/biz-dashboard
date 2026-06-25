import { getPool, ensureSchema } from '../../../lib/db';

export async function GET() {
  await ensureSchema();
  const pool = getPool();
  const result = await pool.query('SELECT value FROM settings WHERE key = $1', ['reminder_days']);
  const days = result.rows.length ? result.rows[0].value.days : [1, 15];
  return Response.json({ days });
}

export async function POST(request) {
  await ensureSchema();
  const pool = getPool();
  const body = await request.json();
  const days = Array.isArray(body.days) ? body.days.filter((d) => d >= 1 && d <= 31) : [];

  await pool.query(
    `INSERT INTO settings (key, value) VALUES ('reminder_days', $1)
     ON CONFLICT (key) DO UPDATE SET value = $1`,
    [JSON.stringify({ days })]
  );

  return Response.json({ ok: true, days });
}
