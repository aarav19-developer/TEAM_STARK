import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

let _add = null;
export function toast(msg, type="success") { _add?.({ msg, type, id: Date.now() }); }

export function ToastProvider() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((t) => {
    setToasts(p=>[...p,t]);
    setTimeout(()=>setToasts(p=>p.filter(x=>x.id!==t.id)),4000);
  },[]);
  useEffect(()=>{ _add=add; return ()=>{ _add=null; }; },[add]);
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[9999] pointer-events-none">
      {toasts.map(t=>(
        <div key={t.id} className="pointer-events-auto anim-slide flex items-center gap-3 px-4 py-3 rounded-xl glass border border-white/10 shadow-2xl min-w-[260px] max-w-sm">
          {t.type==="error"
            ? <AlertCircle size={16} className="text-rose-400 shrink-0"/>
            : <CheckCircle size={16} className="text-emerald-400 shrink-0"/>}
          <span className="text-sm text-slate-200 flex-1">{t.msg}</span>
          <button onClick={()=>setToasts(p=>p.filter(x=>x.id!==t.id))} className="text-slate-500 hover:text-slate-300">
            <X size={13}/>
          </button>
        </div>
      ))}
    </div>
  );
}
