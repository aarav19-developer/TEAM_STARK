/* =========================================================
   App.jsx v4 – theme toggle, improved splash, cursor
   ========================================================= */
import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';

import Landing      from './pages/Landing';
import Dashboard    from './pages/Dashboard';
import Inventory    from './pages/Inventory';
import Donations    from './pages/Donations';
import Donors       from './pages/Donors';
import Distribution from './pages/Distribution';

import './styles/global.css';
import './styles/dashboard.css';

/* ─── Theme context ─── */
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('sahayak-theme') === 'dark'; }
    catch { return false; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('sahayak-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  const toggle = useCallback(() => setDark(d => !d), []);
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

/* ─── Custom cursor ─── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const smooth  = useRef({ x: -200, y: -200 });
  const raf     = useRef(null);

  useEffect(() => {
    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current)
        dotRef.current.style.transform =
          `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.10;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.10;
      if (ringRef.current)
        ringRef.current.style.transform =
          `translate(${smooth.current.x}px,${smooth.current.y}px) translate(-50%,-50%)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    const hi = (e) => { if (e.target.closest('a,button,input,select,textarea,[role="button"]')) document.body.classList.add('cursor-hover'); };
    const ho = (e) => { if (e.target.closest('a,button,input,select,textarea,[role="button"]')) document.body.classList.remove('cursor-hover'); };
    const dn = () => document.body.classList.add('cursor-click');
    const up = () => document.body.classList.remove('cursor-click');
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover',  hi);
    document.addEventListener('mouseout',   ho);
    document.addEventListener('mousedown',  dn);
    document.addEventListener('mouseup',    up);
    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover',  hi);
      document.removeEventListener('mouseout',   ho);
      document.removeEventListener('mousedown',  dn);
      document.removeEventListener('mouseup',    up);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

/* ─── Splash: SVG drops, then letters fall from top one by one ─── */
const WORD = 'Sahayak';

function Splash({ onDone }) {
  const [phase,    setPhase]    = useState('icon');
  const [visCount, setVisCount] = useState(0);
  const [gone,     setGone]     = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'text') return;
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setVisCount(count);
      if (count >= WORD.length) {
        clearInterval(iv);
        setTimeout(() => setPhase('sub'),  200);
        setTimeout(() => setPhase('exit'), 2400);
        setTimeout(() => { setGone(true); onDone(); }, 2900);
      }
    }, 110);
    return () => clearInterval(iv);
  }, [phase, onDone]);

  if (gone) return null;

  return (
    <div className={`splash${phase === 'exit' ? ' splash-exit' : ''}`} aria-hidden="true">
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      {/* Big attractive SVG */}
      <div className="splash-svg-wrap">
        <div className="splash-ring splash-ring-outer" />
        <div className="splash-ring splash-ring-mid" />
        <svg width="118" height="118" viewBox="0 0 110 110" fill="none" className="splash-svg-icon">
          <circle cx="55" cy="55" r="50" fill="var(--pri-l)" />
          <circle cx="55" cy="55" r="46" stroke="var(--pri)" strokeWidth="1.5"
            strokeDasharray="6 8" opacity=".35" className="splash-orbit" />
          <path d="M34 64C31 56 34 46 42 44C43 40 46 38 49 40C50 36 53 35 55 37C57 33 61 32 63 35L63 52C66 51 69 52 70 56L71 64C71 74 64 80 55 80C46 80 34 74 34 64Z"
            fill="var(--pri)" opacity=".9"/>
          <path d="M55 71C55 71 44 62 44 55a7.5 7.5 0 0 1 11-6.6 7.5 7.5 0 0 1 11 6.6C66 62 55 71 55 71Z"
            fill="white"/>
          <circle cx="55" cy="9" r="5" fill="var(--pri)" className="splash-orbit-dot" />
          <path d="M26 32 L27.5 36 L32 37 L27.5 38 L26 42 L24.5 38 L20 37 L24.5 36 Z" fill="var(--sun)" opacity=".8"/>
          <path d="M84 28 L85 31 L88 32 L85 33 L84 36 L83 33 L80 32 L83 31 Z" fill="var(--teal)" opacity=".8"/>
          <path d="M20 72 L21 75 L24 76 L21 77 L20 80 L19 77 L16 76 L19 75 Z" fill="var(--sky)" opacity=".8"/>
          <path d="M90 68 L91.5 72 L95 73 L91.5 74 L90 78 L88.5 74 L85 73 L88.5 72 Z" fill="var(--rose)" opacity=".8"/>
        </svg>
      </div>

      {/* Letters drop from top */}
      <div style={{ display:'flex', overflow:'hidden' }}>
        {WORD.split('').map((ch, i) => (
          <span key={i} style={{
            display:'inline-block',
            opacity:   visCount > i ? 1 : 0,
            transform: visCount > i ? 'translateY(0) rotateX(0deg)' : 'translateY(-70px) rotateX(-90deg)',
            transition:'transform .42s cubic-bezier(.34,1.3,.64,1), opacity .28s',
            color: i === 5 ? 'var(--pri)' : i === 6 ? 'var(--teal)' : 'inherit',
            fontFamily:'"Space Grotesk",sans-serif',
            fontSize:'clamp(58px,12vw,92px)',
            fontWeight:700, lineHeight:1,
            letterSpacing:'-.03em',
            transformOrigin:'top center',
          }}>{ch}</span>
        ))}
      </div>

      <div className={`splash-sub${phase === 'sub' || phase === 'exit' ? ' in' : ''}`} style={{marginTop:16}}>
        <div className="splash-tagline">NGO Donation &amp; Inventory</div>
        <div className="splash-bar">
          <div className={`splash-bar-fill${phase === 'sub' || phase === 'exit' ? ' splash-bar-run' : ''}`} />
        </div>
      </div>

      <style>{`
        .splash-svg-wrap{position:relative;width:150px;height:150px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;}
        .splash-ring{position:absolute;border-radius:50%;border-style:solid;animation:sRingPulse 2.4s ease-in-out infinite;}
        .splash-ring-outer{width:150px;height:150px;border:2px solid rgba(107,116,232,.14);}
        .splash-ring-mid{width:128px;height:128px;border:1.5px solid rgba(107,116,232,.2);animation-delay:.5s;}
        @keyframes sRingPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.06);opacity:1}}
        .splash-svg-icon{position:relative;z-index:2;filter:drop-shadow(0 8px 28px rgba(107,116,232,.28));animation:sIconBob 3s ease-in-out infinite;}
        @keyframes sIconBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .splash-orbit{transform-origin:55px 55px;animation:sOrbit 8s linear infinite;}
        .splash-orbit-dot{transform-origin:55px 55px;animation:sOrbit 3s linear infinite;}
        @keyframes sOrbit{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
/* ─── App layout ─── */
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleDone = useCallback(() => setSplashDone(true), []);

  return (
    <ThemeProvider>
      <AppProvider>
        <Cursor />
        {!splashDone && <Splash onDone={handleDone} />}
        <div style={{ opacity: splashDone ? 1 : 0, transition: 'opacity .4s ease' }}>
          <HashRouter>
            <Routes>
              <Route path="/"             element={<Landing />} />
              <Route path="/dashboard"    element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/inventory"    element={<AppLayout><Inventory /></AppLayout>} />
              <Route path="/donations"    element={<AppLayout><Donations /></AppLayout>} />
              <Route path="/donors"       element={<AppLayout><Donors /></AppLayout>} />
              <Route path="/distribution" element={<AppLayout><Distribution /></AppLayout>} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}