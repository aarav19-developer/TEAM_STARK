/* =========================================================
   StatusPill.jsx  – Stock + expiry status badges
   ========================================================= */
import { stockStatus, expiryStatus, daysUntil } from '../utils/helpers';

export function StockPill({ item }) {
  const s = stockStatus(item);
  const map = {
    out: { cls: 'out',  label: 'Out of stock' },
    low: { cls: 'low',  label: 'Low stock' },
    in:  { cls: 'in-stock', label: 'In stock' },
  };
  const { cls, label } = map[s];
  return <span className={`status-pill ${cls}`}>{label}</span>;
}

export function ExpiryBadge({ item }) {
  const es = expiryStatus(item);
  if (!es || es === 'ok') return null;
  if (es === 'expired') {
    return <span className="exp-badge expired">Expired</span>;
  }
  const days = daysUntil(item.exp);
  return (
    <span className="exp-badge expiring">
      Expires in {days}d
    </span>
  );
}
