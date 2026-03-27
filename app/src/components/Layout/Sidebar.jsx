import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Columns, Users, PieChart, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pipeline', label: 'Pipeline', icon: Columns },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <PieChart color="var(--primary-color)" size={28} />
        <span style={styles.logoText}>NexusCRM</span>
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
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: { width: '250px', backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' },
  logoContainer: { padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' },
  logoText: { fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' },
  nav: { padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.2s', borderLeft: '4px solid transparent' },
  navItemActive: { color: 'var(--text-primary)', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderLeftColor: 'var(--primary-color)' },
};

export default Sidebar;
