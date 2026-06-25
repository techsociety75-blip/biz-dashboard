import { getPool, ensureSchema } from '../../../lib/db';

function slugify(name) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'biz'
  );
}

export async function GET() {
  await ensureSchema();
  const pool = getPool();
  const result = await pool.query('SELECT * FROM businesses ORDER BY sort_order ASC, created_at ASC');
  const businesses = result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    tag: r.tag,
    icon: r.icon,
    accent: r.accent,
    accentDim: r.accent_dim,
    sortOrder: r.sort_order
  }));
  return Response.json({ businesses });
}

export async function POST(request) {
  await ensureSchema();
  const pool = getPool();
  const body = await request.json();
  const { name, tag, icon, accent, accentDim } = body;

  if (!name || !name.trim()) {
    return Response.json({ error: 'Name is required' }, { status: 400 });
  }

  let baseId = slugify(name);
  let id = baseId;
  let suffix = 1;
  while (true) {
    const existing = await pool.query('SELECT id FROM businesses WHERE id = $1', [id]);
    if (existing.rows.length === 0) break;
    suffix += 1;
    id = baseId + '-' + suffix;
  }

  const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), -1) AS max FROM businesses');
  const sortOrder = Number(maxOrder.rows[0].max) + 1;

  await pool.query(
    `INSERT INTO businesses (id, name, tag, icon, accent, accent_dim, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, name.trim(), tag || '', icon || 'building', accent || '#9b9888', accentDim || '#2a2a22', sortOrder]
  );

  return Response.json({ ok: true, id });
}

export async function PATCH(request) {
  await ensureSchema();
  const pool = getPool();
  const body = await request.json();
  const { id, name, tag, icon, accent, accentDim } = body;

  if (!id) {
    return Response.json({ error: 'id is required' }, { status: 400 });
  }

  const fields = [];
  const values = [];
  let i = 1;

  if (name !== undefined) {
    fields.push(`name = $${i++}`);
    values.push(name.trim());
  }
  if (tag !== undefined) {
    fields.push(`tag = $${i++}`);
    values.push(tag);
  }
  if (icon !== undefined) {
    fields.push(`icon = $${i++}`);
    values.push(icon);
  }
  if (accent !== undefined) {
    fields.push(`accent = $${i++}`);
    values.push(accent);
  }
  if (accentDim !== undefined) {
    fields.push(`accent_dim = $${i++}`);
    values.push(accentDim);
  }

  if (fields.length === 0) {
    return Response.json({ error: 'Nothing to update' }, { status: 400 });
  }

  values.push(id);
  await pool.query(`UPDATE businesses SET ${fields.join(', ')} WHERE id = $${i}`, values);

  return Response.json({ ok: true });
}

export async function DELETE(request) {
  await ensureSchema();
  const pool = getPool();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'id is required' }, { status: 400 });
  }

  const count = await pool.query('SELECT COUNT(*) FROM businesses');
  if (Number(count.rows[0].count) <= 1) {
    return Response.json({ error: 'You need at least one business' }, { status: 400 });
  }

  await pool.query('DELETE FROM entries WHERE business_id = $1', [id]);
  await pool.query('DELETE FROM businesses WHERE id = $1', [id]);

  return Response.json({ ok: true });
}
