import React from 'react';
import { initialData as store } from '../data';
import { Briefcase, Coins, Trophy, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);

  return (
    <div className="animate-fade-in">
      <div style={styles.grid}>
        <MetricCard title="Total Deals" value={store.metrics.totalDeals} icon={Briefcase} color="var(--primary-color)" bg="rgba(79, 70, 229, 0.1)" />
        <MetricCard title="Pipeline Value" value={formatCurrency(store.metrics.value)} icon={Coins} color="var(--success)" bg="rgba(16, 185, 129, 0.1)" />
        <MetricCard title="Deals Won" value={store.metrics.won} icon={Trophy} color="var(--info)" bg="rgba(59, 130, 246, 0.1)" />
        <MetricCard title="Win Rate" value={`${store.metrics.conversionRate}%`} icon={TrendingUp} color="var(--warning)" bg="rgba(245, 158, 11, 0.1)" />
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
            </tr>
          </thead>
          <tbody>
            {store.deals.slice(0, 3).map((deal) => {
              const stage = store.pipelineStages.find(s => s.id === deal.stage);
              return (
                <tr key={deal.id} style={styles.tr}>
                  <td style={styles.td}><strong>{deal.title}</strong></td>
                  <td style={styles.td}>{deal.company}</td>
                  <td style={{ ...styles.td, color: 'var(--success)' }}>{formatCurrency(deal.value)}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, color: stage.color, backgroundColor: `${stage.color}22` }}>{stage.name}</span>
                  </td>
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
  tableContainer: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { padding: '20px 24px', borderBottom: '1px solid var(--border-color)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '16px 24px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid var(--border-color)' },
  td: { padding: '16px 24px', fontSize: '0.95rem' },
  badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' },
};

export default Dashboard;
