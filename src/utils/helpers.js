export const fmtDate = (s) => {
  if (!s) return "—";
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y,m-1,d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
};

export const todayISO = () => new Date().toISOString().slice(0,10);

export const daysUntil = (s) => {
  if (!s) return null;
  const [y,m,d] = s.split("-").map(Number);
  const t = new Date(y,m-1,d), n = new Date(); n.setHours(0,0,0,0);
  return Math.round((t-n)/86400000);
};

export const stockStatus = (item) => {
  if (item.qty<=0) return "out";
  if (item.qty<item.min) return "low";
  return "in";
};

export const expiryStatus = (item) => {
  if (!item.exp) return null;
  const d = daysUntil(item.exp);
  if (d<0) return "expired";
  if (d<=30) return "expiring";
  return "ok";
};

export const CAT_COLORS = {
  Clothes:"#6B74E8", Books:"#38BDF8", Food:"#FFC947",
  Medicines:"#FF4E6A", Stationery:"#A78BFA", Other:"#64748B"
};

export const CATEGORIES = ["Clothes","Books","Food","Medicines","Stationery","Other"];

export const toCSV = (rows, cols) => {
  const h = cols.map(c=>c.label).join(",");
  const b = rows.map(r=>cols.map(c=>{
    const v = String(c.get(r)??"").replace(/"/g,'""');
    return v.includes(",")||v.includes('"')?`"${v}"`:v;
  }).join(","));
  return [h,...b].join("\n");
};

export const downloadCSV = (name,csv) => {
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download=name; a.click();
};

export const validatePhone = (p) => {
  if (!p||!p.trim()) return true;
  return /^\d{10}$/.test(p.replace(/\s/g,""));
};
