import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Bell, Plus, Globe, X } from 'lucide-react';
import { initialData } from '../../data';

const pageNames = {
  '/dashboard': 'ภาพรวมการขาย',
  '/contacts': 'รายชื่อลูกค้า',
  '/pipeline': 'ไปป์ไลน์การขาย',
  '/subscriptions': 'ฐานข้อมูลลูกค้า',
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = pageNames[location.pathname] || 'nobrainpany';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const searchRef = useRef(null);

  // Search across all data
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const deals = JSON.parse(localStorage.getItem('deals') || 'null') || initialData.deals;
    const contacts = JSON.parse(localStorage.getItem('contacts') || 'null') || initialData.contacts;
    const subs = JSON.parse(localStorage.getItem('subscriptions') || '[]');

    const found = [];
    deals.filter(d => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q))
      .slice(0, 3).forEach(d => found.push({ type: 'deal', label: d.title, sub: d.company, link: '/pipeline' }));
    contacts.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 3).forEach(c => found.push({ type: 'contact', label: c.name, sub: c.company, link: '/contacts' }));
    subs.filter(s => s.email.toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q))
      .slice(0, 3).forEach(s => found.push({ type: 'subscription', label: s.email, sub: s.name || s.servicePlan, link: '/subscriptions' }));
    setResults(found);
  }, [query]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
      setShowNotif(false);
      setShowAddMenu(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Dark mode toggle
  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    const r = document.documentElement.style;
    if (next) {
      r.setProperty('--bg-color', '#0f1117');
      r.setProperty('--card-bg', '#1a1d2e');
      r.setProperty('--text-primary', '#f0f0f5');
      r.setProperty('--text-secondary', '#8b92a5');
      r.setProperty('--border-color', '#2a2e3f');
      r.setProperty('--input-bg', '#1a1d2e');
      r.setProperty('--hover-bg', '#232738');
      r.setProperty('--topbar-bg', '#141622');
    } else {
      r.setProperty('--bg-color', '#f8f9fb');
      r.setProperty('--card-bg', '#ffffff');
      r.setProperty('--text-primary', '#111827');
      r.setProperty('--text-secondary', '#6b7280');
      r.setProperty('--border-color', '#e5e7eb');
      r.setProperty('--input-bg', '#f9fafb');
      r.setProperty('--hover-bg', '#f3f4f6');
      r.setProperty('--topbar-bg', '#ffffff');
    }
    document.body.style.backgroundColor = next ? '#0f1117' : '#f8f9fb';
  };

  // Recent notifications (mock from deals)
  const notifications = [
    { id: 1, text: 'Deal "Cloud Migration" อัพเดทเป็น Proposal Sent', time: '5 นาทีที่แล้ว' },
    { id: 2, text: 'ลูกค้าใหม่ลงทะเบียน: peter@webdev.com', time: '15 นาทีที่แล้ว' },
    { id: 3, text: 'Deal "Video Streaming" ปิดการขายสำเร็จ', time: '1 ชั่วโมงที่แล้ว' },
  ];

  const typeLabels = { deal: '📊 Deal', contact: '👤 Contact', subscription: '💳 Subscription' };

  return (
    <header style={st.topbar}>
      <h1 style={st.title}>{currentPage}</h1>
      <div style={st.right}>
        {/* Search */}
        <div ref={searchRef} style={{ position: 'relative' }}>
          <div style={st.search}>
            <Search size={14} color="#9ca3af" />
            <input type="text" placeholder="ค้นหาลูกค้า, โครงการ..."
              style={st.searchInput} value={query}
              onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
              onFocus={() => query && setShowResults(true)} />
            {query && <button style={st.clearSearch} onClick={() => { setQuery(''); setResults([]); }}><X size={12} /></button>}
          </div>
          {showResults && results.length > 0 && (
            <div style={st.dropdown}>
              {results.map((r, i) => (
                <div key={i} style={st.dropItem} onClick={() => { navigate(r.link); setShowResults(false); setQuery(''); }}>
                  <div style={st.dropType}>{typeLabels[r.type]}</div>
                  <div style={st.dropLabel}>{r.label}</div>
                  <div style={st.dropSub}>{r.sub}</div>
                </div>
              ))}
            </div>
          )}
          {showResults && query && results.length === 0 && (
            <div style={st.dropdown}><div style={{ padding: '14px', color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>ไม่พบผลลัพธ์</div></div>
          )}
        </div>

        <div style={st.lang}><Globe size={12} /><span>TH</span></div>

        {/* Dark mode */}
        <button style={st.iconBtn} onClick={(e) => { e.stopPropagation(); toggleDark(); }} aria-label="Theme">
          {darkMode ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button style={st.iconBtn} onClick={(e) => { e.stopPropagation(); setShowNotif(!showNotif); }} aria-label="Notifications">
            <Bell size={16} /><span style={st.dot}></span>
          </button>
          {showNotif && (
            <div style={st.notifDrop}>
              <div style={st.notifHead}>การแจ้งเตือน ({notifications.length})</div>
              {notifications.map(n => (
                <div key={n.id} style={st.notifItem}>
                  <div style={st.notifText}>{n.text}</div>
                  <div style={st.notifTime}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <img src="https://ui-avatars.com/api/?name=NB&background=f97316&color=fff&size=28&bold=true" alt="User" style={st.avatar} />

        {/* Add new */}
        <div style={{ position: 'relative' }}>
          <button style={st.addBtn} onClick={(e) => { e.stopPropagation(); setShowAddMenu(!showAddMenu); }}>
            <Plus size={14} />เพิ่มข้อมูลใหม่
          </button>
          {showAddMenu && (
            <div style={st.addDrop}>
              <div style={st.addItem} onClick={() => { navigate('/contacts'); setShowAddMenu(false); }}>👤 เพิ่มลูกค้าใหม่</div>
              <div style={st.addItem} onClick={() => { navigate('/pipeline'); setShowAddMenu(false); }}>📊 เพิ่ม Deal ใหม่</div>
              <div style={st.addItem} onClick={() => { navigate('/subscriptions'); setShowAddMenu(false); }}>💳 เพิ่มสมาชิกใหม่</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const st = {
  topbar: { height: '54px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--topbar-bg)', borderBottom: '1px solid var(--border-color)' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  search: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--input-bg)', borderRadius: '8px', padding: '7px 12px', width: '240px', border: '1px solid var(--border-color)', position: 'relative' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem', color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' },
  clearSearch: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '2px', display: 'flex' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', backgroundColor: 'var(--card-bg)', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', overflow: 'hidden', zIndex: 100, minWidth: '280px' },
  dropItem: { padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', transition: 'background 0.1s' },
  dropType: { fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '2px' },
  dropLabel: { fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)' },
  dropSub: { fontSize: '0.72rem', color: 'var(--text-secondary)' },
  lang: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: 'var(--input-bg)' },
  iconBtn: { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative', transition: 'all 0.15s' },
  dot: { position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316', border: '1.5px solid var(--card-bg)' },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(249,115,22,0.3)' },
  notifDrop: { position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', width: '300px', zIndex: 100 },
  notifHead: { padding: '12px 16px', fontWeight: '600', fontSize: '0.82rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
  notifItem: { padding: '12px 16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' },
  notifText: { fontSize: '0.78rem', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: '1.4' },
  notifTime: { fontSize: '0.68rem', color: 'var(--text-secondary)' },
  addDrop: { position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--card-bg)', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', overflow: 'hidden', zIndex: 100, minWidth: '180px' },
  addItem: { padding: '10px 16px', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' },
};

export default Topbar;
