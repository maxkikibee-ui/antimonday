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
    subscriptions, loading, createSubscription, updateStatus, updatePlan,
    filterSubscriptions, getHistory, exportData, getCountByStatus, getCountByPlan,
    setSubscriptions, setSyncStatus, syncStatus
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
    <div className="animate-fade-in">
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>ฐานข้อมูลลูกค้า</h1>
          <p style={s.pageSubtitle}>จัดการข้อมูลสมาชิกและแผนบริการ</p>
        </div>
      </div>

      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, backgroundColor: '#fff7ed', color: '#f97316' }}><Users size={22} /></div>
          <div>
            <div style={s.statLabel}>ลูกค้าทั้งหมด</div>
            <div style={s.statValue}>{subscriptions.length}</div>
          </div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, backgroundColor: '#f5f3ff', color: '#8b5cf6' }}><TrendingUp size={22} /></div>
          <div>
            <div style={s.statLabel}>สถานะ</div>
            <div style={s.badges}>{Object.entries(statusCounts).map(([st, c]) => (
              <div key={st} style={s.badgeRow}><StatusBadge status={st} /><span style={s.badgeCount}>{c}</span></div>
            ))}</div>
          </div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, backgroundColor: '#ecfdf5', color: '#10b981' }}><TrendingUp size={22} /></div>
          <div>
            <div style={s.statLabel}>แผนบริการ</div>
            <div style={s.badges}>{Object.entries(planCounts).map(([p, c]) => (
              <div key={p} style={s.badgeRow}><PlanBadge plan={p} /><span style={s.badgeCount}>{c}</span></div>
            ))}</div>
          </div>
        </div>
      </div>

      <div style={s.mainContent}>
        <div style={s.sidebar}>
          <FilterPanel filters={filters} onFilterChange={setFilters} onClearFilters={() => setFilters({ status: [], plans: [] })} />
          <div style={s.syncBox}>
            <div style={s.syncHead}>
              <span>อัพเดทล่าสุด</span>
              <button style={s.refreshBtn} onClick={handleSync}><RefreshCw size={14} /></button>
            </div>
            <div style={s.syncTime}>{lastUpdate.toLocaleTimeString('th-TH')}</div>
          </div>
        </div>

        <div style={s.content}>
          <div style={s.contentHead}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a' }}>รายการลูกค้า ({filteredSubscriptions.length})</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={s.resetBtn} onClick={() => { localStorage.removeItem('subscriptions'); localStorage.removeItem('subscriptionHistory'); window.location.reload(); }}>Reset</button>
              <ExportButton onExport={exportData} />
            </div>
          </div>
          {filteredSubscriptions.length === 0 ? (
            <div style={s.empty}><Users size={48} color="#d1d5db" /><p>ไม่พบข้อมูลลูกค้า</p></div>
          ) : (
            <div style={s.grid}>{filteredSubscriptions.map(sub => (
              <SubscriptionCard key={sub.id} subscription={sub} onClick={setSelectedCustomer} />
            ))}</div>
          )}
        </div>
      </div>

      {selectedCustomer && (
        <div style={s.overlay} onClick={() => setSelectedCustomer(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHead}>
              <div>
                <h3 style={{ color: '#1a1a1a' }}>{selectedCustomer.email}</h3>
                {selectedCustomer.name && <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>{selectedCustomer.name}</p>}
              </div>
              <button style={s.closeBtn} onClick={() => setSelectedCustomer(null)}><X size={20} /></button>
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
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', fontSize: '1rem', color: '#6b7280' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
  pageSubtitle: { fontSize: '0.85rem', color: '#6b7280' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px' },
  statIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: '#6b7280', fontSize: '0.8rem', marginBottom: '4px', fontWeight: '500' },
  statValue: { fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' },
  badges: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '4px' },
  badgeCount: { fontSize: '0.8rem', fontWeight: '600', color: '#6b7280' },
  mainContent: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '12px' },
  syncBox: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px' },
  syncHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem', fontWeight: '500', color: '#6b7280' },
  refreshBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#f97316', padding: '4px' },
  syncTime: { fontSize: '0.85rem', color: '#1a1a1a' },
  content: { display: 'flex', flexDirection: 'column', gap: '14px' },
  contentHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#9ca3af', gap: '12px' },
  resetBtn: { padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#6b7280', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  modalHead: { padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' },
  modalBody: { padding: '24px' },
  section: { marginBottom: '20px' },
  sectionTitle: { fontSize: '0.9rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#374151' },
};

export default Subscriptions;
