/* =========================================================
   ItemForm.jsx  – Add / Edit inventory item
   Props: item (null = add), onSave, onClose, existingItems
   ========================================================= */
import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../../data/seedData';
import { isDuplicateName } from '../../utils/helpers';

export function ItemForm({ item, onSave, onClose, existingItems = [] }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    name: item?.name ?? '',
    cat:  item?.cat  ?? CATEGORIES[0],
    qty:  item?.qty  ?? '',
    unit: item?.unit ?? 'pcs',
    min:  item?.min  ?? '',
    exp:  item?.exp  ?? '',
  });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) { e.name = 'Name is required'; }
    else if (isDuplicateName(existingItems, form.name, isEdit ? item.id : null)) {
      e.name = 'An item with this name already exists';
    }
    if (form.qty === '' || isNaN(Number(form.qty)) || !Number.isInteger(Number(form.qty)) || Number(form.qty) < 0) {
      e.qty = 'Quantity must be a whole number ≥ 0';
    }
    if (form.min === '' || isNaN(Number(form.min)) || !Number.isInteger(Number(form.min)) || Number(form.min) < 0) {
      e.min = 'Min stock must be a whole number ≥ 0';
    }
    if (!form.unit.trim()) { e.unit = 'Unit is required'; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(isEdit ? { id: item.id } : {}),
      name: form.name.trim(),
      cat:  form.cat,
      qty:  Number(form.qty),
      unit: form.unit.trim(),
      min:  Number(form.min),
      exp:  form.exp,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="item-name">Item name <span className="req">*</span></label>
          <input
            id="item-name"
            ref={nameRef}
            className={`form-input${errors.name ? ' error' : ''}`}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Winter Jackets"
            autoComplete="off"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        {/* Category */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="item-cat">Category <span className="req">*</span></label>
            <select id="item-cat" className="form-select" value={form.cat} onChange={(e) => set('cat', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="item-unit">Unit <span className="req">*</span></label>
            <input
              id="item-unit"
              className={`form-input${errors.unit ? ' error' : ''}`}
              value={form.unit}
              onChange={(e) => set('unit', e.target.value)}
              placeholder="pcs / bags / litres"
            />
            {errors.unit && <span className="form-error">{errors.unit}</span>}
          </div>
        </div>

        {/* Qty + Min */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="item-qty">Current qty <span className="req">*</span></label>
            <input
              id="item-qty"
              type="number"
              min="0"
              step="1"
              className={`form-input${errors.qty ? ' error' : ''}`}
              value={form.qty}
              onChange={(e) => set('qty', e.target.value)}
              placeholder="0"
            />
            {errors.qty && <span className="form-error">{errors.qty}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="item-min">Min stock <span className="req">*</span></label>
            <input
              id="item-min"
              type="number"
              min="0"
              step="1"
              className={`form-input${errors.min ? ' error' : ''}`}
              value={form.min}
              onChange={(e) => set('min', e.target.value)}
              placeholder="0"
            />
            {errors.min && <span className="form-error">{errors.min}</span>}
          </div>
        </div>

        {/* Expiry */}
        <div className="form-group">
          <label className="form-label" htmlFor="item-exp">Expiry date <span style={{ color: 'var(--mut)', fontWeight: 400 }}>(optional)</span></label>
          <input
            id="item-exp"
            type="date"
            className="form-input"
            value={form.exp}
            onChange={(e) => set('exp', e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEdit ? 'Save changes' : 'Add item'}</button>
      </div>
    </form>
  );
}
