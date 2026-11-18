import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Heart, Truck, Users } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

const NAV = [
  { to: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { to: "/inventory",     icon: Package,         label: "Inventory" },
  { to: "/donations",     icon: Heart,           label: "Donations" },
  { to: "/distributions", icon: Truck,           label: "Distributions" },
  { to: "/donors",        icon: Users,           label: "Donors" },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const W = collapsed ? 56 : 224;

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-50 transition-all duration-300"
      style={{ width: W, background: "var(--bg2)", borderRight: "1px solid var(--border)" }}
    >
      {/* Brand — click to toggle */}
      <button
        onClick={toggle}
        className="flex items-center gap-3 px-3 py-4 w-full transition-all duration-200 hover:opacity-80"
        style={{ borderBottom: "1px solid var(--border)" }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        {/* SA Logo box */}
        <div
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg,rgba(0,255,255,0.15),rgba(167,139,250,0.15))",
            border: "1px solid var(--border-cyan)",
            color: "var(--cyan)",
            fontFamily: '"Space Grotesk",sans-serif',
            letterSpacing: "-0.02em",
          }}
        >
          SA
        </div>
        {!collapsed && (
          <div className="text-left overflow-hidden">
            <p className="text-xs font-bold tracking-wide leading-none" style={{ color: "var(--ink)", fontFamily: '"Space Grotesk",sans-serif' }}>
              SAHAYAK
            </p>
            <p className="text-[9px] mt-0.5 uppercase tracking-widest" style={{ color: "var(--mut)" }}>
              Command Center
            </p>
          </div>
        )}
      </button>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `nav-link-active-indicator flex items-center gap-3 rounded-lg transition-all duration-150 btn-base ${
                collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
              } ${isActive
                ? "active"
                : ""
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? "rgba(0,255,255,0.08)" : "transparent",
              color: isActive ? "var(--cyan)" : "var(--mut)",
              border: isActive ? "1px solid var(--border-cyan)" : "1px solid transparent",
              fontSize: 13,
              fontWeight: 500,
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} style={{ color: isActive ? "var(--cyan)" : "var(--mut)", flexShrink: 0 }} />
                {!collapsed && <span style={{ fontFamily: '"Inter",sans-serif' }}>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--mut)", fontFamily: '"JetBrains Mono",monospace' }}>
            ⌘K to search
          </p>
        </div>
      )}
    </aside>
  );
}
