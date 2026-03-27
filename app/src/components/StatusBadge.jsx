import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-block'
    };

    const statusColors = {
      Active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      Expired: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
      Trial: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
      Cancelled: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' },
      Pending: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }
    };

    const colors = statusColors[status] || statusColors.Pending;
    
    return {
      ...baseStyle,
      backgroundColor: colors.bg,
      color: colors.color
    };
  };

  return <span style={getStatusStyle(status)}>{status}</span>;
};

export default StatusBadge;
