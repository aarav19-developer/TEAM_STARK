/* =========================================================
   DistributionForm.jsx  – Record a distribution
   Props: onSave, onClose, items, existingDistributions
   ========================================================= */
import { useState, useRef, useEffect } from 'react';
import { todayISO } from '../../utils/helpers';

export function DistributionForm({ onSave, onClose, items = [] }) {
  const today = todayISO();
  const [form, setForm] = useState({
    date: today,
    ben:  '',
    item: items[0]?.id ?? '',
    qty:  '',
  });
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items in inventory yet.</p>
        <p className="hint">Add items to inventory before recording a distribution.</p>
        <div className="form-actions" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const selectedItem = items.find((i) => i.id === Number(form.item));

  const validate = () => {
    const e = {};
    if (!form.date)             { e.date = 'Date is required'; }
    else if (form.date > today) { e.date = 'Date cannot be in the future'; }
    if (!form.ben.trim())       { e.ben  = 'Beneficiary name is required'; }
    if (!form.item)             { e.item = 'Select an item'; }
    const q = Number(form.qty);
    if (!form.qty || !Number.isInteger(q) || q <= 0) {
      e.qty = 'Quantity must be a whole number > 0';
    } else if (selectedItem && q > selectedItem.qty) {
      e.qty = `Only ${selectedItem.qty} ${selectedItem.unit} of "${selectedItem.name}" in stock.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      date: form.date,
      ben:  form.ben.trim(),
      item: Number(form.item),
      qty:  Number(form.qty),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="dist-date">Date <span className="req">*</span></label>
          <input
            id="dist-date"
            ref={firstRef}
            type="date"
            max={today}
            className={`form-input${errors.date ? ' error' : ''}`}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        {/* Beneficiary */}
        <div className="form-group">
          <label className="form-label" htmlFor="dist-ben">Beneficiary <span className="req">*</span></label>
          <input
            id="dist-ben"
            className={`form-input${errors.ben ? ' error' : ''}`}
            value={form.ben}
            onChange={(e) => set('ben', e.target.value)}
            placeholder="e.g. Sunrise Shelter"
            autoComplete="off"
          />
          {errors.ben && <span className="form-error">{errors.ben}</span>}
        </div>

        {/* Item + Qty */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="dist-item">Item <span className="req">*</span></label>
            <select
              id="dist-item"
              className={`form-select${errors.item ? ' error' : ''}`}
              value={form.item}
              onChange={(e) => set('item', e.target.value)}
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.qty} {i.unit})
                </option>
              ))}
            </select>
            {errors.item && <span className="form-error">{errors.item}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dist-qty">Quantity <span className="req">*</span></label>
            <input
              id="dist-qty"
              type="number"
              min="1"
              step="1"
              className={`form-input${errors.qty ? ' error' : ''}`}
              value={form.qty}
              onChange={(e) => set('qty', e.target.value)}
              placeholder="0"
            />
            {errors.qty && <span className="form-error">{errors.qty}</span>}
          </div>
        </div>

        {/* Live stock hint */}
        {selectedItem && (
          <p style={{ fontSize: 12, color: 'var(--mut)' }}>
            Available: <strong>{selectedItem.qty} {selectedItem.unit}</strong>
          </p>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Record distribution</button>
      </div>
    </form>
  );
}
