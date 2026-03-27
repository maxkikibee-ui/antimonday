import React, { useState, useEffect } from 'react';
import { initialData } from '../data';
import { Edit2, Plus, Trash2, X } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', status: 'Lead' });

  useEffect(() => {
    const saved = localStorage.getItem('contacts');
    setContacts(saved ? JSON.parse(saved) : initialData.contacts);
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead' });
    setShowModal(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...formData, id: editingContact.id } : c));
    } else {
      const newContact = { ...formData, id: 'c' + Date.now() };
      setContacts([...contacts, newContact]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('ต้องการลบ contact นี้?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>All Contacts</h2>
          <button style={styles.btnPrimary} onClick={openAddModal}>
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
            {contacts.map(contact => (
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
                  <button style={styles.actionBtn} onClick={() => openEditModal(contact)}><Edit2 size={16} /></button>
                  <button style={{...styles.actionBtn, color: 'var(--danger)', marginLeft: '8px'}} onClick={() => handleDelete(contact.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>{editingContact ? 'Edit Contact' : 'Add Contact'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input style={styles.input} placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input style={styles.input} placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
              <input style={styles.input} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input style={styles.input} placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              <select style={styles.input} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
              </select>
              <button type="submit" style={styles.btnPrimary}>{editingContact ? 'Update' : 'Add'} Contact</button>
            </form>
          </div>
        </div>
      )}
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
  actionBtn: { background: 'none', border: 'none', color: 'var(--info)', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' },
  form: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.95rem' }
};

export default Contacts;
