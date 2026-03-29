import React from 'react';

const Topbar = () => {
  return (
    <header style={styles.topbar}>
      <h1 style={styles.title}>CRM Pipeline</h1>
      <div style={styles.profile}>
        <img src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff" alt="User" style={styles.avatar} />
      </div>
    </header>
  );
};

const styles = {
  topbar: { height: '70px', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' },
  title: { fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' },
  profile: { display: 'flex', alignItems: 'center' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' },
};

export default Topbar;
