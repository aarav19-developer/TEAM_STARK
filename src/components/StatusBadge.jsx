import { stockStatus, expiryStatus, daysUntil } from "../utils/helpers";

export function StockBadge({ item }) {
  const s = stockStatus(item);
  const cfg = {
    out: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    low: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    in:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const lbl = { out:"Out of Stock", low:"Low Stock", in:"In Stock" };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg[s]}`}>{lbl[s]}</span>;
}

export function ExpiryBadge({ item }) {
  const es = expiryStatus(item);
  if (!es||es==="ok") return null;
  const d = daysUntil(item.exp);
  if (es==="expired") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20">Expired</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">Exp {d}d</span>;
}
