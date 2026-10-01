/* =========================================================
   Inventory.jsx  – Item list with search, filter, sort, CRUD
   ========================================================= */
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader }  from '../components/PageHeader';
import { Modal }       from '../components/Modal';
import { Toast, useToast } from '../components/Toast';
import { StockPill, ExpiryBadge } from '../components/StatusPill';
import { Icon }        from '../components/Icons';
import { ItemForm }    from '../components/forms/ItemForm';
import { DeleteConfirm } from '../components/forms/DeleteConfirm';
import { fmtDate, sortBy, toCSV, downloadCSV } from '../utils/helpers';
import { CATEGORIES }  from '../data/seedData';

export default function Inventory() {
  const { state, dispatch } = useApp();
  const { items } = state;
  const { toasts, showToast, removeToast } = useToast();

  /* UI state */
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState('All');
  const [sort,     setSort]     = useState({ key: 'name', dir: 'asc' });
  const [modal,    setModal]    = useState(null); // null | 'add' | 'edit' | 'delete'
  const [target,   setTarget]   = useState(null); // item being acted on

  /* Filtered + sorted list */
  const filtered = useMemo(() => {
    let list = items;
    if (search.trim())           list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'All')     list = list.filter((i) => i.cat === catFilter);
    return [...list].sort((a, b) => sortBy(a, b, sort.key, sort.dir));
  }, [items, search, catFilter, sort]);

  /* Sort toggle */
  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const sortIcon = (key) => {
    if (sort.key !== key) return '↕';
    return sort.dir === 'asc' ? '↑' : '↓';
  };

  /* Actions */
  const handleAdd = (data) => {
    dispatch({ type: 'ADD_ITEM', payload: data });
    setModal(null);
    showToast('Item added successfully');
  };
  const handleEdit = (data) => {
    dispatch({ type: 'EDIT_ITEM', payload: data });
    setModal(null);
    showToast('Item updated');
  };
  const handleDelete = () => {
    dispatch({ type: 'DELETE_ITEM', id: target.id });
    setModal(null);
    showToast('Item deleted', 'error');
  };

  /* CSV export */
  const exportCSV = () => {
    const csv = toCSV(filtered, [
      { label: 'Name',     getValue: (r) => r.name },
      { label: 'Category', getValue: (r) => r.cat },
      { label: 'Qty',      getValue: (r) => r.qty },
      { label: 'Unit',     getValue: (r) => r.unit },
      { label: 'Min Stock',getValue: (r) => r.min },
      { label: 'Expiry',   getValue: (r) => r.exp || '' },
    ]);
    downloadCSV('inventory.csv', csv);
  };

  return (
    <>
      <PageHeader title="Inventory" subtitle="Manage your donated goods and stock levels.">
        <button className="btn btn-ghost btn-sm" onClick={exportCSV} aria-label="Export CSV">
          <Icon name="download" size={15} /> Export CSV
        </button>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Icon name="plus" size={16} /> Add item
        </button>
      </PageHeader>

      {/* Toolbar */}
      <div className="page-toolbar">
        <div className="search-bar">
          <Icon name="search" size={15} />
          <input
            className="search-input"
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search inventory"
          />
        </div>
        <select
          className="filter-select"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span style={{ color: 'var(--mut)', fontSize: 13 }}>{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="box" size={40} />
            <p>No items found.</p>
            <p className="hint">Try a different search or add a new item.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort('name')}>
                    Item <span className="sort-icon">{sortIcon('name')}</span>
                  </th>
                  <th className="sortable" onClick={() => toggleSort('cat')}>
                    Category <span className="sort-icon">{sortIcon('cat')}</span>
                  </th>
                  <th className="sortable" onClick={() => toggleSort('qty')}>
                    Qty <span className="sort-icon">{sortIcon('qty')}</span>
                  </th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Item" style={{ fontWeight: 600 }}>{item.name}</td>
                    <td data-label="Category">{item.cat}</td>
                    <td data-label="Qty">{item.qty}</td>
                    <td data-label="Unit" style={{ color: 'var(--mut)' }}>{item.unit}</td>
                    <td data-label="Status"><StockPill item={item} /></td>
                    <td data-label="Expiry">
                      {item.exp ? (
                        <>
                          <span style={{ fontSize: 13 }}>{fmtDate(item.exp)}</span>{' '}
                          <ExpiryBadge item={item} />
                        </>
                      ) : <span style={{ color: 'var(--mut)' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn-icon"
                          onClick={() => { setTarget(item); setModal('edit'); }}
                          aria-label={`Edit ${item.name}`}
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ color: 'var(--rose)' }}
                          onClick={() => { setTarget(item); setModal('delete'); }}
                          aria-label={`Delete ${item.name}`}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Add item">
        <ItemForm onSave={handleAdd} onClose={() => setModal(null)} existingItems={items} />
      </Modal>
      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit item">
        {target && (
          <ItemForm
            item={target}
            onSave={handleEdit}
            onClose={() => setModal(null)}
            existingItems={items}
          />
        )}
      </Modal>
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete item">
        <DeleteConfirm
          message={`Delete "${target?.name}"? Past donation and distribution records referencing this item will show "—".`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
