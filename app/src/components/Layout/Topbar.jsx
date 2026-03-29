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
      <div style={s.left}>
        <h1 style={s.pageTitle}>{currentPage}</h1>
      </div>
      <div style={s.right}>
        <div style={s.searchBox}>
          <Search size={15} color="#9ca3af" />
          <input type="text" placeholder="ค้นหาลูกค้า, โครงการ..." style={s.searchInput} />
        </div>
        <div style={s.langBadge}><Globe size={13} /><span>ภาษาไทย</span></div>
        <button style={s.iconBtn} aria-label="Dark mode"><Moon size={17} /></button>
        <button style={s.iconBtn} aria-label="Notifications">
          <Bell size={17} />
          <span style={s.notifDot}></span>
        </button>
        <img src="https://ui-avatars.com/api/?name=NB&background=f97316&color=fff&size=32" alt="User" style={s.avatar} />
        <button style={s.addBtn}><Plus size={15} />เพิ่มข้อมูลใหม่</button>
      </div>
    </header>
  );
};

const s = {
  topbar: { height: '56px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' },
  left: { display: 'flex', alignItems: 'center' },
  pageTitle: { fontSize: '1.05rem', fontWeight: '600', color: '#1a1a1a' },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '7px 12px', width: '240px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: '#374151', width: '100%', fontFamily: 'inherit' },
  langBadge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#6b7280', padding: '5px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', cursor: 'pointer' },
  iconBtn: { width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', position: 'relative' },
  notifDot: { position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f97316', border: '2px solid #fff' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }
};

export default Topbar;
