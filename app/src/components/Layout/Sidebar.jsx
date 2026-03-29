import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Columns, CreditCard, Database, Settings, ChevronDown } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'การขาย แผนที่ลูกค้า', icon: LayoutDashboard },
    { path: '/contacts', label: 'จดหมายข่าว/พลาซ่า', icon: Users },
    { path: '/pipeline', label: 'ไปป์ไลน์/พลาซ่า', icon: Columns },
    { path: '/subscriptions', label: 'ฐานข้อมูลลูกค้า', icon: Database },
  ];

  const subItems = [
    { path: '/subscriptions', label: 'ข้อมูลการเชื่อม\nต่างๆ/สมาชิก', icon: CreditCard, hasChevron: true },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <span style={styles.logoLetter}>n</span>
        </div>
        <span style={styles.logoText}>nobrainpany.</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive && item.path === '/dashboard' ? styles.navItemActive : {}),
            })}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {subItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={() => styles.navItem}
          >
            <item.icon size={18} />
            <span style={{ flex: 1, whiteSpace: 'pre-line', lineHeight: '1.3' }}>{item.label}</span>
            {item.hasChevron && <ChevronDown size={14} />}
          </NavLink>
        ))}
      </nav>
      <div style={styles.bottomNav}>
        <NavLink to="/dashboard" style={() => styles.navItem}>
          <Settings size={18} />
          <span>บริการของเรา</span>
        </NavLink>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column',
    color: '#ffffff', minHeight: '100vh'
  },
  logoContainer: {
    padding: '20px 20px 24px', display: 'flex', alignItems: 'center', gap: '10px'
  },
  logoIcon: {
    width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f97316',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  logoLetter: {
    color: '#fff', fontWeight: '700', fontSize: '1.1rem'
  },
  logoText: {
    fontSize: '1.1rem', fontWeight: '600', color: '#ffffff'
  },
  nav: {
    padding: '0', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1
  },
  navItem: {
    padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px',
    color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '400',
    transition: 'all 0.2s', borderRadius: '0'
  },
  navItemActive: {
    color: '#ffffff', backgroundColor: '#f97316', borderRadius: '8px',
    margin: '0 8px', padding: '10px 12px'
  },
  bottomNav: {
    borderTop: '1px solid #2a2a2a', padding: '8px 0'
  }
};

export default Sidebar;
