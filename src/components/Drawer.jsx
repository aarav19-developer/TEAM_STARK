import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Drawer({ open, onClose, title, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on Escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/*
        BACKDROP — sits above sidebar (z-50=50) and topbar (z-40=40)
        but BELOW the drawer panel.
        pointer-events only active when open.
      */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/*
        DRAWER PANEL — z-index HIGHER than backdrop so clicks land here.
        X button must NOT be covered by anything.
      */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          maxWidth: 440,
          zIndex: 10001,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg2)",
          borderLeft: "1px solid var(--border-cyan)",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.6)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <h2 style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--ink)",
            fontFamily: '"Space Grotesk", sans-serif',
            margin: 0,
          }}>
            {title}
          </h2>

          {/* X button — inline styles only, no Tailwind class interference */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--mut)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--mut)"; }}
            aria-label="Close drawer"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </>
  );
}
