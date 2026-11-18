import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import { KpiRow } from "./dashboard/KpiRow";
import { InflowOutflowChart } from "./dashboard/InflowOutflowChart";
import { CategoryChart } from "./dashboard/CategoryChart";
import { ThresholdMatrix } from "./dashboard/ThresholdMatrix";
import { AttentionFeed } from "./dashboard/AttentionFeed";
import { ActivityFeed } from "./dashboard/ActivityFeed";
import { RefreshCw } from "lucide-react";

export default function Dashboard() {
  const { data: dash, loading, error, refetch } = useApi(() => api.dashboard(), []);
  const { data: donations } = useApi(() => api.getDonations(), []);
  const { data: distributions } = useApi(() => api.getDistributions(), []);
  const { data: items } = useApi(() => api.getItems(), []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-2">
      {[0,1,2].map(i=><div key={i} className="w-2.5 h-2.5 rounded-full bg-cyan-500/60 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
    </div>
  );

  if (error) return (
    <div className="glass border-rose-500/20 p-8 text-center">
      <p className="text-rose-400 mb-2">Failed to load dashboard</p>
      <p className="text-slate-600 text-sm mb-4">{error}</p>
      <button onClick={refetch} className="px-4 py-2 rounded-lg bg-rose-500/15 text-rose-400 text-sm border border-rose-500/20">Retry</button>
    </div>
  );

  return (
    <div className="anim-fade">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Command Overview</h1>
          <p className="text-xs text-slate-600 mt-0.5 uppercase tracking-wider">Live inventory telemetry</p>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300 transition-colors text-xs">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* KPI row */}
      <KpiRow stats={dash?.stats} />

      {/* Row 1: Inflow/Outflow + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <InflowOutflowChart donations={donations ?? []} distributions={distributions ?? []} />
        </div>
        <CategoryChart stockByCategory={dash?.stockByCategory ?? []} />
      </div>

      {/* Row 2: Threshold + Attention + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ThresholdMatrix items={items ?? []} />
        <AttentionFeed attention={dash?.attention ?? []} />
        <ActivityFeed recentActivity={dash?.recentActivity ?? []} />
      </div>
    </div>
  );
}
