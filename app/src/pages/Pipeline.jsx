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
    <div style={styles.board} className="animate-fade-in">
      {stages.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage.id);
        const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div key={stage.id} style={styles.column}>
            <div style={styles.header}>
              <div style={styles.title}>
                <div style={{ ...styles.dot, backgroundColor: stage.color }}></div>
                {stage.name}
              </div>
              <span style={styles.count}>{stageDeals.length}</span>
            </div>
            <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0 16px 8px'}}>
              {formatCurrency(totalValue)}
            </div>
            
            <div 
              style={styles.body} 
              onDrop={(e) => onDrop(e, stage.id)} 
              onDragOver={onDragOver}
            >
              {stageDeals.map(deal => (
                <div 
                  key={deal.id} 
                  style={styles.card}
                  draggable
                  onDragStart={(e) => onDragStart(e, deal.id)}
                >
                  <div style={styles.cardTitle}>{deal.title}</div>
                  <div style={styles.company}><Building2 size={14}/> {deal.company}</div>
                  <div style={styles.footer}>
                    <span style={styles.value}>{formatCurrency(deal.value)}</span>
                    <span style={styles.date}><Calendar size={12}/> {new Date(deal.date).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  board: { display: 'flex', gap: '20px', height: 'calc(100vh - 160px)', overflowX: 'auto', paddingBottom: '12px' },
  column: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', minWidth: '300px', width: '300px', display: 'flex', flexDirection: 'column' },
  header: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  count: { backgroundColor: 'var(--bg-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' },
  body: { padding: '8px 16px 16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'transform 0.2s' },
  cardTitle: { fontWeight: '600', fontSize: '0.95rem' },
  company: { color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' },
  value: { fontWeight: '600', color: 'var(--success)', fontSize: '0.875rem' },
  date: { color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }
};

export default Pipeline;
