import { getPool, ensureSchema } from '../../../lib/db';

export async function GET(request) {
  await ensureSchema();
  const pool = getPool();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month) {
    return Response.json({ error: 'month query param required, format YYYY-MM' }, { status: 400 });
  }

  const bizResult = await pool.query('SELECT id, name FROM businesses ORDER BY sort_order ASC');

  const result = await pool.query(
    `SELECT business_id,
            COALESCE(SUM(revenue),0) AS total_revenue,
            COALESCE(SUM(spent),0) AS total_spent,
            COUNT(*) AS days_logged,
            MIN(entry_date) AS first_entry,
            MAX(entry_date) AS last_entry
     FROM entries
     WHERE to_char(entry_date, 'YYYY-MM') = $1
     GROUP BY business_id`,
    [month]
  );

  const perBusiness = bizResult.rows.map((biz) => {
    const row = result.rows.find((r) => r.business_id === biz.id);
    const revenue = row ? Number(row.total_revenue) : 0;
    const spent = row ? Number(row.total_spent) : 0;
    return {
      id: biz.id,
      name: biz.name,
      revenue,
      spent,
      profit: revenue - spent,
      daysLogged: row ? Number(row.days_logged) : 0
    };
  });

  const totals = perBusiness.reduce(
    (acc, b) => ({
      revenue: acc.revenue + b.revenue,
      spent: acc.spent + b.spent,
      profit: acc.profit + b.profit
    }),
    { revenue: 0, spent: 0, profit: 0 }
  );

  return Response.json({ month, perBusiness, totals });
}
