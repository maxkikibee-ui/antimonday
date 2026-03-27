import React from 'react';
import { Filter, X } from 'lucide-react';
import { VALID_STATUSES, VALID_PLANS } from '../utils/integrationService';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const handleStatusToggle = (status) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    onFilterChange({ ...filters, status: newStatuses });
  };

  const handlePlanToggle = (plan) => {
    const currentPlans = filters.plans || [];
    const newPlans = currentPlans.includes(plan)
      ? currentPlans.filter(p => p !== plan)
      : [...currentPlans, plan];
    onFilterChange({ ...filters, plans: newPlans });
  };

  const hasActiveFilters = (filters.status && filters.status.length > 0) || (filters.plans && filters.plans.length > 0);

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.title}>
          <Filter size={16} />
          <span>ตัวกรอง</span>
        </div>
        {hasActiveFilters && (
          <button style={styles.clearBtn} onClick={onClearFilters}>
            <X size={14} />
            ล้างตัวกรอง
          </button>
        )}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>สถานะ</div>
        <div style={styles.checkboxGroup}>
          {VALID_STATUSES.map(status => (
            <label key={status} style={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.status || []).includes(status)}
                onChange={() => handleStatusToggle(status)}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>แผนบริการ</div>
        <div style={styles.checkboxGroup}>
          {VALID_PLANS.map(plan => (
            <label key={plan} style={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.plans || []).includes(plan)}
                onChange={() => handlePlanToggle(plan)}
              />
              <span>{plan}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  panel: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  }
};

export default FilterPanel;
