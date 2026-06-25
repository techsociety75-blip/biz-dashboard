'use client';

import { useState } from 'react';
import { Icon } from '../../lib/Icon';

function fmtMoney(n) {
  n = Number(n) || 0;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function daysInMonth(monthStr) {
  const [y, m] = monthStr.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export default function MonthlyView({ month, businesses, monthData, loading, onPrevMonth, onNextMonth }) {
  const [reportLoading, setReportLoading] = useState(false);

  const [y, m] = month.split('-').map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const dim = daysInMonth(month);

  let totalRev = 0;
  let totalSpent = 0;
  if (monthData) {
    businesses.forEach((b) => {
      const d = monthData[b.id] || { revenue: 0, spent: 0 };
      totalRev += d.revenue;
      totalSpent += d.spent;
    });
  }
  const totalProfit = totalRev - totalSpent;

  const maxVal = monthData
    ? Math.max(1, ...businesses.map((b) => Math.max((monthData[b.id] || {}).revenue || 0, (monthData[b.id] || {}).spent || 0)))
    : 1;

  async function handleFinalReport() {
    setReportLoading(true);
    const res = await fetch('/api/report?month=' + month);
    const data = await res.json();
    setReportLoading(false);
    downloadReport(data, monthLabel);
  }

  function downloadReport(data, label) {
    const lines = [];
    lines.push('Month-end report - ' + label);
    lines.push('');
    lines.push('Business, Revenue, Spent, Profit, Days logged');
    data.perBusiness.forEach((b) => {
      lines.push([b.name, fmtMoney(b.revenue), fmtMoney(b.spent), fmtMoney(b.profit), b.daysLogged].join(', '));
    });
    lines.push('');
    lines.push(['Total', fmtMoney(data.totals.revenue), fmtMoney(data.totals.spent), fmtMoney(data.totals.profit), ''].join(', '));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report-' + month + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div
        className="fade-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 22,
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-icon" aria-label="Previous month" onClick={onPrevMonth}>
            <Icon name="chevron-left" size={15} />
          </button>
          <span style={{ fontSize: 15.5, fontWeight: 600, minWidth: 168, textAlign: 'center' }}>{monthLabel}</span>
          <button className="btn-icon" aria-label="Next month" onClick={onNextMonth}>
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
        {dim >= 30 && (
          <button className="btn" onClick={handleFinalReport} disabled={reportLoading}>
            <Icon name="file" size={13} />
            <span style={{ marginLeft: 6 }}>{reportLoading ? 'Building report…' : 'Download final report'}</span>
          </button>
        )}
      </div>

      <div className="fade-up" style={{ display: 'flex', gap: 1, marginBottom: 30, flexWrap: 'wrap' }}>
        <Stat label="Total revenue" value={fmtMoney(totalRev)} first />
        <Stat label="Total spent" value={fmtMoney(totalSpent)} />
        <Stat label="Total profit" value={fmtMoney(totalProfit)} color={totalProfit >= 0 ? 'var(--good)' : 'var(--bad)'} last />
      </div>

      <div className="fade-up" style={{ marginBottom: 32 }}>
        {businesses.map((b, i) => {
          const t = (monthData && monthData[b.id]) || { revenue: 0, spent: 0, days: 0 };
          const revWidth = (t.revenue / maxVal) * 100;
          const spendWidth = (t.spent / maxVal) * 100;
          const profit = t.revenue - t.spent;
          return (
            <div key={b.id} style={{ marginBottom: 18, animationDelay: i * 0.05 + 's' }} className="row-in">
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name={b.icon} size={14} color={b.accent} />
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{b.name}</span>
                </div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: profit >= 0 ? 'var(--good)' : 'var(--bad)' }}>
                  {profit >= 0 ? '+' : ''}
                  {fmtMoney(profit)}
                </span>
              </div>
              <BarRow widthPct={revWidth} color={b.accent} value={t.revenue} dim />
              <BarRow widthPct={spendWidth} color="var(--bad)" value={t.spent} />
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>
                {t.days} of {dim} days logged
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        {businesses.map((b, i) => {
          const t = (monthData && monthData[b.id]) || { revenue: 0, spent: 0, days: 0 };
          const profit = t.revenue - t.spent;
          return (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '13px 18px',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                background: 'var(--bg-row)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ width: 3, height: 22, background: b.accent, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: 600, minWidth: 130 }}>{b.name}</span>
              <div className="mono" style={{ display: 'flex', gap: 16, fontSize: 12.5, flex: 1 }}>
                <span style={{ color: 'var(--ink-dim)' }}>rev {fmtMoney(t.revenue)}</span>
                <span style={{ color: 'var(--ink-dim)' }}>spent {fmtMoney(t.spent)}</span>
                <span style={{ color: profit >= 0 ? 'var(--good)' : 'var(--bad)', fontWeight: 600 }}>
                  profit {profit >= 0 ? '+' : ''}
                  {fmtMoney(profit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarRow({ widthPct, color, value, dim }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--bg-raised)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            width: Math.max(1.5, widthPct) + '%',
            height: '100%',
            background: color,
            opacity: dim ? 0.9 : 0.75,
            borderRadius: 3,
            transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, color, first, last }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 140,
        padding: '14px 18px',
        background: 'var(--bg-raised)',
        borderRadius: first ? 'var(--radius-md) 0 0 var(--radius-md)' : last ? '0 var(--radius-md) var(--radius-md) 0' : 0,
        borderLeft: first ? '1px solid var(--line)' : 'none',
        borderRight: '1px solid var(--line)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)'
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: color || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
