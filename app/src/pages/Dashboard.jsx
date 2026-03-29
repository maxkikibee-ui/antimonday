import React, { useState, useEffect } from 'react';
import { initialData as store } from '../data';
import { TrendingUp, Users, FolderOpen, BarChart3, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    setDeals(savedDeals ? JSON.parse(savedDeals) : store.deals);
  }, []);

  const formatCurrency = (val) => {
    if (val >= 1000000) return `฿${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `฿${(val / 1000).toFixed(0)}K`;
    return `฿${val}`;
  };

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const uniqueCompanies = [...new Set(deals.map(d => d.company))].length;
  const activeProjects = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'won').length;
  const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const metrics = [
    {
      label: 'มูลค่าไปป์ไลน์รวม',
      value: formatCurrency(totalValue),
      sub: `เพิ่มขึ้น 15% จากเดือนที่แล้ว`,
      icon: TrendingUp, color: '#f97316', bg: '#fff7ed'
    },
    {
      label: 'ลูกค้าปัจจุบัน',
      value: `${uniqueCompanies} บริษัท`,
      sub: 'ไม่มีการเปลี่ยนแปลงมาก',
      icon: Users, color: '#1a1a1a', bg: '#f3f4f6'
    },
    {
      label: 'โครงการที่กำลังทำ',
      value: `${activeProjects} โครงการ`,
      sub: `เพิ่มงานใหม่ +2 โครงการ`,
      icon: FolderOpen, color: '#8b5cf6', bg: '#f5f3ff'
    },
    {
      label: 'เปอร์เซ็นต์ปิดการขาย',
      value: `${conversionRate}%`,
      sub: `เพิ่มขึ้น +5% ไตรมาสนี้`,
      icon: BarChart3, color: '#10b981', bg: '#ecfdf5'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>ภาพรวมสรุป</h1>
        <p style={styles.subtitle}>
          สรุปสถานะงานเบื้องต้นของลูกค้า ไปป์วิเคราะห์ธุรกิจ เชิงปริมาณและเชิงคุณค่า
        </p>
      </div>

      <div style={styles.grid}>
        {metrics.map((m, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <div style={styles.cardLabel}>{m.label}</div>
                <div style={styles.cardValue}>{m.value}</div>
              </div>
              <div style={{ ...styles.iconWrap, backgroundColor: m.bg }}>
                <m.icon size={20} color={m.color} />
              </div>
            </div>
            <div style={styles.cardSub}>
              <ArrowUpRight size={12} color="#10b981" />
              <span>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>ความเคลื่อนไหวล่าสุด</h2>
        <button style={styles.viewAllBtn}>ดูทั้งหมด</button>
      </div>

      <div style={styles.activityList}>
        {deals.slice(0, 5).map((deal) => {
          const stage = store.pipelineStages.find(s => s.id === deal.stage);
          return (
            <div key={deal.id} style={styles.activityItem}>
              <div style={styles.activityAvatar}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=f3f4f6&color=374151&size=40`}
                  alt={deal.company}
                  style={styles.activityImg}
                />
              </div>
              <div style={styles.activityContent}>
                <div style={styles.activityTitle}>{deal.title}</div>
                <div style={styles.activityMeta}>
                  บจก. {deal.company} • {deal.description || 'การประชุมรับรองสิ่งปัญหาเบื้องต้นเสร็จสมบูรณ์'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  header: { marginBottom: '24px' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' },
  subtitle: { fontSize: '0.85rem', color: '#6b7280' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px'
  },
  card: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '20px',
    border: '1px solid #e5e7eb'
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'
  },
  cardLabel: { fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px' },
  cardValue: { fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' },
  iconWrap: {
    width: '40px', height: '40px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  cardSub: {
    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981'
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a' },
  viewAllBtn: {
    padding: '6px 14px', borderRadius: '6px', border: '1px solid #e5e7eb',
    backgroundColor: '#fff', fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer',
    fontFamily: 'inherit'
  },
  activityList: {
    backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  activityItem: {
    display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6'
  },
  activityAvatar: { flexShrink: 0 },
  activityImg: { width: '40px', height: '40px', borderRadius: '50%' },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: '0.9rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
  activityMeta: { fontSize: '0.8rem', color: '#6b7280' }
};

export default Dashboard;
