import { stockStatus, expiryStatus, daysUntil } from "../../utils/helpers";

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex-1">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function ThresholdMatrix({ items = [] }) {
  const statusColor = { out: "#FF4E6A", low: "#FFC947", in: "#00FFB4" };

  return (
    <div className="glass border-glow-cyan p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Stock Threshold Matrix</h3>
        <p className="text-xs text-slate-600 mt-0.5">qty vs min · expiry countdown</p>
      </div>

      {items.length === 0
        ? <p className="text-slate-600 text-sm text-center py-10">No items</p>
        : (
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {items.map(item => {
              const ss = stockStatus(item);
              const es = expiryStatus(item);
              const daysLeft = item.exp ? daysUntil(item.exp) : null;
              const expColor = es === "expired" ? "#FF4E6A" : es === "expiring" ? "#FFC947" : "#475569";
              return (
                <div key={item._id} className="p-3 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/15 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[140px]">{item.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ss === "out" ? "bg-rose-500/15 text-rose-400" :
                      ss === "low" ? "bg-amber-500/15 text-amber-400" :
                      "bg-emerald-500/15 text-emerald-400"
                    }`}>{ss === "out" ? "OUT" : ss === "low" ? "LOW" : "OK"}</span>
                  </div>
                  {/* Stock bar */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="mono text-[10px] text-slate-600 w-12 shrink-0">
                      {item.qty}/{item.min}
                    </span>
                    <ProgressBar value={item.qty} max={Math.max(item.min * 1.5, item.qty)} color={statusColor[ss]} />
                  </div>
                  {/* Expiry bar */}
                  {item.exp && (
                    <div className="flex items-center gap-2">
                      <span className="mono text-[10px] shrink-0" style={{ color: expColor, width: 48 }}>
                        {daysLeft !== null ? (daysLeft < 0 ? "EXP" : `${daysLeft}d`) : "—"}
                      </span>
                      <ProgressBar
                        value={Math.max(0, daysLeft ?? 0)}
                        max={180}
                        color={expColor}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
