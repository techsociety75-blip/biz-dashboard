'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DECORATIVE_COLORS = ['#D9C9A3', '#E8744A', '#5B8FE8', '#9B7FE8', '#5BAFA0'];

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <form onSubmit={handleSubmit} className="fade-up" style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
          {DECORATIVE_COLORS.map((color) => (
            <span
              key={color}
              style={{
                width: 28,
                height: 4,
                borderRadius: 2,
                background: color,
                opacity: 0.85
              }}
            />
          ))}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: '0 0 6px'
          }}
        >
          Business ledger
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--ink-dim)', margin: '0 0 28px' }}>
          One daily record for every business you run. Enter your password to continue.
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 14, padding: '12px 14px', fontSize: 15 }}
          autoFocus
        />

        {error && (
          <p style={{ fontSize: 13, color: 'var(--bad)', margin: '0 0 14px' }}>{error}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '11px 0', fontSize: 14 }}
          disabled={loading}
        >
          {loading ? 'Checking…' : 'Unlock ledger'}
        </button>
      </form>
    </div>
  );
}
