import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const HistoryTimeline = ({ history }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeLabel = (changeType) => {
    const labels = {
      created: 'สร้างบัญชี',
      status_change: 'เปลี่ยนสถานะ',
      plan_change: 'เปลี่ยนแผน'
    };
    return labels[changeType] || changeType;
  };

  if (!history || history.length === 0) {
    return (
      <div style={styles.empty}>
        <Clock size={32} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
        <p>ไม่มีประวัติการเปลี่ยนแปลง</p>
      </div>
    );
  }

  return (
    <div style={styles.timeline}>
      {history.map((record, index) => (
        <div key={record.id} style={styles.item}>
          <div style={styles.dot}></div>
          {index < history.length - 1 && <div style={styles.line}></div>}
          
          <div style={styles.content}>
            <div style={styles.header}>
              <span style={styles.changeType}>{getChangeLabel(record.changeType)}</span>
              <span style={styles.timestamp}>{formatTimestamp(record.timestamp)}</span>
            </div>
            
            {record.oldValue && (
              <div style={styles.change}>
                <span style={styles.oldValue}>{record.oldValue}</span>
                <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                <span style={styles.newValue}>{record.newValue}</span>
              </div>
            )}
            
            {!record.oldValue && (
              <div style={styles.newValue}>{record.newValue}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  timeline: {
    position: 'relative',
    padding: '16px 0'
  },
  item: {
    position: 'relative',
    paddingLeft: '32px',
    paddingBottom: '24px'
  },
  dot: {
    position: 'absolute',
    left: '0',
    top: '4px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    border: '2px solid var(--card-bg)',
    zIndex: 1
  },
  line: {
    position: 'absolute',
    left: '5px',
    top: '16px',
    bottom: '-8px',
    width: '2px',
    backgroundColor: 'var(--border-color)'
  },
  content: {
    backgroundColor: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  changeType: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-primary)'
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  change: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem'
  },
  oldValue: {
    color: 'var(--text-secondary)',
    textDecoration: 'line-through'
  },
  newValue: {
    color: 'var(--success)',
    fontWeight: '600'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    color: 'var(--text-secondary)',
    gap: '12px'
  }
};

export default HistoryTimeline;
