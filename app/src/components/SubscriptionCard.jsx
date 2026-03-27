import React from 'react';
import StatusBadge from './StatusBadge';
import PlanBadge from './PlanBadge';
import { Mail, Building2, Calendar } from 'lucide-react';

const SubscriptionCard = ({ subscription, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.card} onClick={() => onClick && onClick(subscription)}>
      <div style={styles.header}>
        <div>
          <div style={styles.email}>
            <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
            {subscription.email}
          </div>
          {subscription.name && <div style={styles.name}>{subscription.name}</div>}
        </div>
        <div style={styles.badges}>
          <StatusBadge status={subscription.subscriptionStatus} />
          <PlanBadge plan={subscription.servicePlan} />
        </div>
      </div>
      
      <div style={styles.details}>
        {subscription.company && (
          <div style={styles.detail}>
            <Building2 size={14} style={{ color: 'var(--text-secondary)' }} />
            {subscription.company}
          </div>
        )}
        <div style={styles.detail}>
          <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
          Registered: {formatDate(subscription.registrationDate)}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: 'var(--primary-color)',
      transform: 'translateY(-2px)'
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  email: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  name: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginLeft: '24px'
  },
  badges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  }
};

export default SubscriptionCard;
