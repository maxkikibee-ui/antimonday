import React, { useState } from 'react';
import { initialData } from '../data';
import { Building2, Calendar } from 'lucide-react';

const Pipeline = () => {
  const [deals, setDeals] = useState(initialData.deals);
  const stages = initialData.pipelineStages;

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);

  const onDragStart = (e, id) => e.dataTransfer.setData('dealId', id);
  const onDrop = (e, stageId) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (!dealId) return;
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: stageId } : d));
  };
  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="animate-fade-in">
      <div style={s.board}>
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={stage.id} style={s.column}>
              <div style={s.colHeader}>
                <div style={s.colTitle}>
                  <div style={{ ...s.dot, backgroundColor: stage.color }}></div>
                  {stage.name}
                </div>
                <span style={s.count}>{stageDeals.length}</span>
              </div>
              <div style={s.colValue}>{formatCurrency(totalValue)}</div>
              <div style={s.colBody} onDrop={(e) => onDrop(e, stage.id)} onDragOver={onDragOver}>
                {stageDeals.map(deal => (
                  <div key={deal.id} style={s.card} draggable onDragStart={(e) => onDragStart(e, deal.id)}>
                    <div style={s.cardTitle}>{deal.title}</div>
                    <div style={s.company}><Building2 size={14} /> {deal.company}</div>
                    <div style={s.footer}>
                      <span style={s.value}>{formatCurrency(deal.value)}</span>
                      <span style={s.date}><Calendar size={12} /> {new Date(deal.date).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const s = {
  header: { marginBottom: '20px' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
  subtitle: { fontSize: '0.85rem', color: '#6b7280' },
  board: { display: 'flex', gap: '16px', height: 'calc(100vh - 200px)', overflowX: 'auto', paddingBottom: '12px' },
  column: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', minWidth: '280px', width: '280px', display: 'flex', flexDirection: 'column' },
  colHeader: { padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  colTitle: { fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#1a1a1a' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  count: { backgroundColor: '#f3f4f6', padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' },
  colValue: { color: '#6b7280', fontSize: '0.8rem', padding: '0 16px 12px', borderBottom: '1px solid #f3f4f6' },
  colBody: { padding: '12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { backgroundColor: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'box-shadow 0.2s' },
  cardTitle: { fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' },
  company: { color: '#6b7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '10px', marginTop: '4px' },
  value: { fontWeight: '600', color: '#10b981', fontSize: '0.85rem' },
  date: { color: '#9ca3af', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }
};

export default Pipeline;
