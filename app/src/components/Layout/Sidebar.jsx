import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Columns, CreditCard, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'การขาย แผนที่ลูกค้า', icon: LayoutDashboard },
    { path: '/contacts', label: 'จดหมายข่าว/พลาซ่า', icon: Users },
    { path: '/pipeline', label: 'ไปป์ไลน์/พลาซ่า', icon: Columns },
    { path: '/subscriptions', label: 'ฐานข้อมูลลูกค้า', icon: CreditCard },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}><span style={styles.logoLetter}>n</span></div>
        <span style={styles.logoText}>nobrainpany.</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={styles.bottomNav}>
        <div style={styles.navItem}>
          <Settings size={18} />
          <span>ตั้งค่าระบบ</span>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: { width: '240px', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', color: '#fff', minHeight: '100vh' },
  logoContainer: { padding: '20px 20px 24px', display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: '#fff', fontWeight: '700', fontSize: '1.1rem' },
  logoText: { fontSize: '1.1rem', fontWeight: '600', color: '#fff' },
  nav: { padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  navItem: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '400', borderRadius: '8px', transition: 'all 0.2s', cursor: 'pointer' },
  navItemActive: { color: '#fff', backgroundColor: '#f97316' },
  bottomNav: { borderTop: '1px solid #2a2a2a', padding: '8px' },
};

export default Sidebar;
