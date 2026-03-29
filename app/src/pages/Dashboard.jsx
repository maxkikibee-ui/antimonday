import React, { useState, useEffect } from 'react';
import { initialData as store } from '../data';
import { TrendingUp, Users, FolderOpen, BarChart3, ArrowUpRight, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    setDeals(savedDeals ? JSON.parse(savedDeals) : store.deals);
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
  const shortCurrency = (val) => {
    if (val >= 1000000) return `฿${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `฿${Math.round(val / 1000)}K`;
    return `฿${val}`;
  };

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const uniqueCompanies = [...new Set(deals.map(d => d.company))].length;
  const activeProjects = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'won').length;
  const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const dealsByStage = store.pipelineStages.map(stage => ({
    stage: stage.name, count: deals.filter(d => d.stage === stage.id).length, color: stage.color
  }));
  const maxCount = Math.max(...dealsByStage.map(s => s.count), 1);

  const metrics = [
    { label: 'มูลค่าไปป์ไลน์รวม', value: shortCurrency(totalValue), sub: 'เพิ่มขึ้น 15% จากเดือนที่แล้ว', icon: TrendingUp, color: '#f97316', bg: '#fff7ed' },
    { label: 'ลูกค้าปัจจุบัน', value: `${uniqueCompanies} บริษัท`, sub: 'ไม่มีการเปลี่ยนแปลงมาก', icon: Users, color: '#1a1a1a', bg: '#f3f4f6' },
    { label: 'โครงการที่กำลังทำ', value: `${activeProjects} โครงการ`, sub: `เพิ่มงานใหม่ +2 โครงการ`, icon: FolderOpen, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'เปอร์เซ็นต์ปิดการขาย', value: `${conversionRate}%`, sub: 'เพิ่มขึ้น +5% ไตรมาสนี้', icon: BarChart3, color: '#10b981', bg: '#ecfdf5' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={s.header}>
        <h1 style={s.title}>ภาพรวมสรุป</h1>
        <p style={s.subtitle}>สรุปสถานะงานเบื้องต้นของลูกค้า ไปป์วิเคราะห์ธุรกิจ เชิงปริมาณและเชิงคุณค่า</p>
      </div>

      <div style={s.grid}>
        {metrics.map((m, i) => (
          <div key={i} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <div style={s.cardLabel}>{m.label}</div>
                <div style={s.cardValue}>{m.value}</div>
              </div>
              <div style={{ ...s.iconWrap, backgroundColor: m.bg }}><m.icon size={20} color={m.color} /></div>
            </div>
            <div style={s.cardSub}><ArrowUpRight size={12} color="#10b981" /><span>{m.sub}</span></div>
          </div>
        ))}
      </div>

      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>ความเคลื่อนไหวล่าสุด</h2>
        <button style={s.viewAllBtn}>ดูทั้งหมด</button>
      </div>

      <div style={s.activityList}>
        {deals.slice(0, 5).map((deal) => {
          const stage = store.pipelineStages.find(st => st.id === deal.stage);
          return (
            <div key={deal.id} style={s.activityItem}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=f3f4f6&color=374151&size=40`} alt="" style={s.activityImg} />
              <div style={s.activityContent}>
                <div style={s.activityTitle}>{deal.title}</div>
                <div style={s.activityMeta}>บจก. {deal.company} • {formatCurrency(deal.value)}</div>
              </div>
              <span style={{ ...s.stageBadge, color: stage?.color, backgroundColor: `${stage?.color}18` }}>{stage?.name}</span>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={s.chartsGrid}>
        <div style={s.chartCard}>
          <div style={s.chartHeader}><BarChart3 size={18} /><h3 style={s.chartTitle}>Deals by Stage</h3></div>
          <div style={s.barChart}>
            {dealsByStage.map(st => (
              <div key={st.stage} style={s.barItem}>
                <div style={s.barLabel}>{st.stage}</div>
                <div style={s.barWrapper}>
                  <div style={{ ...s.bar, width: `${(st.count / maxCount) * 100}%`, backgroundColor: st.color }}>
                    <span style={s.barValue}>{st.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={s.chartCard}>
          <div style={s.chartHeader}><Calendar size={18} /><h3 style={s.chartTitle}>Recent Activity</h3></div>
          {deals.slice(0, 5).map(deal => {
            const stage = store.pipelineStages.find(st => st.id === deal.stage);
            return (
              <div key={deal.id} style={s.miniActivity}>
                <div style={{ ...s.dot, backgroundColor: stage?.color }}></div>
                <div style={{ flex: 1 }}>
                  <div style={s.miniTitle}>{deal.title}</div>
                  <div style={s.miniMeta}>{deal.company} • {formatCurrency(deal.value)}</div>
                </div>
                <div style={s.miniDate}>{new Date(deal.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <div style={s.tableHead}><h2 style={s.sectionTitle}>รายการ Deals ทั้งหมด</h2></div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ชื่อ Deal</th><th style={s.th}>บริษัท</th><th style={s.th}>มูลค่า</th><th style={s.th}>สถานะ</th><th style={s.th}>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {deals.map(deal => {
              const stage = store.pipelineStages.find(st => st.id === deal.stage);
              return (
                <tr key={deal.id} style={s.tr}>
                  <td style={s.td}><strong>{deal.title}</strong></td>
                  <td style={s.td}>{deal.company}</td>
                  <td style={{ ...s.td, color: '#10b981', fontWeight: 600 }}>{formatCurrency(deal.value)}</td>
                  <td style={s.td}><span style={{ ...s.stageBadge, color: stage?.color, backgroundColor: `${stage?.color}18` }}>{stage?.name}</span></td>
                  <td style={s.td}>{new Date(deal.date).toLocaleDateString('th-TH')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const s = {
  header: { marginBottom: '24px' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' },
  subtitle: { fontSize: '0.85rem', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  cardLabel: { fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px' },
  cardValue: { fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' },
  iconWrap: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardSub: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a' },
  viewAllBtn: { padding: '6px 14px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' },
  activityList: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '32px' },
  activityItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' },
  activityImg: { width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: '0.9rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
  activityMeta: { fontSize: '0.8rem', color: '#6b7280' },
  stageBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' },
  chartCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' },
  chartHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#1a1a1a' },
  chartTitle: { fontSize: '0.95rem', fontWeight: '600' },
  barChart: { display: 'flex', flexDirection: 'column', gap: '14px' },
  barItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  barLabel: { fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' },
  barWrapper: { width: '100%', height: '28px', backgroundColor: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' },
  bar: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', borderRadius: '6px', minWidth: '36px', transition: 'width 0.3s' },
  barValue: { color: '#fff', fontSize: '0.8rem', fontWeight: '600' },
  miniActivity: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  miniTitle: { fontSize: '0.85rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' },
  miniMeta: { fontSize: '0.75rem', color: '#6b7280' },
  miniDate: { fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  tableHead: { padding: '18px 20px', borderBottom: '1px solid #e5e7eb' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 20px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.8rem', fontWeight: '500' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 20px', fontSize: '0.85rem', color: '#374151' },
};

export default Dashboard;
