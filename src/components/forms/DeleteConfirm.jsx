/* =========================================================
   DeleteConfirm.jsx  – Generic delete confirmation dialog
   Props: message, onConfirm, onCancel, busy
   ========================================================= */
export function DeleteConfirm({ message, onConfirm, onCancel, busy = false }) {
  return (
    <div>
      <p style={{ marginBottom: 24, color: "var(--txt)", lineHeight: 1.6 }}>{message}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
