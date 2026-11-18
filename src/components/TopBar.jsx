import { Search, Wifi, WifiOff, Sun, Moon } from "lucide-react";
import { useHealth } from "../hooks/useHealth";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";

export function TopBar({ onSearch }) {
  const { ok, latency } = useHealth();
  const { theme, toggleTheme } = useTheme();
  const { collapsed } = useSidebar();
  const ml = collapsed ? 56 : 224;

  return (
    <header
      className="fixed top-0 right-0 flex items-center px-5 gap-3 z-40 transition-all duration-300"
      style={{
        left: ml,
        height: 52,
        background: "rgba(7,11,20,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* API health badge */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
        style={{
          fontFamily: '"JetBrains Mono",monospace',
          border: ok ? "1px solid rgba(0,255,180,0.2)" : "1px solid rgba(255,78,106,0.2)",
          background: ok ? "rgba(0,255,180,0.06)" : "rgba(255,78,106,0.06)",
          color: ok ? "var(--emerald)" : "var(--rose)",
        }}
      >
        {ok ? <Wifi size={10} /> : <WifiOff size={10} />}
        {ok ? `API ONLINE · ${latency}ms` : "API OFFLINE"}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <button
        onClick={onSearch}
        className="btn-base flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          color: "var(--mut)",
          fontFamily: '"Inter",sans-serif',
        }}
      >
        <Search size={12} />
        <span>Search</span>
        <kbd
          className="text-[10px] px-1.5 py-0.5 rounded ml-1"
          style={{ border: "1px solid var(--border)", color: "var(--mut)", fontFamily: '"JetBrains Mono",monospace' }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn-base w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          color: "var(--mut)",
        }}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        type="button"
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </header>
  );
}
