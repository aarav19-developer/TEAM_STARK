/* =========================================================
   Sidebar.jsx v4 – theme toggle button + SVG icons
   ========================================================= */
import { NavLink, Link } from 'react-router-dom';
import { Icon } from './Icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../App';

const NAV = [
  { to: '/dashboard',    icon: 'dashboard',    label: 'Dashboard' },
  { to: '/inventory',    icon: 'inventory',    label: 'Inventory' },
  { to: '/donations',    icon: 'donations',    label: 'Donations' },
  { to: '/donors',       icon: 'donors',       label: 'Donors' },
  { to: '/distribution', icon: 'distribution', label: 'Distribution' },
];

/* Sun SVG */
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  );
}

/* Moon SVG */
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function Sidebar({ onReset }) {
  const { dispatch } = useApp();
  const { dark, toggle } = useTheme();

  const handleReset = () => {
    if (window.confirm('Reset all data to demo defaults? This cannot be undone.')) {
      dispatch({ type: 'RESET' });
      onReset?.();
    }
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand" aria-label="Go to home">
          <svg width="22" height="22" viewBox="0 0 90 90" fill="none" aria-hidden="true">
            <circle cx="45" cy="45" r="38" fill="var(--pri-l)"/>
            <path d="M28 52C26 46 28 38 35 36C36 33 38 32 40 33C41 30 43 29 45 30C46 27 49 26 51 28L51 42C53 41 56 42 57 45L58 52C58 60 52 65 44 65C36 65 28 60 28 52Z"
                  fill="var(--pri)"/>
            <path d="M44 57C44 57 36 50 36 45a5.5 5.5 0 0 1 8-5 5.5 5.5 0 0 1 8 5C52 50 44 57 44 57Z"
                  fill="white"/>
          </svg>
          Sahayak<span className="sidebar-brand-dot">.</span>
        </Link>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Theme toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
            <span style={{ flex: 1, textAlign: 'left' }}>
              {dark ? 'Light mode' : 'Dark mode'}
            </span>
            <div className="theme-toggle-track">
              <div className="theme-toggle-thumb" />
            </div>
          </button>

          {/* Reset */}
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleReset}
            aria-label="Reset demo data"
          >
            <Icon name="refresh" size={14} />
            Reset demo data
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
              aria-label={label}
            >
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}