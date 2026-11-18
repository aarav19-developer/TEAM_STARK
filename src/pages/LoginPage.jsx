import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/* ─── Particle canvas background ─────────────────────────── */
function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? "rgba(0,255,255," : "rgba(167,139,250,",
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "rgba(0,255,255,0.04)";
      ctx.lineWidth = 1;
      const CELL = 60;
      for (let x = 0; x < W; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      }

      // Connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,255,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─── Login / Setup page ──────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { credentials, setupCredentials, login } = useAuth();

  const isSetup = !credentials; // No creds saved → setup mode

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSetup) {
      if (!username.trim()) { setError("Username is required."); setLoading(false); return; }
      if (password.length < 4) { setError("Password must be at least 4 characters."); setLoading(false); return; }
      if (password !== confirmPwd) { setError("Passwords do not match."); setLoading(false); return; }
      setupCredentials(username.trim(), password);
      sessionStorage.setItem("sahayak_session", "1");
      navigate("/dashboard");
    } else {
      const result = login(username, password);
      if (result.ok) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#070B14] flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
            <span className="text-xl font-bold text-cyan-400 tracking-tight">SA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">SAHAYAK</h1>
          <p className="text-xs text-slate-600 uppercase tracking-widest mt-1">NGO Command Center</p>
        </div>

        {/* Card */}
        <div className="glass border-glow-cyan p-6 rounded-2xl">
          <h2 className="text-sm font-semibold text-slate-300 mb-1">
            {isSetup ? "Setup Access" : "Sign In"}
          </h2>
          <p className="text-xs text-slate-600 mb-5">
            {isSetup
              ? "Create your single admin account to get started."
              : "Enter your credentials to access the command center."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Username</label>
              <input
                className="inp"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                className="inp"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete={isSetup ? "new-password" : "current-password"}
              />
            </div>
            {isSetup && (
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <input
                  className="inp"
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <p className="text-rose-400 text-xs py-2 px-3 rounded-lg bg-rose-500/8 border border-rose-500/15">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/25 text-cyan-400 text-sm font-semibold hover:from-cyan-500/30 hover:to-violet-500/30 transition-all disabled:opacity-40"
            >
              {loading ? "Please wait…" : isSetup ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          Sessions are cleared on browser refresh for security.
        </p>
      </div>
    </div>
  );
}
