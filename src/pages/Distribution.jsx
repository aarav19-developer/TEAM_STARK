import { useState, useMemo } from "react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import { toast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { DeleteAuthModal } from "../components/DeleteAuthModal";
import { Plus, Download, Trash2 } from "lucide-react";
import { fmtDate, toCSV, downloadCSV, todayISO } from "../utils/helpers";

function DistributionForm({ onSave, onClose, items = [], busy }) {
  const today = todayISO();
  const [f, setF] = useState({ date: today, ben: "", item: items[0]?._id || "", qty: "" });
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const selItem = items.find(i => i._id === f.item);

  if (!items.length) return <div className="text-center py-8 text-slate-600 text-sm"><p>No items in inventory yet.</p><button onClick={onClose} className="mt-4 text-xs text-slate-500 hover:text-slate-300">Close</button></div>;

  const validate = () => {
    const e = {};
    if (!f.date) e.date = "Required";
    else if (f.date > today) e.date = "Cannot be in the future";
    if (!f.ben.trim()) e.ben = "Required";
    if (!f.item) e.item = "Required";
    const q = +f.qty;
    if (!f.qty || !Number.isInteger(q) || q <= 0) e.qty = "Whole number > 0";
    else if (selItem && q > selItem.qty) e.qty = `Only ${selItem.qty} ${selItem.unit} in stock`;
    setErr(e); return Object.keys(e).length === 0;
  };

  const submit = e => { e.preventDefault(); if (!validate()) return; onSave({ date: f.date, ben: f.ben.trim(), item: f.item, qty: +f.qty }); };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Date *</label>
        <input className={`inp mono ${err.date?"inp-error":""}`} type="date" max={today} value={f.date} onChange={e=>set("date",e.target.value)} />
        {err.date && <p className="text-rose-400 text-xs mt-1">{err.date}</p>}
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Beneficiary *</label>
        <input className={`inp ${err.ben?"inp-error":""}`} value={f.ben} onChange={e=>set("ben",e.target.value)} placeholder="e.g. Sunrise Shelter" autoComplete="off" />
        {err.ben && <p className="text-rose-400 text-xs mt-1">{err.ben}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Item *</label>
          <select className={`inp ${err.item?"inp-error":""}`} value={f.item} onChange={e=>set("item",e.target.value)}>
            {items.map(i=><option key={i._id} value={i._id}>{i.name} ({i.qty} {i.unit})</option>)}
          </select>
          {err.item && <p className="text-rose-400 text-xs mt-1">{err.item}</p>}
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Quantity *</label>
          <input className={`inp mono ${err.qty?"inp-error":""}`} type="number" min="1" step="1" value={f.qty} onChange={e=>set("qty",e.target.value)} placeholder="0" />
          {err.qty && <p className="text-rose-400 text-xs mt-1">{err.qty}</p>}
        </div>
      </div>
      {selItem && (
        <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-xs">
          <span className="text-slate-500">Stock after dispatch: </span>
          <span className="mono text-emerald-400 font-semibold">{Math.max(0, selItem.qty - (+f.qty||0))} {selItem.unit}</span>
          <span className="text-slate-600"> (was {selItem.qty})</span>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-white/5 mt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors">Cancel</button>
        <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-medium disabled:opacity-40">
          {busy ? "Saving…" : "Log Distribution"}
        </button>
      </div>
    </form>
  );
}

export default function Distribution() {
  const { data: distributions, loading, refetch } = useApi(() => api.getDistributions(), []);
  const { data: items } = useApi(() => api.getItems(), []);
  const [drawer, setDrawer] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => (distributions || []).map(d => ({
    ...d,
    itemName: d.item?.name ?? "— (deleted item)",
    unit:     d.item?.unit ?? "",
  })), [distributions]);

  const handleSave = async (data) => {
    setBusy(true);
    try { await api.createDistribution(data); toast("Distribution logged — stock deducted"); setDrawer(false); refetch(); }
    catch (e) { toast(e.message, "error"); }
    finally { setBusy(false); }
  };

  const handleDelete = async () => {
    setBusy(true);
    try { await api.deleteDistribution(delTarget._id); toast("Distribution deleted — stock restored", "error"); setDelTarget(null); refetch(); }
    catch (e) { toast(e.message, "error"); }
    finally { setBusy(false); }
  };

  const exportCSV = () => {
    if (!rows.length) return;
    downloadCSV("distributions.csv", toCSV(rows, [
      {label:"Date",        get:r=>r.date},
      {label:"Beneficiary", get:r=>r.ben},
      {label:"Item",        get:r=>r.itemName},
      {label:"Qty",         get:r=>r.qty},
      {label:"Unit",        get:r=>r.unit},
    ]));
  };

  return (
    <div className="anim-fade">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Distribution Dispatch</h1>
          <p className="text-xs text-slate-600 mt-0.5 uppercase tracking-wider">Items dispatched to beneficiaries</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300 transition-colors text-xs">
            <Download size={12}/> Export
          </button>
          <button onClick={() => setDrawer(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all">
            <Plus size={14}/> Log Distribution
          </button>
        </div>
      </div>

      <div className="glass border-glow-emerald overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 gap-2">{[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-emerald-500/60 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-slate-600"><p className="text-sm">No distributions logged yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Date</th><th>Beneficiary</th><th>Item</th><th>Quantity</th><th className="w-12"></th></tr></thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row._id}>
                    <td className="mono text-slate-500">{fmtDate(row.date)}</td>
                    <td className="text-slate-200 font-medium">{row.ben}</td>
                    <td className="text-slate-300">{row.itemName}</td>
                    <td className="mono text-emerald-400">{row.qty} <span className="text-slate-700">{row.unit}</span></td>
                    <td>
                      <button onClick={() => setDelTarget(row)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition-colors" title="Delete (restores stock)"><Trash2 size={12}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawer && <Drawer open={true} onClose={() => setDrawer(false)} title="Log Distribution">
        <DistributionForm onSave={handleSave} onClose={() => setDrawer(false)} items={items||[]} busy={busy} />
      </Drawer>}

      <DeleteAuthModal
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        title="Delete Distribution"
        message={<><p className="mb-1">Delete this distribution?</p><p className="text-xs text-emerald-400/80">✓ This will <strong>restore</strong> the item stock quantity.</p></>}
        busy={busy}
      />
    </div>
  );
}
