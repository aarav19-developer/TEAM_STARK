import { useState, useEffect } from "react";
import { api } from "../api/client";

export function useHealth() {
  const [status, setStatus] = useState({ ok: false, latency: null });
  useEffect(() => {
    const check = async () => {
      const t = Date.now();
      try { await api.health(); setStatus({ ok: true, latency: Date.now()-t }); }
      catch { setStatus({ ok: false, latency: null }); }
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);
  return status;
}
