/* =========================================================
   Donations.jsx  – Donation log with sort, delete, CSV
   ========================================================= */
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader }  from '../components/PageHeader';
import { Modal }       from '../components/Modal';
import { Toast, useToast } from '../components/Toast';
import { Icon }        from '../components/Icons';
import { DonationForm }  from '../components/forms/DonationForm';
import { DeleteConfirm } from '../components/forms/DeleteConfirm';
import { fmtDate, sortBy, toCSV, downloadCSV } from '../utils/helpers';

export default function Donations() {
  const { state, dispatch } = useApp();
  const { donations, items, donors } = state;
  const { toasts, showToast, removeToast } = useToast();

  const [sort,  setSort]  = useState({ key: 'date', dir: 'desc' });
  const [modal, setModal] = useState(null);
  const [target,setTarget]= useState(null);

  /* Enrich donations with names */
  const rows = useMemo(() =>
    [...donations]
      .map((d) => ({
        ...d,
        donorName: donors.find((x) => x.id === d.donor)?.name ?? '—',
        itemName:  items.find((x)  => x.id === d.item)?.name  ?? '—',
        unit:      items.find((x)  => x.id === d.item)?.unit  ?? '',
      }))
      .sort((a, b) => sortBy(a, b, sort.key, sort.dir)),
  [donations, donors, items, sort]);

  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const si = (key) => sort.key === key ? (sort.dir === 'asc' ? '↑' : '↓') : '↕';

  const handleAdd = (data) => {
    dispatch({ type: 'ADD_DONATION', payload: data });
    setModal(null);
    showToast('Donation recorded');
  };
  const handleDelete = () => {
    dispatch({ type: 'DELETE_DONATION', id: target.id });
    setModal(null);
    showToast('Donation deleted — stock reversed', 'error');
  };

  const exportCSV = () => {
    const csv = toCSV(rows, [
      { label: 'Date',     getValue: (r) => r.date },
      { label: 'Donor',    getValue: (r) => r.donorName },
      { label: 'Item',     getValue: (r) => r.itemName },
      { label: 'Qty',      getValue: (r) => r.qty },
      { label: 'Unit',     getValue: (r) => r.unit },
    ]);
    downloadCSV('donations.csv', csv);
  };

  return (
    <>
      <PageHeader title="Donations" subtitle="Incoming donations from donors.">
        <button className="btn btn-ghost btn-sm" onClick={exportCSV} aria-label="Export CSV">
          <Icon name="download" size={15} /> Export CSV
        </button>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Icon name="plus" size={16} /> Record donation
        </button>
      </PageHeader>

      <div className="card">
        {rows.length === 0 ? (
          <div className="empty-state">
            <Icon name="donations" size={40} />
            <p>No donations recorded yet.</p>
            <p className="hint">Click "Record donation" to add the first one.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort('date')}>Date <span className="sort-icon">{si('date')}</span></th>
                  <th className="sortable" onClick={() => toggleSort('donorName')}>Donor <span className="sort-icon">{si('donorName')}</span></th>
                  <th className="sortable" onClick={() => toggleSort('itemName')}>Item <span className="sort-icon">{si('itemName')}</span></th>
                  <th className="sortable" onClick={() => toggleSort('qty')}>Qty <span className="sort-icon">{si('qty')}</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{fmtDate(row.date)}</td>
                    <td>{row.donorName}</td>
                    <td>{row.itemName}</td>
                    <td>{row.qty} <span style={{ color: 'var(--mut)', fontSize: 12 }}>{row.unit}</span></td>
                    <td>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--rose)' }}
                        onClick={() => { setTarget(row); setModal('delete'); }}
                        aria-label="Delete donation"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Record donation">
        <DonationForm
          onSave={handleAdd}
          onClose={() => setModal(null)}
          items={items}
          donors={donors}
        />
      </Modal>
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete donation">
        <DeleteConfirm
          message="Delete this donation? The stock quantity will be reversed."
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
