/* =========================================================
   helpers.js  – Pure utility functions (no React deps)
   ========================================================= */

/** Format a YYYY-MM-DD string as "12 Jan 2025" */
export function fmtDate(isoStr) {
  if (!isoStr) return '—';
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Days between today and a YYYY-MM-DD date (negative = past) */
export function daysUntil(isoStr) {
  if (!isoStr) return null;
  const [y, m, d] = isoStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const now    = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

/**
 * Stock status for an item.
 * Returns: 'out' | 'low' | 'in'
 */
export function stockStatus(item) {
  if (item.qty <= 0)       return 'out';
  if (item.qty < item.min) return 'low';
  return 'in';
}

/**
 * Expiry status for an item.
 * Returns: 'expired' | 'expiring' | 'ok' | null (no expiry)
 */
export function expiryStatus(item) {
  if (!item.exp) return null;
  const days = daysUntil(item.exp);
  if (days < 0)   return 'expired';
  if (days <= 30) return 'expiring';
  return 'ok';
}

/** Today's date as YYYY-MM-DD */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Time-of-day greeting.
 * Returns: "Good morning" | "Good afternoon" | "Good evening"
 */
export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Generate CSV from an array of objects */
export function toCSV(rows, columns) {
  const header = columns.map((c) => c.label).join(',');
  const body   = rows.map((row) =>
    columns.map((c) => {
      const val = String(c.getValue(row) ?? '').replace(/"/g, '""');
      return val.includes(',') || val.includes('"') ? `"${val}"` : val;
    }).join(',')
  );
  return [header, ...body].join('\n');
}

/** Trigger a CSV download in the browser */
export function downloadCSV(filename, csvStr) {
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Validate a 10-digit phone (spaces ok, or empty) */
export function validatePhone(phone) {
  if (!phone || phone.trim() === '') return true; // optional
  const digits = phone.replace(/\s/g, '');
  return /^\d{10}$/.test(digits);
}

/** Case-insensitive duplicate name check */
export function isDuplicateName(list, name, excludeId = null) {
  const norm = name.trim().toLowerCase();
  return list.some(
    (x) => x.name.trim().toLowerCase() === norm && x.id !== excludeId
  );
}

/** Simple sort helper – returns -1 | 0 | 1 */
export function sortBy(a, b, key, dir) {
  const av = a[key] ?? '';
  const bv = b[key] ?? '';
  let cmp = 0;
  if (typeof av === 'number' && typeof bv === 'number') {
    cmp = av - bv;
  } else {
    cmp = String(av).localeCompare(String(bv));
  }
  return dir === 'asc' ? cmp : -cmp;
}
