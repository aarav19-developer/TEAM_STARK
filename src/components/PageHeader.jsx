/* =========================================================
   PageHeader.jsx  – Consistent page title + subtitle
   Props: title, subtitle, children (action buttons)
   ========================================================= */
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div>}
    </div>
  );
}
