/* =========================================================
   Donors.jsx  – Donor directory with add/edit/delete
   ========================================================= */
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader }  from '../components/PageHeader';
import { Modal }       from '../components/Modal';
import { Toast, useToast } from '../components/Toast';
import { Icon }        from '../components/Icons';
import { DonorForm }   from '../components/forms/DonorForm';
import { DeleteConfirm } from '../components/forms/DeleteConfirm';

export default function Donors() {
  const { state, dispatch } = useApp();
  const { donors, donations, items } = state;
  const { toasts, showToast, removeToast } = useToast();

  const [search, setSearch] = useState('');
  const [modal,  setModal]  = useState(null);
  const [target, setTarget] = useState(null);

  const filtered = useMemo(() =>
    donors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
  [donors, search]);

  /* Donor stats */
  const donorStats = useMemo(() => {
    const map = {};
    donations.forEach((d) => {
      if (!map[d.donor]) map[d.donor] = { count: 0, totalItems: 0 };
      map[d.donor].count++;
      map[d.donor].totalItems += d.qty;
    });
    return map;
  }, [donations]);

  const initials = (name) =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const handleAdd = (data) => {
    dispatch({ type: 'ADD_DONOR', payload: data });
    setModal(null);
    showToast('Donor added');
  };
  const handleEdit = (data) => {
    dispatch({ type: 'EDIT_DONOR', payload: data });
    setModal(null);
    showToast('Donor updated');
  };
  const handleDelete = () => {
    const hasDonations = donations.some((d) => d.donor === target.id);
    if (hasDonations) {
      showToast('Cannot delete — donor has existing donations', 'error');
      setModal(null);
      return;
    }
    dispatch({ type: 'DELETE_DONOR', id: target.id });
    setModal(null);
    showToast('Donor deleted', 'error');
  };

  return (
    <>
      <PageHeader title="Donors" subtitle="People and organisations who donate to your NGO.">
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Icon name="plus" size={16} /> Add donor
        </button>
      </PageHeader>

      <div className="page-toolbar">
        <div className="search-bar">
          <Icon name="search" size={15} />
          <input
            className="search-input"
            placeholder="Search donors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search donors"
          />
        </div>
        <span style={{ color: 'var(--mut)', fontSize: 13 }}>{filtered.length} donors</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Icon name="donors" size={40} />
            <p>No donors found.</p>
            <p className="hint">Add your first donor to get started.</p>
          </div>
        </div>
      ) : (
        <div className="donors-grid">
          {filtered.map((donor) => {
            const stats = donorStats[donor.id] || { count: 0, totalItems: 0 };
            return (
              <div key={donor.id} className="card donor-card">
                <div className="donor-avatar">{initials(donor.name)}</div>
                <div className="donor-info">
                  <h3>{donor.name}</h3>
                  {donor.phone && (
                    <p className="donor-phone">
                      <Icon name="phone" size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {donor.phone}
                    </p>
                  )}
                  <div className="donor-stats">
                    <div className="donor-stat">
                      <strong>{stats.count}</strong>
                      Donations
                    </div>
                    <div className="donor-stat">
                      <strong>{stats.totalItems}</strong>
                      Total items
                    </div>
                  </div>
                </div>
                <div className="donor-actions">
                  <button
                    className="btn-icon"
                    onClick={() => { setTarget(donor); setModal('edit'); }}
                    aria-label={`Edit ${donor.name}`}
                  >
                    <Icon name="edit" size={15} />
                  </button>
                  <button
                    className="btn-icon"
                    style={{ color: 'var(--rose)' }}
                    onClick={() => { setTarget(donor); setModal('delete'); }}
                    aria-label={`Delete ${donor.name}`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Add donor">
        <DonorForm onSave={handleAdd} onClose={() => setModal(null)} existingDonors={donors} />
      </Modal>
      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit donor">
        {target && (
          <DonorForm
            donor={target}
            onSave={handleEdit}
            onClose={() => setModal(null)}
            existingDonors={donors}
          />
        )}
      </Modal>
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete donor">
        <DeleteConfirm
          message={`Remove "${target?.name}" from your donor list? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
