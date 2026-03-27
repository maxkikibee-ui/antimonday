import React, { useState, useEffect } from 'react';
import { initialData as store } from '../data';
import { Briefcase, Coins, Trophy, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    setDeals(savedDeals ? JSON.parse(savedDeals) : store.deals);
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);

  // Calculate metrics from current deals
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter(d => d.stage === 'won').length;
  const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  // Calculate deals by stage for chart
  const dealsByStage = store.pipelineStages.map(stage => ({
    stage: stage.name,
    count: deals.filter(d => d.stage === stage.id).length,
    color: stage.color
  }));

  const maxCount = Math.max(...dealsByStage.map(s => s.count), 1);

  return (
    <div className="animate-fade-in">
      <div style={styles.grid}>
        <MetricCard title="Total Deals" value={totalDeals} icon={Briefcase} color="var(--primary-color)" bg="rgba(79, 70, 229, 0.1)" />
        <MetricCard title="Pipeline Value" value={formatCurrency(totalValue)} icon={Coins} color="var(--success)" bg="rgba(16, 185, 129, 0.1)" />
        <MetricCard title="Deals Won" value={wonDeals} icon={Trophy} color="var(--info)" bg="rgba(59, 130, 246, 0.1)" />
        <MetricCard title="Win Rate" value={`${conversionRate}%`} icon={TrendingUp} color="var(--warning)" bg="rgba(245, 158, 11, 0.1)" />
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Pipeline Stage Distribution */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <BarChart3 size={20} />
            <h3>Deals by Stage</h3>
          </div>
          <div style={styles.barChart}>
            {dealsByStage.map(stage => (
              <div key={stage.stage} style={styles.barItem}>
                <div style={styles.barLabel}>{stage.stage}</div>
                <div style={styles.barWrapper}>
                  <div 
                    style={{
                      ...styles.bar,
                      width: `${(stage.count / maxCount) * 100}%`,
                      backgroundColor: stage.color
                    }}
                  >
                    <span style={styles.barValue}>{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <Calendar size={20} />
            <h3>Recent Activity</h3>
          </div>
          <div style={styles.activityList}>
            {deals.slice(0, 5).map(deal => {
              const stage = store.pipelineStages.find(s => s.id === deal.stage);
              return (
                <div key={deal.id} style={styles.activityItem}>
                  <div style={{...styles.activityDot, backgroundColor: stage.color}}></div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityTitle}>{deal.title}</div>
                    <div style={styles.activityMeta}>
                      {deal.company} • {formatCurrency(deal.value)}
                    </div>
                  </div>
                  <div style={styles.activityDate}>
                    {new Date(deal.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2>Recent Deals</h2>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Deal Name</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => {
              const stage = store.pipelineStages.find(s => s.id === deal.stage);
              return (
                <tr key={deal.id} style={styles.tr}>
                  <td style={styles.td}><strong>{deal.title}</strong></td>
                  <td style={styles.td}>{deal.company}</td>
                  <td style={{ ...styles.td, color: 'var(--success)' }}>{formatCurrency(deal.value)}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, color: stage.color, backgroundColor: `${stage.color}22` }}>{stage.name}</span>
                  </td>
                  <td style={styles.td}>{new Date(deal.date).toLocaleDateString('th-TH')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, bg }) => (
  <div style={styles.card}>
    <div style={{ ...styles.iconWrapper, color, backgroundColor: bg }}>
      <Icon size={24} />
    </div>
    <div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardValue}>{value}</p>
    </div>
  </div>
);

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' },
  card: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' },
  iconWrapper: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px', fontWeight: '500' },
  cardValue: { fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' },
  chartContainer: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' },
  chartHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--text-primary)', fontWeight: '600' },
  barChart: { display: 'flex', flexDirection: 'column', gap: '16px' },
  barItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
  barLabel: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' },
  barWrapper: { width: '100%', height: '32px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', overflow: 'hidden' },
  bar: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', borderRadius: '6px', transition: 'width 0.3s ease', minWidth: '40px' },
  barValue: { color: 'white', fontSize: '0.85rem', fontWeight: '600' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  activityItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' },
  activityDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' },
  activityMeta: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
  activityDate: { fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' },
  tableContainer: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { padding: '20px 24px', borderBottom: '1px solid var(--border-color)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '16px 24px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid var(--border-color)' },
  td: { padding: '16px 24px', fontSize: '0.95rem' },
  badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' },
};

export default Dashboard;
