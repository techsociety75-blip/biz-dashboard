'use client';

import { useState } from 'react';
import { Icon } from '../../lib/Icon';

export default function RemindersView({ reminderDays, onSaved }) {
  const [selected, setSelected] = useState(reminderDays);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  function toggleDay(d) {
    setSelected((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: selected })
    });
    const data = await res.json();
    setSaving(false);
    setSavedFlash(true);
    onSaved(data.days);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  return (
    <div
      className="fade-up"
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 26px',
        maxWidth: 620
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
        Reminder dates
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-dim)', marginBottom: 20, lineHeight: 1.5 }}>
        Pick the day(s) of the month you want a revenue and spend reminder banner when you open the dashboard.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, maxWidth: 380, marginBottom: 22 }}>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const isSelected = selected.includes(d);
          return (
            <button
              key={d}
              onClick={() => toggleDay(d)}
              className="mono"
              style={{
                aspectRatio: '1',
                fontSize: 12.5,
                borderRadius: 6,
                border: isSelected ? '1px solid var(--ink)' : '1px solid var(--line)',
                background: isSelected ? 'var(--ink)' : 'transparent',
                color: isSelected ? 'var(--bg)' : 'var(--ink-dim)',
                transition: 'background 0.12s, border-color 0.12s'
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        <Icon name="check" size={13} />
        <span style={{ marginLeft: 6 }}>{saving ? 'Saving…' : savedFlash ? 'Saved' : 'Save reminder dates'}</span>
      </button>
      <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 14, lineHeight: 1.5 }}>
        This dashboard shows a reminder banner when you open it on or after the chosen date(s). It cannot send push
        notifications or texts when the app is closed.
      </div>
    </div>
  );
}
