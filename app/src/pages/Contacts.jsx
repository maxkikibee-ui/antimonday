import React from 'react';
import { initialData as store } from '../data';
import { Edit2, Plus } from 'lucide-react';

const Contacts = () => {
  return (
    <div className="animate-fade-in">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>All Contacts</h2>
          <button style={styles.btnPrimary}>
            <Plus size={16} /> Add Contact
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.contacts.map(contact => (
              <tr key={contact.id} style={styles.tr}>
                <td style={styles.td}><strong>{contact.name}</strong></td>
                <td style={styles.td}>{contact.company}</td>
                <td style={styles.td}>{contact.email}</td>
                <td style={styles.td}>{contact.phone}</td>
                <td style={styles.td}>
                  <span style={contact.status === 'Active' ? styles.badgeActive : styles.badgeLead}>
                    {contact.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.actionBtn}><Edit2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' },
  header: { padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  btnPrimary: { backgroundColor: 'var(--primary-color)', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '16px 24px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid var(--border-color)' },
  td: { padding: '16px 24px', fontSize: '0.95rem' },
  badgeActive: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' },
  badgeLead: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' },
  actionBtn: { background: 'none', border: 'none', color: 'var(--info)', cursor: 'pointer' }
};

export default Contacts;
