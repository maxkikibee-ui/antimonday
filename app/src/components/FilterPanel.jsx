import React from 'react';
import { Filter, X } from 'lucide-react';
import { VALID_STATUSES, VALID_PLANS } from '../utils/integrationService';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const handleStatusToggle = (status) => {
    const cur = filters.status || [];
    onFilterChange({ ...filters, status: cur.includes(status) ? cur.filter(s => s !== status) : [...cur, status] });
  };
  const handlePlanToggle = (plan) => {
    const cur = filters.plans || [];
    onFilterChange({ ...filters, plans: cur.includes(plan) ? cur.filter(p => p !== plan) : [...cur, plan] });
  };
  const hasActive = (filters.status?.length > 0) || (filters.plans?.length > 0);

  return (
    <div style={s.panel}>
      <div style={s.header}>
        <div style={s.title}><Filter size={15} /><span>ตัวกรอง</span></div>
        {hasActive && <button style={s.clearBtn} onClick={onClearFilters}><X size={13} />ล้าง</button>}
      </div>
      <div style={s.section}>
        <div style={s.sectionTitle}>สถานะ</div>
        {VALID_STATUSES.map(status => (
          <label key={status} style={s.checkbox}>
            <input type="checkbox" checked={(filters.status || []).includes(status)} onChange={() => handleStatusToggle(status)} style={s.check} />
            <span>{status}</span>
          </label>
        ))}
      </div>
      <div style={s.section}>
        <div style={s.sectionTitle}>แผนบริการ</div>
        {VALID_PLANS.map(plan => (
          <label key={plan} style={s.checkbox}>
            <input type="checkbox" checked={(filters.plans || []).includes(plan)} onChange={() => handlePlanToggle(plan)} style={s.check} />
            <span>{plan}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const s = {
  panel: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  title: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' },
  clearBtn: { display: 'flex', alignItems: 'center', gap: '3px', padding: '4px 8px', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--input-bg)', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  section: { marginBottom: '14px' },
  sectionTitle: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  checkbox: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', padding: '4px 0', color: 'var(--text-primary)' },
  check: { accentColor: '#f97316' }
};

export default FilterPanel;
