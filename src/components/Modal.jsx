/* =========================================================
   Modal.jsx  – Accessible modal dialog with focus trap
   Props: open, onClose, title, children, maxWidth
   ========================================================= */
import { useEffect, useRef } from 'react';
import { Icon } from './Icons';

export function Modal({ open, onClose, title, children, maxWidth = 480 }) {
  const overlayRef = useRef(null);
  const firstFocusRef = useRef(null);

  // Focus trap + ESC close
  useEffect(() => {
    if (!open) return;

    // Focus first focusable element
    const modal = overlayRef.current?.querySelector('[data-modal-body]');
    const focusable = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      firstFocusRef.current = focusable[0];
      focusable[0].focus();
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      aria-modal="true"
    >
      <div
        className="modal"
        role="dialog"
        aria-labelledby="modal-title"
        style={{ maxWidth }}
        data-modal-body=""
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
