import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

const ExportButton = ({ onExport }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format) => {
    setLoading(true);
    setShowDropdown(false);
    
    try {
      const data = onExport(format);
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscriptions_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('เกิดข้อผิดพลาดในการ export ข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button 
        style={styles.button} 
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
      >
        <Download size={16} />
        {loading ? 'กำลัง Export...' : 'Export'}
        <ChevronDown size={14} />
      </button>
      
      {showDropdown && (
        <div style={styles.dropdown}>
          <button style={styles.dropdownItem} onClick={() => handleExport('json')}>
            Export as JSON
          </button>
          <button style={styles.dropdownItem} onClick={() => handleExport('csv')}>
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '4px',
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 10,
    minWidth: '160px'
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    transition: 'background-color 0.2s'
  }
};

export default ExportButton;
