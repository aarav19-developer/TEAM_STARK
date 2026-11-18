import { Package, Truck, Users, Database, AlertTriangle } from "lucide-react";

function Kpi({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="glass border-glow-cyan p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16}/>
        </div>
      </div>
      <p className="mono text-3xl font-bold text-slate-100 mb-1">{value ?? "—"}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-xs text-slate-700 mt-1">{sub}</p>}
    </div>
  );
}

export function KpiRow({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <Kpi label="In Stock"       value={stats.totalInStock}     icon={Package}       color="bg-cyan-500/15 text-cyan-400"    sub={`${stats.itemTypes} types`}/>
      <Kpi label="Distributed"    value={stats.totalDistributed} icon={Truck}         color="bg-emerald-500/15 text-emerald-400" sub="all time"/>
      <Kpi label="Donors"         value={stats.donorCount}       icon={Users}         color="bg-violet-500/15 text-violet-400"/>
      <Kpi label="Item Types"     value={stats.itemTypes}        icon={Database}      color="bg-sky-500/15 text-sky-400"/>
      <Kpi label="Needs Restock"  value={stats.needsRestock}     icon={AlertTriangle} color="bg-rose-500/15 text-rose-400"   sub="below minimum"/>
    </div>
  );
}
