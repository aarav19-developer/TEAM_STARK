import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HexGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H, t = 0;
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 1.5 + 0.5,
      hue: Math.random() > 0.5 ? "0,255,255" : "167,139,250",
    }));
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    function drawHex(cx, cy, size, alpha) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i === 0 ? ctx.moveTo(cx + size * Math.cos(a), cy + size * Math.sin(a))
                : ctx.lineTo(cx + size * Math.cos(a), cy + size * Math.sin(a));
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(0,255,255," + alpha + ")";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);
      const S = 48, rows = Math.ceil(H / (S * 1.5)) + 2, cols = Math.ceil(W / (S * Math.sqrt(3))) + 2;
      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = c * S * Math.sqrt(3) + (r % 2 ? S * Math.sqrt(3) / 2 : 0);
          const cy = r * S * 1.5;
          drawHex(cx, cy, S - 2, 0.02 + 0.015 * Math.sin(t + c * 0.4 + r * 0.3));
        }
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.hue + "," + (0.4 + 0.3 * Math.sin(t * 2)) + ")";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x - particles[j].x) * W;
          const dy = (particles[i].y - particles[j].y) * H;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x * W, particles[i].y * H);
            ctx.lineTo(particles[j].x * W, particles[j].y * H);
            ctx.strokeStyle = "rgba(0,255,255," + (0.08 * (1 - d / 110)) + ")";
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return React.createElement("canvas", { ref, style: { position:"fixed", inset:0, pointerEvents:"none", zIndex:0 } });
}

const WORD = "Sahayak";

export default function LogoSplashPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("icon");
  const [visCount, setVisCount] = useState(0);
  const [ready, setReady] = useState(false);
  const go = useCallback(() => navigate("/landing"), [navigate]);

  useEffect(() => { const t = setTimeout(() => setPhase("text"), 600); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (phase !== "text") return;
    let count = 0;
    const iv = setInterval(() => {
      count++; setVisCount(count);
      if (count >= WORD.length) {
        clearInterval(iv);
        setTimeout(() => setPhase("sub"), 200);
        setTimeout(() => setReady(true), 900);
      }
    }, 110);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#070B14", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <HexGrid />
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"rgba(0,255,255,0.03)", top:-200, left:-200, filter:"blur(80px)", zIndex:1 }}/>
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"rgba(167,139,250,0.04)", bottom:-200, right:-100, filter:"blur(80px)", zIndex:1 }}/>
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ position:"relative", width:150, height:150, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 }}>
          <div style={{ position:"absolute", width:150, height:150, borderRadius:"50%", border:"1px solid rgba(0,255,255,0.15)", animation:"rp 2.4s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", border:"1px solid rgba(167,139,250,0.2)", animation:"rp 2.4s ease-in-out infinite", animationDelay:".5s" }}/>
          <svg width="118" height="118" viewBox="0 0 110 110" fill="none" style={{ position:"relative", zIndex:2, filter:"drop-shadow(0 8px 28px rgba(84,93,200,.35))", animation:"bob 3s ease-in-out infinite" }}>
            <circle cx="55" cy="55" r="50" fill="#EEF0FD" />
            <circle cx="55" cy="55" r="46" stroke="#6B74E8" strokeWidth="1.5" strokeDasharray="6 8" opacity=".4" style={{ transformOrigin:"55px 55px", animation:"sp 8s linear infinite" }} />
            <path d="M34 64C31 56 34 46 42 44C43 40 46 38 49 40C50 36 53 35 55 37C57 33 61 32 63 35L63 52C66 51 69 52 70 56L71 64C71 74 64 80 55 80C46 80 34 74 34 64Z" fill="#6B74E8" opacity=".9"/>
            <path d="M55 71C55 71 44 62 44 55a7.5 7.5 0 0 1 11-6.6 7.5 7.5 0 0 1 11 6.6C66 62 55 71 55 71Z" fill="white"/>
            <circle cx="55" cy="9" r="5" fill="#6B74E8" style={{ transformOrigin:"55px 55px", animation:"sp 3s linear infinite" }} />
            <path d="M26 32 L27.5 36 L32 37 L27.5 38 L26 42 L24.5 38 L20 37 L24.5 36 Z" fill="#F59E0B" opacity=".9"/>
            <path d="M84 28 L85 31 L88 32 L85 33 L84 36 L83 33 L80 32 L83 31 Z" fill="#0DB3A0" opacity=".9"/>
            <path d="M20 72 L21 75 L24 76 L21 77 L20 80 L19 77 L16 76 L19 75 Z" fill="#2FA8DC" opacity=".9"/>
            <path d="M90 68 L91.5 72 L95 73 L91.5 74 L90 78 L88.5 74 L85 73 L88.5 72 Z" fill="#E85858" opacity=".9"/>
          </svg>
        </div>
        <div style={{ display:"flex", overflow:"hidden", marginBottom:14 }}>
          {WORD.split("").map((ch, i) => (
            <span key={i} style={{
              display:"inline-block",
              opacity: visCount > i ? 1 : 0,
              transform: visCount > i ? "translateY(0) rotateX(0deg)" : "translateY(-60px) rotateX(-90deg)",
              transition:"transform .42s cubic-bezier(.34,1.3,.64,1), opacity .28s",
              color: i === 5 ? "#0DB3A0" : "#a5b4fc",
              fontFamily:'"Space Grotesk",sans-serif',
              fontSize:"clamp(44px,9vw,80px)",
              fontWeight:800, lineHeight:1, letterSpacing:"-.03em",
              transformOrigin:"top center",
            }}>{ch}</span>
          ))}
        </div>
        <p style={{
          fontFamily:'"Inter",sans-serif', fontSize:12, fontWeight:500,
          color:"#475569", letterSpacing:"0.15em", textTransform:"uppercase",
          marginBottom: ready ? 32 : 0,
          opacity: phase === "sub" || ready ? 1 : 0,
          transition:"opacity .4s ease, margin .4s ease",
        }}>NGO Inventory Command Center</p>
        {ready && (
          <button onClick={go} style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"12px 36px", borderRadius:12,
            border:"1px solid rgba(0,255,255,0.3)", cursor:"pointer",
            background:"linear-gradient(135deg,rgba(0,255,255,0.12),rgba(167,139,250,0.12))",
            color:"#a5b4fc",
            fontFamily:'"Space Grotesk",sans-serif',
            fontSize:14, fontWeight:700, letterSpacing:"0.05em",
            boxShadow:"0 0 30px rgba(0,255,255,0.1)",
            animation:"fu .4s ease both",
          }}>
            Enter Command Center
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        )}
      </div>
      <style>{`
        @keyframes rp  { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.06);opacity:1} }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes sp  { to{transform:rotate(360deg)} }
        @keyframes fu  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}