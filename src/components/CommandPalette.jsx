import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, Users, Heart, Truck, LayoutDashboard } from "lucide-react";

const NAV_CMDS = [
  { label:"Dashboard",    icon:LayoutDashboard, path:"/dashboard" },
  { label:"Inventory",    icon:Package,         path:"/inventory" },
  { label:"Donations",    icon:Heart,           path:"/donations" },
  { label:"Distributions",icon:Truck,           path:"/distributions" },
  { label:"Donors",       icon:Users,           path:"/donors" },
];

export function CommandPalette({ open, onClose, items=[], donors=[] }) {
  const [q, setQ] = useState("");
  const navigate  = useNavigate();

  useEffect(()=>{ if (open) setQ(""); },[open]);

  const results = useCallback(()=>{
    const lq = q.toLowerCase();
    if (!lq) return NAV_CMDS.map(c=>({...c, type:"nav"}));
    const nav = NAV_CMDS.filter(c=>c.label.toLowerCase().includes(lq)).map(c=>({...c,type:"nav"}));
    const itm = items.filter(i=>i.name.toLowerCase().includes(lq)).slice(0,5)
      .map(i=>({label:i.name, sub:`${i.qty} ${i.unit} · ${i.cat}`, icon:Package, type:"item", path:"/inventory"}));
    const don = donors.filter(d=>d.name.toLowerCase().includes(lq)).slice(0,4)
      .map(d=>({label:d.name, sub:d.phone||"", icon:Users, type:"donor", path:"/donors"}));
    return [...nav,...itm,...don];
  },[q,items,donors]);

  if (!open) return null;
  const list = results();

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-xl glass border-glow-cyan anim-fade shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search size={15} className="text-slate-500"/>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search pages, items, donors…"
            className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
            onKeyDown={e=>{
              if(e.key==="Escape") onClose();
              if(e.key==="Enter" && list[0]) { navigate(list[0].path); onClose(); }
            }}
          />
          <kbd className="text-[10px] text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {list.length===0 && <p className="text-slate-600 text-sm text-center py-6">No results</p>}
          {list.map((r,i)=>(
            <button key={i} onClick={()=>{ navigate(r.path); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <r.icon size={13} className="text-cyan-400"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{r.label}</p>
                {r.sub && <p className="text-xs text-slate-600 truncate">{r.sub}</p>}
              </div>
              <span className="text-[10px] text-slate-700 uppercase tracking-wider shrink-0">{r.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
