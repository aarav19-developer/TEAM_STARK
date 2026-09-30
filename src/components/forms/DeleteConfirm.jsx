/* =========================================================
   DeleteConfirm.jsx  – Reusable delete confirmation dialog
   Props: message, onConfirm, onCancel
   ========================================================= */
export function DeleteConfirm({ message, onConfirm, onCancel }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: 20, color: 'var(--ink)', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}
