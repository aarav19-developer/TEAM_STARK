import { useState, useMemo } from "react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import { toast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { DeleteAuthModal } from "../components/DeleteAuthModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { validatePhone } from "../utils/helpers";

const EMPTY = { name: "", phone: "" };

function DonorForm({ initial = EMPTY, onSave, onClose, existing = [], busy }) {
  const isEdit = !!initial._id;
  const [f, setF] = useState({ ...EMPTY, ...initial });
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Required";
    else if (existing.some(x => x.name.trim().toLowerCase() === f.name.trim().toLowerCase() && x._id !== f._id)) e.name = "Name already exists";
    if (!f.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(f.phone.replace(/\s/g, ""))) e.phone = "Must be exactly 10 digits";
    setErr(e); return Object.keys(e).length === 0;
  };

  const submit = e => { e.preventDefault(); if (!validate()) return; onSave({ ...(isEdit?{_id:initial._id}:{}), name:f.name.trim(), phone:f.phone.trim() }); };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Full Name *</label>
        <input className={`inp ${err.name?"inp-error":""}`} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Anita Sharma" autoFocus />
        {err.name && <p className="text-rose-400 text-xs mt-1">{err.name}</p>}
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Phone <span className="text-rose-400">*</span></label>
        <input className={`inp mono ${err.phone?"inp-error":""}`} type="tel" value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="10-digit number" maxLength={12} />
        {err.phone && <p className="text-rose-400 text-xs mt-1">{err.phone}</p>}
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-white/5 mt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors">Cancel</button>
        <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-400 text-sm font-medium disabled:opacity-40">
          {busy ? "Saving…" : isEdit ? "Save Changes" : "Add Donor"}
        </button>
      </div>
    </form>
  );
}

export default function Donors() {
  const { data: donors, loading, refetch } = useApi(() => api.getDonors(), []);
  const { data: donations } = useApi(() => api.getDonations(), []);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [target, setTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const donorStats = useMemo(() => {
    const m = {};
    (donations || []).forEach(d => {
      const id = d.donor?._id ?? d.donor;
      if (!m[id]) m[id] = { count: 0, total: 0 };
      m[id].count++; m[id].total += d.qty;
    });
    return m;
  }, [donations]);

  const filtered = useMemo(() =>
    (donors || []).filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
  [donors, search]);

  const initials = name => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const handleSave = async (data) => {
    setBusy(true);
    try {
      if (data._id) await api.updateDonor(data._id, data);
      else await api.createDonor(data);
      toast(data._id ? "Donor updated" : "Donor added");
      setDrawer(null); refetch();
    } catch (e) { toast(e.message, "error"); }
    finally { setBusy(false); }
  };

  const handleDelete = async () => {
    setBusy(true);
    try { await api.deleteDonor(delTarget._id); toast("Donor removed", "error"); setDelTarget(null); refetch(); }
    catch (e) { toast(e.message, "error"); setDelTarget(null); }
    finally { setBusy(false); }
  };

  return (
    <div className="anim-fade">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Donor Network</h1>
          <p className="text-xs text-slate-600 mt-0.5 uppercase tracking-wider">People and organisations who donate</p>
        </div>
        <button onClick={() => { setTarget(null); setDrawer("form"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/25 transition-all">
          <Plus size={14}/> Add Donor
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/>
          <input className="inp pl-8 w-52" placeholder="Search donors…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <span className="mono text-xs text-slate-700">{filtered.length} donors</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 gap-2">{[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-violet-500/60 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600"><p className="text-sm">No donors found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(donor => {
            const s = donorStats[donor._id] || { count:0, total:0 };
            return (
              <div key={donor._id} className="glass border-glow-cyan p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/15 flex items-center justify-center shrink-0 font-bold text-xs text-violet-400">
                  {initials(donor.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-200 text-sm truncate">{donor.name}</p>
                  {donor.phone && <p className="mono text-xs text-slate-600 mt-0.5">{donor.phone}</p>}
                  <div className="flex gap-4 mt-3">
                    <div className="text-center">
                      <p className="mono text-lg font-bold text-cyan-400">{s.count}</p>
                      <p className="text-[10px] text-slate-700 uppercase tracking-wider">donations</p>
                    </div>
                    <div className="text-center">
                      <p className="mono text-lg font-bold text-violet-400">{s.total}</p>
                      <p className="text-[10px] text-slate-700 uppercase tracking-wider">total items</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { setTarget(donor); setDrawer("form"); }} className="p-1.5 rounded-lg hover:bg-white/8 text-slate-600 hover:text-cyan-400 transition-colors"><Pencil size={12}/></button>
                  <button onClick={() => setDelTarget(donor)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={12}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {drawer === "form" && <Drawer open={true} onClose={() => setDrawer(null)} title={target ? "Edit Donor" : "Add Donor"}>
        <DonorForm initial={target || EMPTY} onSave={handleSave} onClose={() => setDrawer(null)} existing={donors||[]} busy={busy}/>
      </Drawer>}

      <DeleteAuthModal
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        title="Remove Donor"
        message={<><p className="mb-1">Remove <span className="text-slate-200 font-semibold">"{delTarget?.name}"</span>?</p><p className="text-xs text-amber-400/80">⚠ This will fail if the donor has existing donations.</p></>}
        busy={busy}
      />
    </div>
  );
}
