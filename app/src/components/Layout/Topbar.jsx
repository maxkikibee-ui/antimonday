import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Moon, Bell, Plus, Globe } from 'lucide-react';

const pageNames = {
  '/dashboard': 'ภาพรวมการขาย',
  '/contacts': 'รายชื่อลูกค้า',
  '/pipeline': 'ไปป์ไลน์การขาย',
  '/subscriptions': 'ฐานข้อมูลลูกค้า',
};

const Topbar = () => {
  const location = useLocation();
  const currentPage = pageNames[location.pathname] || 'nobrainpany';

  return (
    <header style={s.topbar}>
      <h1 style={s.title}>{currentPage}</h1>
      <div style={s.right}>
        <div style={s.search}>
          <Search size={14} color="#9ca3af" />
          <input type="text" placeholder="ค้นหาลูกค้า, โครงการ..." style={s.searchInput} />
        </div>
        <div style={s.lang}><Globe size={12} /><span>ภาษาไทย</span></div>
        <button style={s.iconBtn} aria-label="Theme"><Moon size={16} /></button>
        <button style={s.iconBtn} aria-label="Notifications">
          <Bell size={16} />
          <span style={s.dot}></span>
        </button>
        <img src="https://ui-avatars.com/api/?name=NB&background=f97316&color=fff&size=28&bold=true" alt="User" style={s.avatar} />
        <button style={s.addBtn}><Plus size={14} />เพิ่มข้อมูลใหม่</button>
      </div>
    </header>
  );
};

const s = {
  topbar: {
    height: '54px', padding: '0 24px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#fff',
    borderBottom: '1px solid #eef0f2'
  },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#111827' },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  search: {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: '#f9fafb', borderRadius: '8px', padding: '7px 12px',
    width: '220px', border: '1px solid #f3f4f6'
  },
  searchInput: {
    border: 'none', background: 'transparent', outline: 'none',
    fontSize: '0.78rem', color: '#374151', width: '100%', fontFamily: 'inherit'
  },
  lang: {
    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem',
    color: '#6b7280', padding: '5px 8px', borderRadius: '6px',
    border: '1px solid #f3f4f6', cursor: 'pointer', backgroundColor: '#f9fafb'
  },
  iconBtn: {
    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #f3f4f6',
    backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#6b7280', position: 'relative', transition: 'all 0.15s'
  },
  dot: {
    position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px',
    borderRadius: '50%', backgroundColor: '#f97316', border: '1.5px solid #fff'
  },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px',
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }
};

export default Topbar;
