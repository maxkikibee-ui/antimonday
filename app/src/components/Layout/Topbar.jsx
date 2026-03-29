import React from 'react';
import { Search, Moon, Bell, Plus, Globe } from 'lucide-react';

const Topbar = () => {
  return (
    <header style={styles.topbar}>
      <div style={styles.searchContainer}>
        <Search size={16} color="#9ca3af" />
        <input
          type="text"
          placeholder="ค้นหาลูกค้า, โครงการ, ไปป์ไลน์การขาย..."
          style={styles.searchInput}
        />
      </div>
      <div style={styles.actions}>
        <div style={styles.langBadge}>
          <Globe size={14} />
          <span>ภาษาไทย</span>
        </div>
        <button style={styles.iconBtn} aria-label="Dark mode">
          <Moon size={18} />
        </button>
        <button style={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} />
          <span style={styles.notifDot}></span>
        </button>
        <img
          src="https://ui-avatars.com/api/?name=NB&background=f97316&color=fff&size=32"
          alt="User"
          style={styles.avatar}
        />
        <button style={styles.addBtn}>
          <Plus size={16} />
          เพิ่มข้อมูลใหม่
        </button>
      </div>
    </header>
  );
};

const styles = {
  topbar: {
    height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb'
  },
  searchContainer: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 14px',
    width: '320px'
  },
  searchInput: {
    border: 'none', background: 'transparent', outline: 'none',
    fontSize: '0.85rem', color: '#374151', width: '100%',
    fontFamily: 'inherit'
  },
  actions: {
    display: 'flex', alignItems: 'center', gap: '12px'
  },
  langBadge: {
    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem',
    color: '#6b7280', padding: '6px 10px', borderRadius: '6px',
    border: '1px solid #e5e7eb', cursor: 'pointer'
  },
  iconBtn: {
    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e5e7eb',
    backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#6b7280', position: 'relative'
  },
  notifDot: {
    position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px',
    borderRadius: '50%', backgroundColor: '#f97316', border: '2px solid #fff'
  },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer'
  },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
    backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit'
  }
};

export default Topbar;
