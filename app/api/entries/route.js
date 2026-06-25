import { getPool, ensureSchema } from '../../../lib/db';

export async function GET(request) {
  await ensureSchema();
  const pool = getPool();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const month = searchParams.get('month');

  const bizResult = await pool.query('SELECT id FROM businesses ORDER BY sort_order ASC');
  const businessIds = bizResult.rows.map((r) => r.id);

  if (date) {
    const result = await pool.query(
      'SELECT business_id, status, revenue, spent, tasks, issues, notes, updated_at FROM entries WHERE entry_date = $1',
      [date]
    );
    const byBusiness = {};
    for (const id of businessIds) {
      byBusiness[id] = {
        status: 'on_track',
        revenue: '',
        spent: '',
        tasks: '',
        issues: '',
        notes: '',
        updatedAt: null
      };
    }
    for (const row of result.rows) {
      if (byBusiness[row.business_id] === undefined) continue;
      byBusiness[row.business_id] = {
        status: row.status,
        revenue: row.revenue !== null ? String(row.revenue) : '',
        spent: row.spent !== null ? String(row.spent) : '',
        tasks: row.tasks || '',
        issues: row.issues || '',
        notes: row.notes || '',
        updatedAt: row.updated_at
      };
    }
    return Response.json({ entries: byBusiness });
  }

  if (month) {
    const result = await pool.query(
      `SELECT business_id,
              COALESCE(SUM(revenue),0) AS total_revenue,
              COALESCE(SUM(spent),0) AS total_spent,
              COUNT(*) AS days_logged
       FROM entries
       WHERE to_char(entry_date, 'YYYY-MM') = $1
       GROUP BY business_id`,
      [month]
    );
    const byBusiness = {};
    for (const id of businessIds) {
      byBusiness[id] = { revenue: 0, spent: 0, days: 0 };
    }
    for (const row of result.rows) {
      if (byBusiness[row.business_id] === undefined) continue;
      byBusiness[row.business_id] = {
        revenue: Number(row.total_revenue),
        spent: Number(row.total_spent),
        days: Number(row.days_logged)
      };
    }
    return Response.json({ month: byBusiness });
  }

  return Response.json({ error: 'date or month query param required' }, { status: 400 });
}

export async function POST(request) {
  await ensureSchema();
  const pool = getPool();
  const body = await request.json();
  const { businessId, date, status, revenue, spent, tasks, issues, notes } = body;

  if (!businessId || !date) {
    return Response.json({ error: 'businessId and date are required' }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO entries (business_id, entry_date, status, revenue, spent, tasks, issues, notes, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
     ON CONFLICT (business_id, entry_date)
     DO UPDATE SET status = $3, revenue = $4, spent = $5, tasks = $6, issues = $7, notes = $8, updated_at = now()
     RETURNING updated_at`,
    [
      businessId,
      date,
      status || 'on_track',
      parseFloat(revenue) || 0,
      parseFloat(spent) || 0,
      tasks || '',
      issues || '',
      notes || ''
    ]
  );

  return Response.json({ ok: true, updatedAt: result.rows[0].updated_at });
}
