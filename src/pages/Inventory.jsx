import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import { toast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { DeleteAuthModal } from "../components/DeleteAuthModal";
import { StockBadge, ExpiryBadge } from "../components/StatusBadge";
import { Plus, Download, Search, Pencil, Trash2, RefreshCw } from "lucide-react";
import { fmtDate, toCSV, downloadCSV, CATEGORIES, CAT_COLORS, stockStatus, daysUntil } from "../utils/helpers";
import { todayISO } from "../utils/helpers";

const EMPTY = { name:"", cat:"Clothes", qty:"", unit:"pcs", min:"", exp:"" };

function ItemForm({ initial = EMPTY, onSave, onClose, existing = [], busy }) {
  const isEdit = !!initial._id;
  const [f, setF] = useState({ ...EMPTY, ...initial, qty: initial.qty ?? "", min: initial.min ?? "" });
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Required";
    else if (existing.some(x => x.name.trim().toLowerCase() === f.name.trim().toLowerCase() && x._id !== f._id)) e.name = "Name already exists";
    if (f.qty === "" || isNaN(+f.qty) || !Number.isInteger(+f.qty) || +f.qty < 0) e.qty = "Whole number ≥ 0";
    if (f.min === "" || isNaN(+f.min) || !Number.isInteger(+f.min) || +f.min < 0) e.min = "Whole number ≥ 0";
    if (!f.unit.trim()) e.unit = "Required";
    setErr(e); return Object.keys(e).length === 0;
  };

  const submit = e => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...f, qty: +f.qty, min: +f.min, exp: f.exp || "" });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Item Name *</label>
        <input className={`inp ${err.name ? "inp-error" : ""}`} value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Winter Jackets" autoFocus />
        {err.name && <p className="text-rose-400 text-xs mt-1">{err.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Category *</label>
          <select className="inp" value={f.cat} onChange={e => set("cat", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Unit *</label>
          <input className={`inp ${err.unit ? "inp-error" : ""}`} value={f.unit} onChange={e => set("unit", e.target.value)} placeholder="pcs / bags / litres" />
          {err.unit && <p className="text-rose-400 text-xs mt-1">{err.unit}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Current Qty *</label>
          <input className={`inp mono ${err.qty ? "inp-error" : ""}`} type="number" min="0" step="1" value={f.qty} onChange={e => set("qty", e.target.value)} placeholder="0" />
          {err.qty && <p className="text-rose-400 text-xs mt-1">{err.qty}</p>}
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Min Stock *</label>
          <input className={`inp mono ${err.min ? "inp-error" : ""}`} type="number" min="0" step="1" value={f.min} onChange={e => set("min", e.target.value)} placeholder="0" />
          {err.min && <p className="text-rose-400 text-xs mt-1">{err.min}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Expiry Date <span className="text-slate-700">(optional)</span></label>
        <input className="inp" type="date" value={f.exp} onChange={e => set("exp", e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-white/5 mt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors">Cancel</button>
        <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 text-cyan-400 text-sm font-medium disabled:opacity-40">
          {busy ? "Saving…" : isEdit ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </form>
  );
}

export default function Inventory() {
  const { data: items, loading, error, refetch } = useApi(() => api.getItems(), []);
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(params.get("cat") || "All");
  const [drawer, setDrawer] = useState(null);
  const [target, setTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { const c = params.get("cat"); if (c) setCatFilter(c); }, [params]);

  const filtered = useMemo(() => {
    if (!items) return [];
    let list = items;
    if (search.trim()) list = list.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== "All") list = list.filter(i => i.cat === catFilter);
    return list;
  }, [items, search, catFilter]);

  const handleSave = async (data) => {
    setBusy(true);
    try {
      if (data._id) await api.updateItem(data._id, data);
      else await api.createItem(data);
      toast(data._id ? "Item updated" : "Item added");
      setDrawer(null); refetch();
    } catch (e) { toast(e.message, "error"); }
    finally { setBusy(false); }
  };

  const handleDelete = async () => {
    setBusy(true);
    try { await api.deleteItem(delTarget._id); toast("Item deleted", "error"); setDelTarget(null); refetch(); }
    catch (e) { toast(e.message, "error"); }
    finally { setBusy(false); }
  };

  const exportCSV = () => {
    if (!filtered.length) return;
    downloadCSV("inventory.csv", toCSV(filtered, [
      { label:"Name",     get:r=>r.name },
      { label:"Category", get:r=>r.cat },
      { label:"Qty",      get:r=>r.qty },
      { label:"Unit",     get:r=>r.unit },
      { label:"Min",      get:r=>r.min },
      { label:"Expiry",   get:r=>r.exp||"" },
    ]));
  };

  return (
    <div className="anim-fade">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Inventory Matrix</h1>
          <p className="text-xs text-slate-600 mt-0.5 uppercase tracking-wider">All donated goods and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300 transition-colors text-xs">
            <Download size={12} /> Export
          </button>
          <button onClick={() => { setTarget(null); setDrawer("form"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:from-cyan-500/30 transition-all">
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input className="inp pl-8 w-52" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                catFilter === c
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-600 hover:text-slate-400 border border-transparent"
              }`}
              style={catFilter === c && c !== "All" ? { borderColor: `${CAT_COLORS[c]}33`, color: CAT_COLORS[c] } : {}}>
              {c}
            </button>
          ))}
        </div>
        <span className="mono text-xs text-slate-700 ml-auto">{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="glass border-glow-cyan overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 gap-2">
            {[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-cyan-500/60 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-rose-400 text-sm mb-3">{error}</p>
            <button onClick={refetch} className="text-xs text-slate-500 flex items-center gap-1 mx-auto hover:text-slate-300"><RefreshCw size={11}/>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <p className="text-sm">No items found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Item</th><th>Category</th><th>Stock</th><th>Min</th>
                  <th>Status</th><th>Expiry</th><th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td className="font-medium text-slate-200">{item.name}</td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${CAT_COLORS[item.cat]}18`, color: CAT_COLORS[item.cat] }}>
                        {item.cat}
                      </span>
                    </td>
                    <td className="mono text-slate-300">{item.qty} <span className="text-slate-700">{item.unit}</span></td>
                    <td className="mono text-slate-600">{item.min}</td>
                    <td><StockBadge item={item} /></td>
                    <td>{item.exp ? <div className="flex items-center gap-1.5"><span className="mono text-xs text-slate-500">{fmtDate(item.exp)}</span><ExpiryBadge item={item}/></div> : <span className="text-slate-700">—</span>}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setTarget(item); setDrawer("form"); }} className="p-1.5 rounded-lg hover:bg-white/8 text-slate-600 hover:text-cyan-400 transition-colors"><Pencil size={12}/></button>
                        <button onClick={() => setDelTarget(item)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawer === "form" && <Drawer open={true} onClose={() => setDrawer(null)} title={target ? "Edit Item" : "Add Item"}>
        <ItemForm initial={target || EMPTY} onSave={handleSave} onClose={() => setDrawer(null)} existing={items || []} busy={busy} />
      </Drawer>}

      <DeleteAuthModal
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={<>Delete <span className="text-slate-200 font-semibold">"{delTarget?.name}"</span>? Past records referencing this item will show "— (deleted)".</>}
        busy={busy}
      />
    </div>
  );
}
