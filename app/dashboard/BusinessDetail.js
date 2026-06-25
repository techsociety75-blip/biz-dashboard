'use client';

import { useEffect, useState } from 'react';
import { STATUS_OPTIONS } from '../../lib/constants';
import { Icon } from '../../lib/Icon';

export default function BusinessDetail({ business, date, entry, onBack, onSave }) {
  const biz = business;
  const [form, setForm] = useState({
    status: 'on_track',
    revenue: '',
    spent: '',
    tasks: '',
    issues: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (entry) {
      setForm({
        status: entry.status || 'on_track',
        revenue: entry.revenue || '',
        spent: entry.spent || '',
        tasks: entry.tasks || '',
        issues: entry.issues || '',
        notes: entry.notes || ''
      });
      setSavedAt(entry.updatedAt || null);
    }
  }, [entry]);

  const dateObj = new Date(date + 'T00:00:00');
  const dateLabel = dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  async function handleSave() {
    setSaving(true);
    await onSave(biz.id, form);
    setSavedAt(new Date().toISOString());
    setSaving(false);
  }

  return (
    <div>
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button className="btn-icon" aria-label="Back to dashboard" onClick={onBack}>
          <Icon name="arrow-left" size={15} />
        </button>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: biz.accentDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name={biz.icon} size={18} color={biz.accent} />
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display)' }}>{biz.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{dateLabel}</div>
        </div>
      </div>

      <div
        className="fade-up"
        style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--line)',
          borderTop: `2px solid ${biz.accent}`,
          borderRadius: 'var(--radius-lg)',
          padding: '22px 24px',
          maxWidth: 560
        }}
      >
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: '100%' }}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label="Revenue today">
              <input
                type="number"
                step="0.01"
                placeholder="0"
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                className="mono"
                style={{ width: '100%' }}
              />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Spent today">
              <input
                type="number"
                step="0.01"
                placeholder="0"
                value={form.spent}
                onChange={(e) => setForm({ ...form, spent: e.target.value })}
                className="mono"
                style={{ width: '100%' }}
              />
            </Field>
          </div>
        </div>

        <Field label="Top tasks / priorities">
          <textarea
            rows={3}
            placeholder="One per line"
            value={form.tasks}
            onChange={(e) => setForm({ ...form, tasks: e.target.value })}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </Field>

        <Field label="Issues / blockers">
          <textarea
            rows={2}
            placeholder="Anything urgent or blocking?"
            value={form.issues}
            onChange={(e) => setForm({ ...form, issues: e.target.value })}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </Field>

        <Field label="Notes">
          <textarea
            rows={2}
            placeholder="Anything else worth remembering"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </Field>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            {saving
              ? 'Saving…'
              : savedAt
              ? 'Last saved ' + new Date(savedAt).toLocaleTimeString()
              : 'Not saved yet'}
          </span>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Icon name="check" size={13} />
            <span style={{ marginLeft: 5 }}>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
