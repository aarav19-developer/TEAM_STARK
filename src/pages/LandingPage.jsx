import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { ArrowRight, Package, Heart, Truck, Users, LayoutDashboard, Wifi, WifiOff, Activity, Database, TrendingUp, Shield } from "lucide-react";

function AnimBg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let raf, W, H, t = 0;
    const nodes = Array.from({ length: 30 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random()-.5)*.0002, vy: (Math.random()-.5)*.0002, r: Math.random()*2+1 }));
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize(); window.addEventListener("resize", resize);
    function draw() {
      t += 0.006; ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,255,255,0.03)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 70) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=1; if (p.x>1) p.x=0; if (p.y<0) p.y=1; if (p.y>1) p.y=0;
        ctx.beginPath(); ctx.arc(p.x*W, p.y*H, p.r, 0, Math.PI*2);
        ctx.fillStyle = "rgba(0,255,255," + (0.3+0.2*Math.sin(t*2)) + ")"; ctx.fill();
      }
      for (let i=0; i<nodes.length; i++) for (let j=i+1; j<nodes.length; j++) {
        const dx=(nodes[i].x-nodes[j].x)*W, dy=(nodes[i].y-nodes[j].y)*H, d=Math.sqrt(dx*dx+dy*dy);
        if (d<120) { ctx.beginPath(); ctx.moveTo(nodes[i].x*W,nodes[i].y*H); ctx.lineTo(nodes[j].x*W,nodes[j].y*H); ctx.strokeStyle="rgba(0,255,255,"+(0.06*(1-d/120))+")"; ctx.lineWidth=0.5; ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }} />;
}

function LiveStat({ label, value, icon: Icon, color }) {
  return (
    <div className="glass border-glow-cyan p-4 card-hover flex items-center gap-4" style={{ borderRadius:12 }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "22", color }}>
        <Icon size={18}/>
      </div>
      <div>
        <p className="mono text-2xl font-bold" style={{ color:"var(--ink)" }}>{value ?? "—"}</p>
        <p style={{ fontSize:10, color:"var(--mut)", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:'"JetBrains Mono",monospace' }}>{label}</p>
      </div>
    </div>
  );
}

const MODULES = [
  { label:"Command Dashboard", desc:"KPIs, charts, activity",    icon:LayoutDashboard, path:"/dashboard",     grad:"from-cyan-500/20 to-blue-500/20",   brd:"rgba(0,255,255,0.2)" },
  { label:"Inventory Matrix",  desc:"Full CRUD · stock mgmt",   icon:Package,         path:"/inventory",     grad:"from-violet-500/20 to-purple-500/20", brd:"rgba(167,139,250,0.2)" },
  { label:"Donation Ledger",   desc:"Log & track donations",     icon:Heart,           path:"/donations",     grad:"from-rose-500/20 to-pink-500/20",    brd:"rgba(255,78,106,0.2)" },
  { label:"Distribution Ops",  desc:"Dispatch to beneficiaries", icon:Truck,           path:"/distributions", grad:"from-amber-500/20 to-orange-500/20", brd:"rgba(255,201,71,0.2)" },
  { label:"Donor Network",     desc:"Manage donor profiles",     icon:Users,           path:"/donors",        grad:"from-emerald-500/20 to-teal-500/20", brd:"rgba(0,255,180,0.2)" },
];

const FEATURES = [
  { icon:Activity,   title:"Live Telemetry",     desc:"Real-time KPIs from your database." },
  { icon:Database,   title:"Atomic Operations",  desc:"Stock updates are fully atomic." },
  { icon:TrendingUp, title:"Interactive Charts", desc:"Inflow vs outflow time-series charts." },
  { icon:Shield,     title:"Auth Protected",     desc:"Session-based auth, clears on refresh." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [dash, setDash] = useState(null);
  const [apiOk, setApiOk] = useState(null);
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    (async () => {
      const t = Date.now();
      try {
        const [, d] = await Promise.all([api.health(), api.dashboard()]);
        setApiOk(true); setLatency(Date.now()-t); setDash(d);
      } catch { setApiOk(false); }
    })();
  }, []);

  const go = (path) => { navigate(path); };

  return (
    <div style={{ minHeight:"100vh", background:"#070B14", color:"#E2E8F0", position:"relative" }}>
      <AnimBg />
      <div style={{ position:"relative", zIndex:1 }}>

        {/* Nav */}
        <nav style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"16px 32px", display:"flex", alignItems:"center", gap:16, backdropFilter:"blur(12px)", background:"rgba(7,11,20,0.8)", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,rgba(0,255,255,0.15),rgba(167,139,250,0.15))", border:"1px solid rgba(0,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"var(--cyan)", fontFamily:'"Space Grotesk",sans-serif' }}>SA</div>
            <span style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:14, color:"#E2E8F0", letterSpacing:"0.05em" }}>SAHAYAK</span>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:99, border: apiOk===null?"1px solid #1a2540": apiOk?"1px solid rgba(0,255,180,0.2)":"1px solid rgba(255,78,106,0.2)", background: apiOk===null?"transparent": apiOk?"rgba(0,255,180,0.06)":"rgba(255,78,106,0.06)", color: apiOk===null?"#475569": apiOk?"var(--emerald)":"var(--rose)", fontSize:10, fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>
            {apiOk===null?<Activity size={10}/>:apiOk?<Wifi size={10}/>:<WifiOff size={10}/>}
            {apiOk===null?"CHECKING":apiOk?"API ONLINE · "+latency+"ms":"API OFFLINE"}
          </div>
          <button onClick={()=>go("/login")} className="btn-base" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 20px", borderRadius:10, background:"linear-gradient(135deg,rgba(0,255,255,0.12),rgba(167,139,250,0.12))", border:"1px solid rgba(0,255,255,0.2)", color:"var(--cyan)", fontSize:13, fontWeight:600, fontFamily:'"Space Grotesk",sans-serif', cursor:"pointer" }}>
            Launch Dashboard <ArrowRight size={14}/>
          </button>
        </nav>

        {/* Hero */}
        <section style={{ padding:"80px 48px 60px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"4px 14px", borderRadius:99, border:"1px solid rgba(0,255,255,0.2)", background:"rgba(0,255,255,0.06)", color:"var(--cyan)", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:24, fontFamily:'"JetBrains Mono",monospace' }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--cyan)", animation:"glow 2s ease-in-out infinite" }}/>
            NGO Operations Platform
          </div>
          <h1 style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:800, lineHeight:1.1, marginBottom:20 }}>
            <span style={{ display:"block", fontSize:"clamp(36px,6vw,72px)", color:"#E2E8F0" }}>Sahayak</span>
            <span style={{ display:"block", fontSize:"clamp(28px,5vw,60px)", background:"linear-gradient(90deg,var(--cyan),var(--violet))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Command Center</span>
          </h1>
          <p style={{ fontFamily:'"Inter",sans-serif', color:"#64748B", fontSize:16, maxWidth:520, lineHeight:1.7, marginBottom:36 }}>
            High-fidelity inventory operations for NGOs. Track donations, manage stock, dispatch distributions, and monitor your supply chain in real time.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button onClick={()=>go("/login")} className="btn-base" style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 32px", borderRadius:12, background:"linear-gradient(135deg,var(--cyan),var(--violet))", color:"#070B14", fontWeight:700, fontSize:14, fontFamily:'"Space Grotesk",sans-serif', border:"none", cursor:"pointer", boxShadow:"0 8px 32px rgba(0,255,255,0.2)" }}>
              Launch Operations Dashboard <ArrowRight size={15}/>
            </button>
            <button onClick={()=>go("/")} className="btn-base" style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 28px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", color:"#64748B", fontSize:13, fontFamily:'"Inter",sans-serif', background:"transparent", cursor:"pointer" }}>
              View Intro Screen
            </button>
          </div>
        </section>

        {/* Live stats */}
        {dash && (
          <section style={{ padding:"0 48px 48px", maxWidth:1100, margin:"0 auto" }}>
            <p style={{ fontSize:10, color:"var(--mut)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:16, fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>LIVE TELEMETRY</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              <LiveStat label="In Stock"    value={dash.stats.totalInStock}     icon={Package}  color="var(--cyan)"/>
              <LiveStat label="Distributed" value={dash.stats.totalDistributed} icon={Truck}    color="var(--emerald)"/>
              <LiveStat label="Donors"      value={dash.stats.donorCount}       icon={Users}    color="var(--violet)"/>
              <LiveStat label="Item Types"  value={dash.stats.itemTypes}        icon={Database} color="var(--amber)"/>
            </div>
          </section>
        )}

        {/* Modules */}
        <section style={{ padding:"0 48px 48px", maxWidth:1100, margin:"0 auto" }}>
          <p style={{ fontSize:10, color:"var(--mut)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:16, fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>OPERATIONAL MODULES</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
            {MODULES.map(({ label, desc, icon: Icon, path, brd }) => (
              <button key={path} onClick={()=>go("/login")} className="btn-base" style={{ padding:20, borderRadius:16, background:"rgba(14,21,37,0.8)", border:"1px solid "+brd, textAlign:"left", cursor:"pointer", backdropFilter:"blur(8px)" }}>
                <Icon size={20} style={{ marginBottom:12, color:"var(--ink2)" }}/>
                <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:600, fontSize:13, color:"var(--ink)", marginBottom:4 }}>{label}</p>
                <p style={{ fontFamily:'"Inter",sans-serif', fontSize:11, color:"var(--mut)" }}>{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ padding:"0 48px 60px", maxWidth:1100, margin:"0 auto", borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:40 }}>
          <p style={{ fontSize:10, color:"var(--mut)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:16, fontFamily:'"JetBrains Mono",monospace', fontWeight:700 }}>CAPABILITIES</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass border-glow-cyan card-hover" style={{ padding:20, borderRadius:12 }}>
                <Icon size={16} style={{ color:"var(--cyan)", marginBottom:12 }}/>
                <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:600, fontSize:13, color:"var(--ink)", marginBottom:6 }}>{title}</p>
                <p style={{ fontFamily:'"Inter",sans-serif', fontSize:12, color:"var(--mut)", lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.04)", padding:"20px 48px", textAlign:"center", fontFamily:'"JetBrains Mono",monospace', fontSize:10, color:"#1a2540", textTransform:"uppercase", letterSpacing:"0.1em" }}>
          SAHAYAK · EXPRESS + MONGODB · REACT + VITE + TAILWIND
        </footer>
      </div>

      <style>{`@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  );
}