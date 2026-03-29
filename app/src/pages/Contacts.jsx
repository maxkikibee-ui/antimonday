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
    if (contacts.length > 0) localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const openAddModal = () => { setEditingContact(null); setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead' }); setShowModal(true); };
  const openEditModal = (c) => { setEditingContact(c); setFormData(c); setShowModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContact) setContacts(contacts.map(c => c.id === editingContact.id ? { ...formData, id: editingContact.id } : c));
    else setContacts([...contacts, { ...formData, id: 'c' + Date.now() }]);
    setShowModal(false);
  };

  const handleDelete = (id) => { if (confirm('ต้องการลบ contact นี้?')) setContacts(contacts.filter(c => c.id !== id)); };

  return (
    <div className="animate-fade-in">
      <div style={s.header}>
        <button style={s.addBtn} onClick={openAddModal}><Plus size={16} /> เพิ่มลูกค้า</button>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ชื่อ</th><th style={s.th}>บริษัท</th><th style={s.th}>อีเมล</th><th style={s.th}>โทรศัพท์</th><th style={s.th}>สถานะ</th><th style={s.th}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} style={s.tr}>
                <td style={s.td}><strong>{c.name}</strong></td>
                <td style={s.td}>{c.company}</td>
                <td style={s.td}>{c.email}</td>
                <td style={s.td}>{c.phone}</td>
                <td style={s.td}>
                  <span style={c.status === 'Active' ? s.badgeActive : s.badgeLead}>{c.status === 'Active' ? 'ใช้งาน' : 'ลูกค้าใหม่'}</span>
                </td>
                <td style={s.td}>
                  <button style={s.actBtn} onClick={() => openEditModal(c)}><Edit2 size={15} /></button>
                  <button style={{ ...s.actBtn, color: '#ef4444', marginLeft: '6px' }} onClick={() => handleDelete(c.id)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHead}>
              <h3>{editingContact ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}</h3>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={s.form}>
              <input style={s.input} placeholder="ชื่อ" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input style={s.input} placeholder="บริษัท" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
              <input style={s.input} type="email" placeholder="อีเมล" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <input style={s.input} placeholder="โทรศัพท์" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              <select style={s.input} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Lead">ลูกค้าใหม่</option>
                <option value="Active">ใช้งาน</option>
              </select>
              <button type="submit" style={s.addBtn}>{editingContact ? 'อัพเดท' : 'เพิ่ม'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  header: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' },
  subtitle: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: 'var(--text-primary)', color: 'var(--card-bg)', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  tableWrap: { backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 20px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' },
  tr: { borderBottom: '1px solid var(--input-bg)' },
  td: { padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-primary)' },
  badgeActive: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#ecfdf5', color: '#10b981' },
  badgeLead: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#eff6ff', color: '#3b82f6' },
  actBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { backgroundColor: 'var(--card-bg)', borderRadius: '16px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  modalHead: { padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' },
  form: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' },
};

export default Contacts;
