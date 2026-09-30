/* =========================================================
   Dashboard.jsx  – Overview stats, charts & activity
   ========================================================= */
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { greeting, fmtDate, stockStatus, expiryStatus, daysUntil } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/seedData';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icons';

export default function Dashboard() {
  const { state } = useApp();
  const { items, donors, donations, distributions } = state;

  const totalInStock   = items.reduce((s, i) => s + i.qty, 0);
  const donorCount     = donors.length;
  const totalDistributed = distributions.reduce((s, d) => s + d.qty, 0);
  const needsRestock   = items.filter((i) => stockStatus(i) !== 'in').length;

  /* Stock by category */
  const catTotals = useMemo(() => {
    const map = {};
    items.forEach((i) => { map[i.cat] = (map[i.cat] || 0) + i.qty; });
    const max = Math.max(1, ...Object.values(map));
    return Object.entries(map).map(([cat, total]) => ({
      cat, total, pct: Math.round((total / max) * 100),
    })).sort((a, b) => b.total - a.total);
  }, [items]);

  /* Recent activity – last 6 events */
  const activity = useMemo(() => {
    const donEvts = donations.map((d) => ({
      type: 'donation',
      date: d.date,
      donorName: donors.find((x) => x.id === d.donor)?.name ?? '(deleted)',
      itemName:  items.find((x)  => x.id === d.item)?.name  ?? '(deleted)',
      qty: d.qty,
      unit: items.find((x) => x.id === d.item)?.unit ?? '',
    }));
    const distEvts = distributions.map((d) => ({
      type: 'distribution',
      date: d.date,
      ben:      d.ben,
      itemName: items.find((x) => x.id === d.item)?.name ?? '(deleted)',
      qty: d.qty,
      unit: items.find((x) => x.id === d.item)?.unit ?? '',
    }));
    return [...donEvts, ...distEvts]
      .sort((a, b) => (b.date > a.date ? 1 : -1))
      .slice(0, 6);
  }, [donations, distributions, items, donors]);

  /* Needs attention */
  const attention = useMemo(() => {
    const list = [];
    items.forEach((item) => {
      const ss = stockStatus(item);
      const es = expiryStatus(item);
      if (ss === 'out') list.push({ item, tag: 'Out of stock', color: 'var(--rose)', bg: 'var(--rose-l)' });
      else if (ss === 'low') list.push({ item, tag: 'Low stock', color: 'var(--sun)', bg: 'var(--sun-l)' });
      if (es === 'expiring') {
        const days = daysUntil(item.exp);
        list.push({ item, tag: `Expires in ${days}d`, color: 'var(--sun)', bg: 'var(--sun-l)' });
      }
      if (es === 'expired') {
        list.push({ item, tag: 'Expired', color: 'var(--rose)', bg: 'var(--rose-l)' });
      }
    });
    return list.slice(0, 8);
  }, [items]);

  const STATS = [
    { label: 'Total in stock',     value: totalInStock,     icon: 'box',          iconBg: 'var(--pri-l)',  iconColor: 'var(--pri)', sub: `${items.length} item types` },
    { label: 'Donors',             value: donorCount,       icon: 'donors',       iconBg: 'var(--sky-l)',  iconColor: 'var(--sky)', sub: 'registered donors' },
    { label: 'Items distributed',  value: totalDistributed, icon: 'distribution', iconBg: 'var(--green-l)',iconColor: 'var(--green)',sub: 'all time' },
    { label: 'Needs restock',      value: needsRestock,     icon: 'warning',      iconBg: 'var(--rose-l)', iconColor: 'var(--rose)', sub: 'items below minimum' },
  ];

  return (
    <>
      <PageHeader
        title={`${greeting()}, team 👋`}
        subtitle="Here is what is happening with your inventory today."
      />

      {/* Stat cards */}
      <div className="stats-grid">
        {STATS.map(({ label, value, icon, iconBg, iconColor, sub }) => (
          <div key={label} className="card stat-card">
            <div className="stat-card-top">
              <span className="stat-label">{label}</span>
              <span className="stat-icon" style={{ background: iconBg, color: iconColor }}>
                <Icon name={icon} size={17} />
              </span>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="dash-body">
        {/* Left column */}
        <div className="dash-col">
          {/* Category bars */}
          <div className="card">
            <div className="sec-head"><h2>Stock by category</h2></div>
            <div className="cat-bars">
              {catTotals.length === 0 ? (
                <p style={{ color: 'var(--mut)', fontSize: 14 }}>No items yet.</p>
              ) : catTotals.map(({ cat, total, pct }) => (
                <div key={cat} className="cat-bar-item">
                  <div className="cat-bar-row">
                    <span>{cat}</span>
                    <span style={{ color: 'var(--mut)', fontSize: 12 }}>{total}</span>
                  </div>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] || 'var(--pri)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="card">
            <div className="sec-head">
              <h2>Recent activity</h2>
              <span>{activity.length} events</span>
            </div>
            <div className="activity-list">
              {activity.length === 0 ? (
                <p style={{ color: 'var(--mut)', fontSize: 14, padding: '0 0 12px' }}>No activity yet.</p>
              ) : activity.map((ev, idx) => (
                <div key={idx} className="activity-item">
                  <div className={`activity-dot ${ev.type}`}>
                    <Icon name={ev.type === 'donation' ? 'donations' : 'distribution'} size={14} />
                  </div>
                  <div className="activity-text">
                    {ev.type === 'donation' ? (
                      <><strong>{ev.donorName}</strong> donated {ev.qty} {ev.unit} of {ev.itemName}</>
                    ) : (
                      <><strong>{ev.ben}</strong> received {ev.qty} {ev.unit} of {ev.itemName}</>
                    )}
                  </div>
                  <span className="activity-time">{fmtDate(ev.date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="dash-col">
          <div className="card">
            <div className="sec-head">
              <h2>Needs attention</h2>
              <span>{attention.length} alerts</span>
            </div>
            <div className="attention-list">
              {attention.length === 0 ? (
                <p style={{ color: 'var(--mut)', fontSize: 14, padding: '0 0 12px' }}>All good! No alerts.</p>
              ) : attention.map(({ item, tag, color, bg }, idx) => (
                <div key={idx} className="attention-item">
                  <Icon name="warning" size={16} className="att-icon" style={{ color }} />
                  <span className="att-name">{item.name}</span>
                  <span
                    className="att-badge"
                    style={{ color, background: bg, padding: '2px 8px', borderRadius: 99 }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
