import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { fmtDate } from "../../utils/helpers";

const RANGES = ["7D","14D","30D","ALL"];

function buildSeries(donations, distributions, days) {
  const cutoff = days ? new Date(Date.now()-days*86400000).toISOString().slice(0,10) : "0";
  const map = {};
  [...(donations||[])].forEach(d=>{
    if (d.date>=cutoff) { map[d.date]=map[d.date]||{date:d.date,donated:0,distributed:0}; map[d.date].donated+=d.qty; }
  });
  [...(distributions||[])].forEach(d=>{
    if (d.date>=cutoff) { map[d.date]=map[d.date]||{date:d.date,donated:0,distributed:0}; map[d.date].distributed+=d.qty; }
  });
  return Object.values(map).sort((a,b)=>a.date>b.date?1:-1);
}

const CustomTooltip = ({active,payload,label})=>{
  if (!active||!payload?.length) return null;
  return (
    <div className="glass border-glow-cyan p-3 text-xs">
      <p className="text-slate-400 mb-2">{fmtDate(label)}</p>
      {payload.map(p=>(
        <p key={p.name} style={{color:p.color}} className="mono">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export function InflowOutflowChart({ donations=[], distributions=[] }) {
  const [range, setRange] = useState("30D");
  const days = range==="ALL"?null:parseInt(range);
  const data = useMemo(()=>buildSeries(donations,distributions,days),[donations,distributions,days]);

  return (
    <div className="glass border-glow-cyan p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Inflow vs Outflow</h3>
          <p className="text-xs text-slate-600 mt-0.5">Donations received vs Distributions dispatched</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map(r=>(
            <button key={r} onClick={()=>setRange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                range===r?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-slate-600 hover:text-slate-400"
              }`}>{r}</button>
          ))}
        </div>
      </div>
      {data.length===0
        ? <p className="text-slate-600 text-sm text-center py-10">No data for this range</p>
        : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{top:5,right:5,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gDon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00FFFF" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gDist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00FFB4" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00FFB4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="date" tick={{fill:"#475569",fontSize:10}} tickFormatter={d=>d.slice(5)} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11,color:"#64748B"}}/>
              <Area type="monotone" dataKey="donated"     name="Donated"     stroke="#00FFFF" fill="url(#gDon)"  strokeWidth={2} dot={false} activeDot={{r:4,fill:"#00FFFF"}}/>
              <Area type="monotone" dataKey="distributed" name="Distributed" stroke="#00FFB4" fill="url(#gDist)" strokeWidth={2} dot={false} activeDot={{r:4,fill:"#00FFB4"}}/>
            </AreaChart>
          </ResponsiveContainer>
        )
      }
    </div>
  );
}
