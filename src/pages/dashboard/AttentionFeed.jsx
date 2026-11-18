import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function AttentionFeed({ attention = [] }) {
  const navigate = useNavigate();
  return (
    <div className="glass border-glow-cyan p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Needs Attention</h3>
        <span className="mono text-xs text-slate-600">{attention.length} alerts</span>
      </div>
      {attention.length === 0
        ? <p className="text-emerald-500/70 text-sm text-center py-6">✓ All systems nominal</p>
        : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {attention.map((a, i) => {
              const isError = a.level === "error";
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isError ? "bg-rose-500/8 border-rose-500/15" : "bg-amber-500/8 border-amber-500/15"
                }`}>
                  <AlertTriangle size={13} className={isError ? "text-rose-400 shrink-0" : "text-amber-400 shrink-0"} />
                  <span className="text-xs text-slate-300 flex-1 truncate">{a.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    isError ? "text-rose-400" : "text-amber-400"
                  }`}>{a.tag}</span>
                  <button
                    onClick={() => navigate(`/donations`)}
                    className="shrink-0 p-1 rounded-lg hover:bg-white/10 text-slate-600 hover:text-cyan-400 transition-colors"
                    title="Log donation to restock">
                    <ArrowRight size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
