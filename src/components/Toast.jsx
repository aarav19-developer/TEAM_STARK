/* =========================================================
   Toast.jsx  – Auto-hide toast notifications
   Usage: <Toast toasts={toasts} />
   Manage toasts in parent state: [{id, msg, type}]
   ========================================================= */
import { useEffect } from 'react';
import { Icon } from './Icons';

export function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 2000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const iconName = toast.type === 'error' ? 'warning' : 'check';

  return (
    <div className={`toast ${toast.type || 'success'}`} role="status">
      <Icon name={iconName} size={15} />
      {toast.msg}
    </div>
  );
}

/* ---- Helper hook for managing toasts ---- */
import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
