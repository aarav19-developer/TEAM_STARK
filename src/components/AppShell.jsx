import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import { useSidebar } from "../context/SidebarContext";

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { data: items }  = useApi(() => api.getItems(),  []);
  const { data: donors } = useApi(() => api.getDonors(), []);
  const { collapsed } = useSidebar();
  const ml = collapsed ? 56 : 224;

  useEffect(() => {
    const down = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <TopBar onSearch={() => setPaletteOpen(true)} />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={items || []}
        donors={donors || []}
      />
      <main
        className="transition-all duration-300"
        style={{ marginLeft: ml, paddingTop: 52 }}
      >
        <div className="p-6 max-w-[1400px] mx-auto anim-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
