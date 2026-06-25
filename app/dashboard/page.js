'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../../lib/Icon';
import DailyView from './DailyView';
import MonthlyView from './MonthlyView';
import RemindersView from './RemindersView';
import ManageBusinessesView from './ManageBusinessesView';
import BusinessDetail from './BusinessDetail';

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

const TABS = [
  { id: 'daily', label: 'Daily' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'reminders', label: 'Reminders' },
  { id: 'manage', label: 'Manage' }
];

export default function DashboardPage() {
  const router = useRouter();
  const [view, setView] = useState('daily');
  const [date, setDate] = useState(todayKey());
  const [month, setMonth] = useState(monthKey(todayKey()));
  const [activeBiz, setActiveBiz] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [businessesLoaded, setBusinessesLoaded] = useState(false);
  const [entries, setEntries] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [reminderDays, setReminderDays] = useState([1, 15]);
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBusinesses = useCallback(async () => {
    const res = await fetch('/api/businesses');
    const data = await res.json();
    setBusinesses(data.businesses || []);
    setBusinessesLoaded(true);
    return data.businesses || [];
  }, []);

  const loadDay = useCallback(async (d) => {
    setLoading(true);
    const res = await fetch('/api/entries?date=' + d);
    const data = await res.json();
    setEntries(data.entries);
    setLoading(false);
  }, []);

  const loadMonth = useCallback(async (m) => {
    setLoading(true);
    const res = await fetch('/api/entries?month=' + m);
    const data = await res.json();
    setMonthData(data.month);
    setLoading(false);
  }, []);

  const loadReminders = useCallback(async () => {
    const res = await fetch('/api/reminders');
    const data = await res.json();
    setReminderDays(data.days);
  }, []);

  useEffect(() => {
    loadBusinesses();
    loadDay(date);
    loadReminders();
  }, []);

  useEffect(() => {
    if (view === 'monthly') loadMonth(month);
  }, [view, month, loadMonth]);

  function changeDate(delta) {
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    const next = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    setDate(next);
    setReminderDismissed(false);
    loadDay(next);
  }

  function goToday() {
    const t = todayKey();
    setDate(t);
    setReminderDismissed(false);
    loadDay(t);
  }

  function changeMonth(delta) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const next = d.getFullYear() + '-' + pad(d.getMonth() + 1);
    setMonth(next);
  }

  async function handleSaveEntry(businessId, entry) {
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, date, ...entry })
    });
    await loadDay(date);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  async function handleBusinessesChanged() {
    await loadBusinesses();
    await loadDay(date);
  }

  const dayHasAllLogged =
    entries &&
    businesses.length > 0 &&
    businesses.every((b) => entries[b.id] && entries[b.id].revenue !== '' && entries[b.id].spent !== '');

  const showReminderBanner =
    !reminderDismissed &&
    reminderDays.includes(parseInt(date.slice(8, 10), 10)) &&
    entries &&
    businessesLoaded &&
    !dayHasAllLogged;

  const activeBusiness = businesses.find((b) => b.id === activeBiz);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px 60px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24
        }}
      >
        <div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
            {businesses.map((b) => (
              <span key={b.id} style={{ width: 22, height: 3, borderRadius: 2, background: b.accent }} />
            ))}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              margin: 0
            }}
          >
            Business ledger
          </h1>
        </div>
        <button className="btn" onClick={handleLogout}>
          <Icon name="logout" size={13} />
          <span style={{ marginLeft: 6 }}>Log out</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 22,
          borderBottom: '1px solid var(--line)',
          marginBottom: 28
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setView(tab.id);
              setActiveBiz(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 0 12px',
              fontSize: 13.5,
              fontWeight: 600,
              color: view === tab.id ? 'var(--ink)' : 'var(--ink-faint)',
              borderBottom: view === tab.id ? '2px solid var(--ink)' : '2px solid transparent',
              marginBottom: -1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.15s'
            }}
          >
            {tab.id === 'reminders' && <Icon name="bell" size={13} />}
            {tab.id === 'manage' && <Icon name="settings" size={13} />}
            {tab.label}
          </button>
        ))}
      </div>

      {activeBiz && activeBusiness ? (
        <BusinessDetail
          business={activeBusiness}
          date={date}
          entry={entries ? entries[activeBiz] : null}
          onBack={() => setActiveBiz(null)}
          onSave={handleSaveEntry}
        />
      ) : view === 'daily' ? (
        <DailyView
          date={date}
          businesses={businesses}
          businessesLoaded={businessesLoaded}
          entries={entries}
          loading={loading}
          showReminderBanner={showReminderBanner}
          onDismissReminder={() => setReminderDismissed(true)}
          onPrevDay={() => changeDate(-1)}
          onNextDay={() => changeDate(1)}
          onToday={goToday}
          onSelectBusiness={setActiveBiz}
        />
      ) : view === 'monthly' ? (
        <MonthlyView
          month={month}
          businesses={businesses}
          monthData={monthData}
          loading={loading}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
        />
      ) : view === 'reminders' ? (
        <RemindersView reminderDays={reminderDays} onSaved={setReminderDays} />
      ) : (
        <ManageBusinessesView businesses={businesses} onChanged={handleBusinessesChanged} />
      )}
    </div>
  );
}
