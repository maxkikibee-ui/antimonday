import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Columns, CreditCard, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'ภาพรวมการขาย', icon: LayoutDashboard },
    { path: '/contacts', label: 'รายชื่อลูกค้า', icon: Users },
    { path: '/pipeline', label: 'ไปป์ไลน์การขาย', icon: Columns },
    { path: '/subscriptions', label: 'ฐานข้อมูลลูกค้า', icon: CreditCard },
  ];

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoIcon}><span style={s.logoLetter}>n</span></div>
        <span style={s.logoText}>nobrainpany.</span>
      </div>
      <nav style={s.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...s.navItem,
              ...(isActive ? s.active : {}),
            })}
          >
            <item.icon size={17} strokeWidth={isActive => isActive ? 2.2 : 1.8} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={s.bottom}>
        <div style={s.navItem}><Settings size={17} /><span>ตั้งค่าระบบ</span></div>
      </div>
    </aside>
  );
};

const s = {
  sidebar: {
    width: '220px', background: 'linear-gradient(180deg, #111111 0%, #1a1a1a 100%)',
    display: 'flex', flexDirection: 'column', color: '#fff', minHeight: '100vh',
    borderRight: '1px solid #222'
  },
  logo: { padding: '22px 18px 28px', display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: {
    width: '30px', height: '30px', borderRadius: '8px',
    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(249,115,22,0.3)'
  },
  logoLetter: { color: '#fff', fontWeight: '700', fontSize: '1rem' },
  logoText: { fontSize: '1.05rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.01em' },
  nav: { padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  navItem: {
    padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '10px',
    color: '#71717a', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '400',
    borderRadius: '8px', transition: 'all 0.15s', cursor: 'pointer'
  },
  active: {
    color: '#fff', backgroundColor: '#f97316',
    fontWeight: '500',
    boxShadow: '0 2px 8px rgba(249,115,22,0.25)'
  },
  bottom: { borderTop: '1px solid #262626', padding: '10px' },
};

export default Sidebar;
