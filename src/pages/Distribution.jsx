/* =========================================================
   Distribution.jsx  – Distribution log with sort, delete, CSV
   ========================================================= */
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader }    from '../components/PageHeader';
import { Modal }         from '../components/Modal';
import { Toast, useToast } from '../components/Toast';
import { Icon }          from '../components/Icons';
import { DistributionForm } from '../components/forms/DistributionForm';
import { DeleteConfirm } from '../components/forms/DeleteConfirm';
import { fmtDate, sortBy, toCSV, downloadCSV } from '../utils/helpers';

export default function Distribution() {
  const { state, dispatch } = useApp();
  const { distributions, items } = state;
  const { toasts, showToast, removeToast } = useToast();

  const [sort,  setSort]  = useState({ key: 'date', dir: 'desc' });
  const [modal, setModal] = useState(null);
  const [target,setTarget]= useState(null);

  /* Enrich rows */
  const rows = useMemo(() =>
    [...distributions]
      .map((d) => ({
        ...d,
        itemName: items.find((x) => x.id === d.item)?.name ?? '—',
        unit:     items.find((x) => x.id === d.item)?.unit ?? '',
      }))
      .sort((a, b) => sortBy(a, b, sort.key, sort.dir)),
  [distributions, items, sort]);

  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const si = (key) => sort.key === key ? (sort.dir === 'asc' ? '↑' : '↓') : '↕';

  const handleAdd = (data) => {
    dispatch({ type: 'ADD_DISTRIBUTION', payload: data });
    setModal(null);
    showToast('Distribution recorded');
  };
  const handleDelete = () => {
    dispatch({ type: 'DELETE_DISTRIBUTION', id: target.id });
    setModal(null);
    showToast('Distribution deleted — stock restored', 'error');
  };

  const exportCSV = () => {
    const csv = toCSV(rows, [
      { label: 'Date',         getValue: (r) => r.date },
      { label: 'Beneficiary',  getValue: (r) => r.ben },
      { label: 'Item',         getValue: (r) => r.itemName },
      { label: 'Qty',          getValue: (r) => r.qty },
      { label: 'Unit',         getValue: (r) => r.unit },
    ]);
    downloadCSV('distributions.csv', csv);
  };

  return (
    <>
      <PageHeader title="Distribution" subtitle="Items distributed to beneficiaries.">
        <button className="btn btn-ghost btn-sm" onClick={exportCSV} aria-label="Export CSV">
          <Icon name="download" size={15} /> Export CSV
        </button>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Icon name="plus" size={16} /> Record distribution
        </button>
      </PageHeader>

      <div className="card">
        {rows.length === 0 ? (
          <div className="empty-state">
            <Icon name="distribution" size={40} />
            <p>No distributions recorded yet.</p>
            <p className="hint">Click "Record distribution" to log one.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort('date')}>Date <span className="sort-icon">{si('date')}</span></th>
                  <th className="sortable" onClick={() => toggleSort('ben')}>Beneficiary <span className="sort-icon">{si('ben')}</span></th>
                  <th className="sortable" onClick={() => toggleSort('itemName')}>Item <span className="sort-icon">{si('itemName')}</span></th>
                  <th className="sortable" onClick={() => toggleSort('qty')}>Qty <span className="sort-icon">{si('qty')}</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{fmtDate(row.date)}</td>
                    <td>{row.ben}</td>
                    <td>{row.itemName}</td>
                    <td>{row.qty} <span style={{ color: 'var(--mut)', fontSize: 12 }}>{row.unit}</span></td>
                    <td>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--rose)' }}
                        onClick={() => { setTarget(row); setModal('delete'); }}
                        aria-label="Delete distribution"
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

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Record distribution">
        <DistributionForm
          onSave={handleAdd}
          onClose={() => setModal(null)}
          items={items}
        />
      </Modal>
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete distribution">
        <DeleteConfirm
          message="Delete this distribution? The stock quantity will be restored."
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
