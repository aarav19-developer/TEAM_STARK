/* =========================================================
   Landing.jsx v4 – no emojis, premium SVG icons, working anchors
   ========================================================= */
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTheme } from '../App';
import '../styles/landing.css';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Feature SVG icons ── */
function FeatBox()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; }
function FeatHeart() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function FeatTruck() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }
function FeatUsers() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function FeatChart() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6"  y1="20" x2="6"  y2="14"/><line x1="2"  y1="20" x2="22" y2="20"/></svg>; }
function FeatCsv()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }

/* ── Category SVG icons (premium, no emoji) ── */
function CatClothes()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>; }
function CatBooks()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function CatFood()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>; }
function CatMedicines()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>; }
function CatStation()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><line x1="18" y1="2" x2="22" y2="6"/><path d="M7.5 20.5L19 9l-4-4L3.5 16.5 2 22z"/></svg>; }
function CatOther()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>; }

/* ── How-it-works step icons ── */
function HowAdd()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function HowRecord() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function HowEye()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }

/* ── Hero SVG ── */
function HeroIllustration() {
  return (
    <div className="hero-illustration-wrap">
      <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg"
           className="hero-illustration" aria-hidden="true">
        <circle cx="260" cy="220" r="180" fill="var(--pri-l)" opacity=".5"/>
        <circle cx="260" cy="220" r="130" fill="var(--pri-l)" opacity=".4"/>
        {/* box */}
        <rect x="145" y="205" width="230" height="162" rx="18" fill="var(--pri)"/>
        <rect x="145" y="205" width="230" height="56"  rx="18" fill="var(--pri-d)"/>
        <rect x="235" y="193" width="50" height="26" rx="8" fill="var(--sun)"/>
        <rect x="257" y="193" width="8"  height="26" rx="4" fill="#D97706"/>
        <path d="M260 298C260 298 232 275 232 257a22 22 0 0 1 28-20 22 22 0 0 1 28 20c0 18-28 41-28 41z" fill="white" opacity=".92"/>
        {/* book */}
        <g transform="rotate(-13,92,138)">
          <rect x="64" y="102" width="58" height="78" rx="7" fill="var(--sky)"/>
          <rect x="67" y="105" width="5" height="72" rx="2.5" fill="#0284C7"/>
          <rect x="76" y="118" width="36" height="4" rx="2" fill="white" opacity=".5"/>
          <rect x="76" y="129" width="30" height="4" rx="2" fill="white" opacity=".45"/>
          <rect x="76" y="140" width="34" height="4" rx="2" fill="white" opacity=".35"/>
        </g>
        {/* jacket */}
        <g transform="rotate(10,386,106)">
          <path d="M366 77L410 100L404 67L390 58L378 67L366 58L350 67L345 100Z" fill="var(--cat-stationery)" opacity=".85"/>
          <path d="M378 67L378 120" stroke="white" strokeWidth="2.5" opacity=".4"/>
        </g>
        {/* medicine */}
        <g transform="rotate(6,416,218)">
          <rect x="396" y="190" width="40" height="66" rx="10" fill="var(--rose)"/>
          <rect x="391" y="184" width="50" height="18" rx="8" fill="#DC2626"/>
          <rect x="411" y="202" width="10" height="40" rx="2" fill="white" opacity=".8"/>
          <rect x="403" y="216" width="26" height="10" rx="2" fill="white" opacity=".8"/>
        </g>
        {/* food can */}
        <g transform="translate(63,243)">
          <ellipse cx="28" cy="9"  rx="25" ry="11" fill="var(--sun)"/>
          <rect x="3" y="9" width="50" height="43" fill="var(--sun)"/>
          <ellipse cx="28" cy="52" rx="25" ry="11" fill="#D97706"/>
          <rect x="11" y="16" width="34" height="24" rx="4" fill="white" opacity=".7"/>
        </g>
        {/* sparkles */}
        <circle cx="172" cy="90"  r="6"   fill="var(--sun)"   opacity=".8"/>
        <circle cx="183" cy="77"  r="3"   fill="var(--sun)"   opacity=".5"/>
        <circle cx="417" cy="158" r="5"   fill="var(--pri)"   opacity=".5"/>
        <circle cx="68"  cy="313" r="6"   fill="var(--sky)"   opacity=".55"/>
        <circle cx="456" cy="335" r="5"   fill="var(--cat-stationery)" opacity=".6"/>
        <circle cx="308" cy="80"  r="4"   fill="var(--green)" opacity=".7"/>
        <circle cx="142" cy="354" r="4"   fill="var(--rose)"  opacity=".5"/>
        {/* people */}
        <g opacity=".1">
          {[168,198,228,258,288,318,348].map(x => (
            <g key={x} transform={`translate(${x},362)`}>
              <circle cx="10" cy="0" r="7" fill="var(--ink)"/>
              <rect x="4" y="9" width="12" height="17" rx="3" fill="var(--ink)"/>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ── Scroll reveal ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ id, style, children }) {
  const ref = useReveal();
  return (
    <section id={id} ref={ref} className="section reveal-section" style={style}>
      {children}
    </section>
  );
}

const FEATURES = [
  { Icon: FeatBox,   bg:'var(--pri-l)',   color:'var(--pri)',   title:'Smart Inventory',      desc:'Track every item with live stock levels, expiry dates, and automatic low-stock alerts.' },
  { Icon: FeatHeart, bg:'var(--rose-l)',  color:'var(--rose)',  title:'Donation Tracking',    desc:'Log incoming donations from any donor and watch stock update instantly in real time.' },
  { Icon: FeatTruck, bg:'var(--sky-l)',   color:'var(--sky)',   title:'Distribution Records', desc:'Record every distribution to beneficiaries and prevent accidental over-distribution.' },
  { Icon: FeatUsers, bg:'var(--teal-l)',  color:'var(--teal)',  title:'Donor Management',     desc:'Maintain a donor directory with contacts, donation counts, and full giving history.' },
  { Icon: FeatChart, bg:'var(--sun-l)',   color:'var(--sun)',   title:'Live Dashboard',       desc:'At-a-glance stats, category bar charts, and a live activity feed — always up to date.' },
  { Icon: FeatCsv,   bg:'var(--green-l)',color:'var(--green)', title:'CSV Export',           desc:'Download inventory, donations, or distributions as spreadsheets with one click.' },
];

const CATEGORIES = [
  { Icon: CatClothes,   color:'var(--pri)',   bg:'var(--pri-l)',   name:'Clothes' },
  { Icon: CatBooks,     color:'var(--sky)',   bg:'var(--sky-l)',   name:'Books' },
  { Icon: CatFood,      color:'var(--sun)',   bg:'var(--sun-l)',   name:'Food' },
  { Icon: CatMedicines, color:'var(--rose)',  bg:'var(--rose-l)',  name:'Medicines' },
  { Icon: CatStation,   color:'var(--cat-stationery)', bg:'var(--pri-l)', name:'Stationery' },
  { Icon: CatOther,     color:'var(--mut)',   bg:'var(--bg2)',     name:'Other' },
];

const HOW_STEPS = [
  { num:'01', Icon: HowAdd,    title:'Set up inventory',               desc:'Add the items your NGO handles — clothes, food, medicines, stationery, and more.' },
  { num:'02', Icon: HowRecord, title:'Record donations & distributions',desc:'Log every incoming donation and outgoing distribution in just a few seconds.' },
  { num:'03', Icon: HowEye,    title:'Monitor & act fast',             desc:'Spot low stock, expiring items, and trends on the dashboard before problems arise.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const go = () => navigate('/dashboard');
  const { dark, toggle } = useTheme();

  return (
    <div className="landing-root">
      {/* decorative blobs */}
      <div className="landing-blob" style={{width:'500px',height:'500px',background:'rgba(107,116,232,.07)',top:'-100px',right:'-120px',animationDuration:'9s',animationDelay:'0s'}} />
      <div className="landing-blob" style={{width:'400px',height:'400px',background:'rgba(13,179,160,.06)',bottom:'200px',left:'-100px',animationDuration:'11s',animationDelay:'2s'}} />
      <div className="landing-blob" style={{width:'300px',height:'300px',background:'rgba(245,158,11,.05)',top:'60%',right:'10%',animationDuration:'8s',animationDelay:'4s'}} />

      {/* ── Navbar ── */}
      <header className="landing-nav">
        <div className="nav-inner">
        <button className="brand brand-btn" onClick={() => window.scrollTo({top:0,behavior:"smooth"})} aria-label="Back to top">
          <svg width="24" height="24" viewBox="0 0 90 90" fill="none" aria-hidden="true">
            <circle cx="45" cy="45" r="38" fill="var(--pri-l)"/>
            <path d="M28 52C26 46 28 38 35 36C36 33 38 32 40 33C41 30 43 29 45 30C46 27 49 26 51 28L51 42C53 41 56 42 57 45L58 52C58 60 52 65 44 65C36 65 28 60 28 52Z" fill="var(--pri)"/>
            <path d="M44 57C44 57 36 50 36 45a5.5 5.5 0 0 1 8-5 5.5 5.5 0 0 1 8 5C52 50 44 57 44 57Z" fill="white"/>
          </svg>
          Sahayak<span className="brand-dot">.</span>
        </button>
        <nav className="nav-links" aria-label="Landing navigation">
          <a href="#features" onClick={e => { e.preventDefault(); scrollTo('features'); }}>
            <span className="nav-dot" />Features
          </a>
          <a href="#how" onClick={e => { e.preventDefault(); scrollTo('how'); }}>
            <span className="nav-dot" />How it works
          </a>
          <a href="#items" onClick={e => { e.preventDefault(); scrollTo('items'); }}>
            <span className="nav-dot" />Categories
          </a>
          <a href="#cta" onClick={e => { e.preventDefault(); scrollTo('cta'); }}>
            <span className="nav-dot" />Get started
          </a>
        </nav>
        {/* Mobile: small CTA button shown when nav-links hidden */}
        <button className="nav-mobile-cta" onClick={go} aria-label="Open dashboard">
          Dashboard →
        </button>
        <button className="nav-theme-btn" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot" />
            Built for NGOs
          </div>
          <h1>
            Manage donations<br />&amp; inventory<br />
            <span className="hi">effortlessly.</span>
          </h1>
          <p>
            Sahayak helps small NGOs track donated goods, manage inventory,
            record distributions, and stay on top of what needs restocking —
            all in one simple, offline-ready app.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={go}>Open Dashboard →</button>
            <button className="btn btn-ghost"   onClick={() => scrollTo('features')}>See features</button>
          </div>
        </div>
        <HeroIllustration />
      </section>

      {/* ── Stats ── */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          {[
            { num:'500+', label:'NGOs can use this' },
            { num:'6',    label:'Item categories' },
            { num:'100%', label:'Free & open source' },
            { num:'0',    label:'Servers needed' },
          ].map(({ num, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <RevealSection id="features">
        <div className="section-header">
          <div className="sh-pill">Features</div>
          <h2>Everything your NGO needs</h2>
          <p>Built specifically for small teams with limited resources and big hearts.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(({ Icon, bg, color, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon" style={{ background: bg, color }}>
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      <div className="section-rule" />
      {/* ── Categories ── */}
      <RevealSection id="items" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="sh-pill">Categories</div>
          <h2>Item categories we support</h2>
          <p>Track everything from winter jackets to life-saving medicines.</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(({ Icon, color, bg, name }) => (
            <div key={name} className="cat-card">
              <div className="cat-icon" style={{ color, background: bg, borderRadius: 12, display:'flex', alignItems:'center', justifyContent:'center', width:52, height:52, margin:'0 auto 12px' }}>
                <Icon />
              </div>
              <div className="cat-name">{name}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── How it works ── */}
      <div className="how-section-bg"><RevealSection id="how">
        <div className="section-header">
          <div className="sh-pill">Process</div>
          <h2>How it works</h2>
          <p>Get started in minutes — no training, no setup, no servers.</p>
        </div>
        <div className="how-grid">
          {HOW_STEPS.map(({ num, Icon, title, desc }) => (
            <div key={num} className="how-card">
              <div className="how-num">{num}</div>
              <div className="how-icon" style={{ color:'var(--pri)', display:'flex', justifyContent:'center' }}>
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </RevealSection></div>

      {/* ── CTA ── */}
      <div className="cta-section" id="cta">
        <div className="cta-banner">
          {/* floating particles */}
          <div className="cta-dots" aria-hidden="true">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="cta-dot" style={{
                width: `${10+i*6}px`, height: `${10+i*6}px`,
                left: `${8+i*11}%`, bottom: 0,
                animationDuration: `${3+i*0.7}s`,
                animationDelay: `${i*0.4}s`,
              }} />
            ))}
          </div>
          <h2>Ready to bring order to your operations?</h2>
          <p>Sahayak is free, runs entirely in your browser, and needs no setup.</p>
          <button className="btn-white" onClick={go}>Get started — it&apos;s free</button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>
          <strong>Sahayak</strong> — NGO Donation &amp; Inventory Management
          &nbsp;·&nbsp; Built with care for social impact
        </p>
      </footer>
    </div>
  );
}