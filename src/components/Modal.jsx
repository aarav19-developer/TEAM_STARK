import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, wide=false }) {
  useEffect(()=>{
    if (open) document.body.style.overflow="hidden";
    else document.body.style.overflow="";
    return ()=>{ document.body.style.overflow=""; };
  },[open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative glass border-glow-cyan anim-fade w-full ${wide?"max-w-2xl":"max-w-md"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-200 transition-colors">
            <X size={15}/>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
