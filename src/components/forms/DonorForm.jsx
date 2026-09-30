/* =========================================================
   DonorForm.jsx  – Add / Edit donor
   Props: donor (null = add), onSave, onClose, existingDonors
   ========================================================= */
import { useState, useRef, useEffect } from 'react';
import { validatePhone, isDuplicateName } from '../../utils/helpers';

export function DonorForm({ donor, onSave, onClose, existingDonors = [] }) {
  const isEdit = !!donor;
  const [form, setForm] = useState({
    name:  donor?.name  ?? '',
    phone: donor?.phone ?? '',
  });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = 'Name is required';
    } else if (isDuplicateName(existingDonors, form.name, isEdit ? donor.id : null)) {
      e.name = 'A donor with this name already exists';
    }
    if (!validatePhone(form.phone)) {
      e.phone = 'Phone must be 10 digits (spaces allowed)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(isEdit ? { id: donor.id } : {}),
      name:  form.name.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="donor-name">Full name <span className="req">*</span></label>
          <input
            id="donor-name"
            ref={nameRef}
            className={`form-input${errors.name ? ' error' : ''}`}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Anita Sharma"
            autoComplete="off"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="donor-phone">Phone number <span style={{ color: 'var(--mut)', fontWeight: 400 }}>(optional)</span></label>
          <input
            id="donor-phone"
            type="tel"
            className={`form-input${errors.phone ? ' error' : ''}`}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="10-digit mobile number"
            maxLength={12}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEdit ? 'Save changes' : 'Add donor'}</button>
      </div>
    </form>
  );
}
