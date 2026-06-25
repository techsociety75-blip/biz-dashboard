'use client';

import { getStatus } from '../../lib/constants';
import { Icon } from '../../lib/Icon';

function fmtMoney(n) {
  n = Number(n) || 0;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function DailyView({
  date,
  businesses,
  businessesLoaded,
  entries,
  loading,
  showReminderBanner,
  onDismissReminder,
  onPrevDay,
  onNextDay,
  onToday,
  onSelectBusiness
}) {
  const dateObj = new Date(date + 'T00:00:00');
  const dateLabel = dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  let counts = { on_track: 0, attention: 0, urgent: 0 };
  let totalRevenue = 0;
  let totalSpent = 0;

  if (entries) {
    businesses.forEach((b) => {
      const e = entries[b.id];
      if (e) {
        counts[e.status] = (counts[e.status] || 0) + 1;
        totalRevenue += parseFloat(e.revenue) || 0;
        totalSpent += parseFloat(e.spent) || 0;
      }
    });
  }
  const profit = totalRevenue - totalSpent;

  return (
    <div>
      {showReminderBanner && (
        <div
          className="fade-up"
          style={{
            background: 'var(--warn-bg)',
            border: '1px solid rgba(217,164,65,0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '13px 16px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 11
          }}
        >
          <Icon name="bell" size={16} color="var(--warn)" />
          <div style={{ flex: 1, fontSize: 13 }}>
            Reminder day — log revenue and spend for every business today.
          </div>
          <button className="btn" style={{ fontSize: 12, padding: '5px 10px' }} onClick={onDismissReminder}>
            Dismiss
          </button>
        </div>
      )}

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
          <button className="btn-icon" aria-label="Previous day" onClick={onPrevDay}>
            <Icon name="chevron-left" size={15} />
          </button>
          <span style={{ fontSize: 14.5, fontWeight: 600, minWidth: 168, textAlign: 'center' }}>{dateLabel}</span>
          <button className="btn-icon" aria-label="Next day" onClick={onNextDay}>
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
        <button className="btn" onClick={onToday}>
          Today
        </button>
      </div>

      <div className="fade-up" style={{ display: 'flex', gap: 1, marginBottom: 28, flexWrap: 'wrap' }}>
        <Stat label="Revenue" value={fmtMoney(totalRevenue)} first />
        <Stat label="Spent" value={fmtMoney(totalSpent)} />
        <Stat label="Profit" value={fmtMoney(profit)} color={profit >= 0 ? 'var(--good)' : 'var(--bad)'} />
        <Stat label="On track" value={counts.on_track} color="var(--good)" />
        <Stat label="Attention" value={counts.attention} color="var(--warn)" />
        <Stat label="Urgent" value={counts.urgent} color="var(--bad)" last />
      </div>

      {businessesLoaded && businesses.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          {businesses.map((b, i) => {
            const e = entries ? entries[b.id] : null;
            const si = getStatus(e ? e.status : 'on_track');
            const tasksPreview = e && e.tasks ? e.tasks.split('\n')[0].slice(0, 60) : 'No tasks logged';
            const revenue = e ? parseFloat(e.revenue) || 0 : 0;
            const spent = e ? parseFloat(e.spent) || 0 : 0;
            const rowProfit = revenue - spent;
            const isUrgent = e && e.status === 'urgent';

            return (
              <div
                key={b.id}
                className="row-in"
                style={{
                  animationDelay: i * 0.05 + 's',
                  display: 'flex',
                  alignItems: 'stretch',
                  cursor: 'pointer',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  background: 'var(--bg-row)'
                }}
                onClick={() => onSelectBusiness(b.id)}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = 'var(--bg-row-hover)')}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = 'var(--bg-row)')}
              >
                <div style={{ width: 4, background: b.accent, flexShrink: 0 }} />
                <div
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 190 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: b.accentDim,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon name={b.icon} size={16} color={b.accent} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>{b.tag}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 96 }}>
                    <span
                      className={isUrgent ? 'throb' : ''}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: si.color, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12.5, color: 'var(--ink-dim)' }}>{si.label}</span>
                  </div>

                  <div className="mono" style={{ display: 'flex', gap: 18, minWidth: 220, fontSize: 13 }}>
                    <span style={{ color: 'var(--good)' }}>+{fmtMoney(revenue)}</span>
                    <span style={{ color: 'var(--bad)' }}>−{fmtMoney(spent)}</span>
                    <span style={{ color: rowProfit >= 0 ? 'var(--good)' : 'var(--bad)', fontWeight: 600 }}>
                      {rowProfit >= 0 ? '+' : ''}
                      {fmtMoney(rowProfit)}
                    </span>
                  </div>

                  <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-dim)', minWidth: 140 }}>
                    {e && e.issues ? (
                      <span style={{ color: 'var(--bad)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="alert" size={12} /> {e.issues.split('\n')[0].slice(0, 40)}
                      </span>
                    ) : (
                      tasksPreview
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        border: '1px dashed var(--line-strong)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 24px',
        textAlign: 'center',
        color: 'var(--ink-dim)'
      }}
    >
      <div style={{ fontSize: 14, marginBottom: 6 }}>No businesses yet</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>Go to the Manage tab to add your first one.</div>
    </div>
  );
}

function Stat({ label, value, color, first, last }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 100,
        padding: '12px 16px',
        background: 'var(--bg-raised)',
        borderRadius: first ? 'var(--radius-md) 0 0 var(--radius-md)' : last ? '0 var(--radius-md) var(--radius-md) 0' : 0,
        borderLeft: first ? '1px solid var(--line)' : 'none',
        borderRight: '1px solid var(--line)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)'
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: 17, fontWeight: 600, color: color || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
