/* =========================================================
   DonationForm.jsx  – Record a donation
   Props: onSave, onClose, items, donors
   ========================================================= */
import { useState, useRef, useEffect } from 'react';
import { todayISO } from '../../utils/helpers';

export function DonationForm({ onSave, onClose, items = [], donors = [] }) {
  const today = todayISO();
  const [form, setForm] = useState({
    date:  today,
    donor: donors[0]?.id ?? '',
    item:  items[0]?.id  ?? '',
    qty:   '',
  });
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  // No items or donors → show empty state
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items in inventory yet.</p>
        <p className="hint">Add items to inventory before recording a donation.</p>
        <div className="form-actions" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  if (donors.length === 0) {
    return (
      <div className="empty-state">
        <p>No donors yet.</p>
        <p className="hint">Add a donor first before recording a donation.</p>
        <div className="form-actions" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.date)           { e.date  = 'Date is required'; }
    else if (form.date > today) { e.date  = 'Date cannot be in the future'; }
    if (!form.donor)          { e.donor = 'Select a donor'; }
    if (!form.item)           { e.item  = 'Select an item'; }
    const q = Number(form.qty);
    if (!form.qty || !Number.isInteger(q) || q <= 0) {
      e.qty = 'Quantity must be a whole number > 0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      date:  form.date,
      donor: Number(form.donor),
      item:  Number(form.item),
      qty:   Number(form.qty),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="don-date">Date <span className="req">*</span></label>
          <input
            id="don-date"
            ref={firstRef}
            type="date"
            max={today}
            className={`form-input${errors.date ? ' error' : ''}`}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        {/* Donor */}
        <div className="form-group">
          <label className="form-label" htmlFor="don-donor">Donor <span className="req">*</span></label>
          <select
            id="don-donor"
            className={`form-select${errors.donor ? ' error' : ''}`}
            value={form.donor}
            onChange={(e) => set('donor', e.target.value)}
          >
            {donors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {errors.donor && <span className="form-error">{errors.donor}</span>}
        </div>

        {/* Item + Qty */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="don-item">Item <span className="req">*</span></label>
            <select
              id="don-item"
              className={`form-select${errors.item ? ' error' : ''}`}
              value={form.item}
              onChange={(e) => set('item', e.target.value)}
            >
              {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            {errors.item && <span className="form-error">{errors.item}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="don-qty">Quantity <span className="req">*</span></label>
            <input
              id="don-qty"
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
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Record donation</button>
      </div>
    </form>
  );
}
