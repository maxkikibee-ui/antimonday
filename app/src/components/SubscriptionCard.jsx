import React from 'react';
import StatusBadge from './StatusBadge';
import PlanBadge from './PlanBadge';
import { Mail, Building2, Calendar } from 'lucide-react';

const SubscriptionCard = ({ subscription, onClick }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div style={styles.card} onClick={() => onClick && onClick(subscription)}>
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <div style={styles.email}><Mail size={14} color="var(--text-secondary)" />{subscription.email}</div>
          {subscription.name && <div style={styles.name}>{subscription.name}</div>}
        </div>
        <div style={styles.badges}>
          <StatusBadge status={subscription.subscriptionStatus} />
          <PlanBadge plan={subscription.servicePlan} />
        </div>
      </div>
      <div style={styles.details}>
        {subscription.company && (
          <div style={styles.detail}><Building2 size={13} color="var(--text-secondary)" />{subscription.company}</div>
        )}
        <div style={styles.detail}><Calendar size={13} color="var(--text-secondary)" />ลงทะเบียน: {formatDate(subscription.registrationDate)}</div>
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' },
  email: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' },
  name: { fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '20px' },
  badges: { display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 },
  details: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detail: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }
};

export default SubscriptionCard;
