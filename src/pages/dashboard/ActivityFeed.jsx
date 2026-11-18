import { Heart, Truck } from "lucide-react";
import { fmtDate } from "../../utils/helpers";

export function ActivityFeed({ recentActivity = [] }) {
  return (
    <div className="glass border-glow-cyan p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Recent Activity</h3>
        <span className="mono text-xs text-slate-600">{recentActivity.length} events</span>
      </div>
      {recentActivity.length === 0
        ? <p className="text-slate-600 text-sm text-center py-6">No activity yet</p>
        : (
          <div className="flex flex-col gap-0">
            {recentActivity.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  ev.type === "donation" ? "bg-cyan-500/15" : "bg-emerald-500/15"
                }`}>
                  {ev.type === "donation"
                    ? <Heart size={12} className="text-cyan-400" />
                    : <Truck size={12} className="text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">
                    {ev.type === "donation"
                      ? <><span className="font-semibold text-slate-200">{ev.donorName}</span> donated <span className="mono text-cyan-400">{ev.qty} {ev.unit}</span> of {ev.itemName}</>
                      : <><span className="font-semibold text-slate-200">{ev.ben}</span> received <span className="mono text-emerald-400">{ev.qty} {ev.unit}</span> of {ev.itemName}</>
                    }
                  </p>
                </div>
                <span className="mono text-[10px] text-slate-700 shrink-0 mt-0.5">{fmtDate(ev.date)}</span>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
