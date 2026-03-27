import React from 'react';

const PlanBadge = ({ plan }) => {
  const getPlanStyle = (plan) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-block'
    };

    const planColors = {
      Basic: { bg: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af' },
      Pro: { bg: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' },
      Enterprise: { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }
    };

    const colors = planColors[plan] || planColors.Basic;
    
    return {
      ...baseStyle,
      backgroundColor: colors.bg,
      color: colors.color
    };
  };

  return <span style={getPlanStyle(plan)}>{plan}</span>;
};

export default PlanBadge;
