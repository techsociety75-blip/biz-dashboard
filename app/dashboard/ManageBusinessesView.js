'use client';

import { useState } from 'react';
import { ICON_CHOICES, ACCENT_CHOICES } from '../../lib/constants';
import { Icon } from '../../lib/Icon';

export default function ManageBusinessesView({ businesses, onChanged }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  return (
    <div>
      <div
        className="fade-up"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15.5, fontFamily: 'var(--font-display)' }}>Your businesses</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-dim)', marginTop: 3 }}>
            Add a new business, or click any existing one to rename it or change its color and icon.
          </div>
        </div>
        {!adding && (
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            <Icon name="plus" size={13} />
            <span style={{ marginLeft: 6 }}>Add business</span>
          </button>
        )}
      </div>

      {adding && (
        <BusinessForm
          mode="create"
          onCancel={() => setAdding(false)}
          onSaved={async () => {
            setAdding(false);
            await onChanged();
          }}
        />
      )}

      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {businesses.map((b, i) =>
          editingId === b.id ? (
            <div
              key={b.id}
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)', padding: '16px 18px', background: 'var(--bg-row)' }}
            >
              <BusinessForm
                mode="edit"
                business={b}
                onCancel={() => setEditingId(null)}
                onSaved={async () => {
                  setEditingId(null);
                  await onChanged();
                }}
                onDeleted={async () => {
                  setEditingId(null);
                  await onChanged();
                }}
                canDelete={businesses.length > 1}
              />
            </div>
          ) : (
            <div
              key={b.id}
              className="row-in"
              style={{
                animationDelay: i * 0.04 + 's',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                background: 'var(--bg-row)',
                cursor: 'pointer'
              }}
              onClick={() => setEditingId(b.id)}
              onMouseEnter={(ev) => (ev.currentTarget.style.background = 'var(--bg-row-hover)')}
              onMouseLeave={(ev) => (ev.currentTarget.style.background = 'var(--bg-row)')}
            >
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
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>{b.tag || 'No tag'}</div>
              </div>
              <Icon name="settings" size={14} color="var(--ink-faint)" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

function BusinessForm({ mode, business, onCancel, onSaved, onDeleted, canDelete }) {
  const [name, setName] = useState(business ? business.name : '');
  const [tag, setTag] = useState(business ? business.tag : '');
  const [icon, setIcon] = useState(business ? business.icon : ICON_CHOICES[0]);
  const [colorIdx, setColorIdx] = useState(() => {
    if (!business) return 0;
    const idx = ACCENT_CHOICES.findIndex((c) => c.accent === business.accent);
    return idx >= 0 ? idx : 0;
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const accent = ACCENT_CHOICES[colorIdx];

  async function handleSave() {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (mode === 'create') {
        const res = await fetch('/api/businesses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, tag, icon, accent: accent.accent, accentDim: accent.accentDim })
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Could not create business');
          setSaving(false);
          return;
        }
      } else {
        const res = await fetch('/api/businesses', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: business.id, name, tag, icon, accent: accent.accent, accentDim: accent.accentDim })
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Could not save changes');
          setSaving(false);
          return;
        }
      }
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch('/api/businesses?id=' + business.id, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Could not delete');
        setDeleting(false);
        return;
      }
      await onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fade-up"
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--line)',
        borderTop: `2px solid ${accent.accent}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        marginBottom: mode === 'create' ? 20 : 0,
        maxWidth: 560
      }}
    >
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <Label>Name</Label>
          <input
            type="text"
            placeholder="e.g. Coffee roastery"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%' }}
            autoFocus={mode === 'create'}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Label>Tag / category</Label>
          <input
            type="text"
            placeholder="e.g. Retail · Online"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <Label>Icon</Label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {ICON_CHOICES.map((ic) => (
          <button
            key={ic}
            onClick={() => setIcon(ic)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: icon === ic ? `1px solid ${accent.accent}` : '1px solid var(--line)',
              background: icon === ic ? accent.accentDim : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={ic}
          >
            <Icon name={ic} size={15} color={icon === ic ? accent.accent : 'var(--ink-dim)'} />
          </button>
        ))}
      </div>

      <Label>Color</Label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {ACCENT_CHOICES.map((c, idx) => (
          <button
            key={c.accent}
            onClick={() => setColorIdx(idx)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: colorIdx === idx ? '2px solid var(--ink)' : '2px solid transparent',
              background: c.accent,
              padding: 0
            }}
            aria-label={c.accent}
          />
        ))}
      </div>

      {error && <p style={{ fontSize: 12.5, color: 'var(--bad)', margin: '0 0 12px' }}>{error}</p>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {mode === 'edit' && canDelete && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ background: 'none', border: 'none', color: 'var(--bad)', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Icon name="trash" size={13} />
              Delete business
            </button>
          )}
          {mode === 'edit' && confirmDelete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12.5, color: 'var(--bad)' }}>Delete and erase all its history?</span>
              <button className="btn" style={{ fontSize: 12, padding: '5px 10px', borderColor: 'var(--bad)', color: 'var(--bad)' }} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button className="btn" style={{ fontSize: 12, padding: '5px 10px' }} onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Icon name="check" size={13} />
            <span style={{ marginLeft: 5 }}>{saving ? 'Saving…' : mode === 'create' ? 'Add business' : 'Save changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        fontSize: 11.5,
        color: 'var(--ink-faint)',
        marginBottom: 6,
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}
    >
      {children}
    </label>
  );
}
