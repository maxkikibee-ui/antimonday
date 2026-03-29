import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

const ExportButton = ({ onExport }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format) => {
    setLoading(true); setShowDropdown(false);
    try {
      const data = onExport(format);
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscriptions_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) { alert('เกิดข้อผิดพลาดในการ export'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button style={s.btn} onClick={() => setShowDropdown(!showDropdown)} disabled={loading}>
        <Download size={14} />{loading ? 'กำลัง Export...' : 'Export'}<ChevronDown size={12} />
      </button>
      {showDropdown && (
        <div style={s.dropdown}>
          <button style={s.item} onClick={() => handleExport('json')}>Export JSON</button>
          <button style={s.item} onClick={() => handleExport('csv')}>Export CSV</button>
        </div>
      )}
    </div>
  );
};

const s = {
  btn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#374151', cursor: 'pointer', fontWeight: '500', fontSize: '0.8rem', fontFamily: 'inherit' },
  dropdown: { position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 10, minWidth: '140px' },
  item: { width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#374151', fontFamily: 'inherit' }
};

export default ExportButton;
