import { useState } from "react";
import { Modal } from "./Modal";
import { getSavedCredentials } from "../auth/AuthContext";
import { ShieldAlert } from "lucide-react";

/**
 * DeleteAuthModal — requires password confirmation before any delete.
 *
 * Props:
 *   open        boolean
 *   onClose     () => void
 *   onConfirm   () => void  — called only after correct password
 *   title       string      — e.g. "Delete Item"
 *   message     ReactNode   — confirmation message shown above input
 *   busy        boolean
 */
export function DeleteAuthModal({ open, onClose, onConfirm, title = "Confirm Delete", message, busy = false }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setPin("");
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    const creds = getSavedCredentials();
    if (!creds) {
      setError("No credentials configured.");
      return;
    }
    if (pin !== creds.password) {
      setError("Incorrect PIN. Delete cancelled.");
      setPin("");
      return;
    }
    setPin("");
    setError("");
    onConfirm();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert size={14} className="text-rose-400" />
        </div>
        <div>
          {message && <div className="text-sm text-slate-400 mb-3">{message}</div>}
          <p className="text-xs text-slate-500">
            Enter your password to confirm this deletion.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
        <input
          className={`inp${error ? " inp-error" : ""}`}
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleConfirm()}
          placeholder="Enter your password"
          autoFocus
        />
        {error && (
          <p className="text-rose-400 text-xs mt-1.5">{error}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 text-sm font-medium disabled:opacity-40 transition-colors"
        >
          {busy ? "Deleting…" : "Confirm Delete"}
        </button>
      </div>
    </Modal>
  );
}
