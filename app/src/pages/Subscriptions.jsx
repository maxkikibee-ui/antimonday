import React, { useState, useEffect } from 'react';
import useSubscriptions from '../hooks/useSubscriptions';
import SubscriptionCard from '../components/SubscriptionCard';
import FilterPanel from '../components/FilterPanel';
import ExportButton from '../components/ExportButton';
import HistoryTimeline from '../components/HistoryTimeline';
import StatusBadge from '../components/StatusBadge';
import PlanBadge from '../components/PlanBadge';
import { Users, TrendingUp, X, RefreshCw } from 'lucide-react';
import integrationService from '../utils/integrationService';

const Subscriptions = () => {
  const {
    subscriptions, loading, filterSubscriptions, getHistory, exportData,
    getCountByStatus, getCountByPlan, setSubscriptions, setSyncStatus, syncStatus
  } = useSubscriptions();

  const [filters, setFilters] = useState({ status: [], plans: [] });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => handleSync(), 30000);
    return () => clearInterval(interval);
  }, [subscriptions]);

  const handleSync = async () => {
    try {
      const result = await integrationService.syncData(subscriptions);
      if (result.success && result.records) setSubscriptions(result.records);
      setSyncStatus(integrationService.getSyncStatus('main', result));
      setLastUpdate(new Date());
    } catch (error) { console.error('Sync error:', error); }
  };

  const filteredSubscriptions = filterSubscriptions(filters);
  const statusCounts = getCountByStatus();
  const planCounts = getCountByPlan();

  if (loading) return <div style={s.loading}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={s.page}>
      {/* Stats row - compact */}
      <div style={s.statsRow}>
        <div style={s.stat}>
          <div style={{ ...s.statIcon, backgroundColor: '#fff7ed', color: '#f97316' }}><Users size={18} /></div>
          <div><div style={s.statLabel}>ลูกค้าทั้งหมด</div><div style={s.statValue}>{subscriptions.length}</div></div>
        </div>
        <div style={s.stat}>
          <div style={{ ...s.statIcon, backgroundColor: '#f5f3ff', color: '#8b5cf6' }}><TrendingUp size={18} /></div>
          <div><div style={s.statLabel}>สถานะ</div>
            <div style={s.badges}>{Object.entries(statusCounts).map(([st, c]) => (
              <span key={st} style={s.badgeRow}><StatusBadge status={st} /> {c}</span>
            ))}</div>
          </div>
        </div>
        <div style={s.stat}>
          <div style={{ ...s.statIcon, backgroundColor: '#ecfdf5', color: '#10b981' }}><TrendingUp size={18} /></div>
          <div><div style={s.statLabel}>แผนบริการ</div>
            <div style={s.badges}>{Object.entries(planCounts).map(([p, c]) => (
              <span key={p} style={s.badgeRow}><PlanBadge plan={p} /> {c}</span>
            ))}</div>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div style={s.main}>
        {/* Left sidebar */}
        <div style={s.sidebar}>
          <FilterPanel filters={filters} onFilterChange={setFilters} onClearFilters={() => setFilters({ status: [], plans: [] })} />
          <div style={s.syncBox}>
            <div style={s.syncHead}><span>อัพเดทล่าสุด</span><button style={s.refreshBtn} onClick={handleSync}><RefreshCw size={13} /></button></div>
            <div style={s.syncTime}>{lastUpdate.toLocaleTimeString('th-TH')}</div>
          </div>
        </div>

        {/* Right content - scrollable grid */}
        <div style={s.content}>
          <div style={s.contentHead}>
            <span style={s.contentTitle}>รายการลูกค้า ({filteredSubscriptions.length})</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={s.resetBtn} onClick={() => { localStorage.removeItem('subscriptions'); localStorage.removeItem('subscriptionHistory'); window.location.reload(); }}>Reset</button>
              <ExportButton onExport={exportData} />
            </div>
          </div>
          <div style={s.gridScroll}>
            {filteredSubscriptions.length === 0 ? (
              <div style={s.empty}><Users size={40} color="#d1d5db" /><p>ไม่พบข้อมูลลูกค้า</p></div>
            ) : (
              <div style={s.grid}>{filteredSubscriptions.map(sub => (
                <SubscriptionCard key={sub.id} subscription={sub} onClick={setSelectedCustomer} />
              ))}</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCustomer && (
        <div style={s.overlay} onClick={() => setSelectedCustomer(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHead}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{selectedCustomer.email}</h3>
                {selectedCustomer.name && <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>{selectedCustomer.name}</p>}
              </div>
              <button style={s.closeBtn} onClick={() => setSelectedCustomer(null)}><X size={18} /></button>
            </div>
            <div style={s.modalBody}>
              <div style={s.section}>
                <h4 style={s.sectionTitle}>ข้อมูลปัจจุบัน</h4>
                <div style={s.infoList}>
                  <div>สถานะ: <StatusBadge status={selectedCustomer.subscriptionStatus} /></div>
                  <div>แผน: <PlanBadge plan={selectedCustomer.servicePlan} /></div>
                  {selectedCustomer.company && <div>บริษัท: {selectedCustomer.company}</div>}
                </div>
              </div>
              <div style={s.section}>
                <h4 style={s.sectionTitle}>ประวัติการเปลี่ยนแปลง</h4>
                <HistoryTimeline history={getHistory(selectedCustomer.id)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', overflow: 'hidden' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', flexShrink: 0 },
  stat: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' },
  statIcon: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statLabel: { color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: '500' },
  statValue: { fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' },
  badges: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: 'var(--text-secondary)' },
  main: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', flex: 1, minHeight: 0 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' },
  syncBox: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' },
  syncHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.72rem', fontWeight: '500', color: 'var(--text-secondary)' },
  refreshBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#f97316', padding: '2px' },
  syncTime: { fontSize: '0.8rem', color: 'var(--text-primary)' },
  content: { display: 'flex', flexDirection: 'column', minHeight: 0 },
  contentHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 },
  contentTitle: { fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' },
  gridScroll: { flex: 1, overflowY: 'auto', paddingRight: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-secondary)', gap: '8px' },
  resetBtn: { padding: '6px 12px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { backgroundColor: 'var(--card-bg)', borderRadius: '14px', width: '480px', maxHeight: '70vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' },
  modalHead: { padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' },
  modalBody: { padding: '16px 20px' },
  section: { marginBottom: '16px' },
  sectionTitle: { fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)' },
};

export default Subscriptions;
