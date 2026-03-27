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
    subscriptions,
    loading,
    createSubscription,
    updateStatus,
    updatePlan,
    filterSubscriptions,
    getHistory,
    exportData,
    getCountByStatus,
    getCountByPlan,
    setSubscriptions,
    setSyncStatus,
    syncStatus
  } = useSubscriptions();

  const [filters, setFilters] = useState({ status: [], plans: [] });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSync();
    }, 30000);

    return () => clearInterval(interval);
  }, [subscriptions]);

  const handleSync = async () => {
    try {
      const result = await integrationService.syncData(subscriptions);
      if (result.success && result.records) {
        setSubscriptions(result.records);
      }
      setSyncStatus(integrationService.getSyncStatus('main', result));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const filteredSubscriptions = filterSubscriptions(filters);
  const statusCounts = getCountByStatus();
  const planCounts = getCountByPlan();

  if (loading) {
    return <div style={styles.loading}>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Statistics Dashboard */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>ลูกค้าทั้งหมด</div>
            <div style={styles.statValue}>{subscriptions.length}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>สถานะ</div>
            <div style={styles.statBadges}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} style={styles.statBadge}>
                  <StatusBadge status={status} />
                  <span style={styles.statCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>แผนบริการ</div>
            <div style={styles.statBadges}>
              {Object.entries(planCounts).map(([plan, count]) => (
                <div key={plan} style={styles.statBadge}>
                  <PlanBadge plan={plan} />
                  <span style={styles.statCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar with Filters */}
        <div style={styles.sidebar}>
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={() => setFilters({ status: [], plans: [] })}
          />
          
          <div style={styles.syncStatus}>
            <div style={styles.syncHeader}>
              <span>อัพเดทล่าสุด</span>
              <button style={styles.refreshBtn} onClick={handleSync}>
                <RefreshCw size={14} />
              </button>
            </div>
            <div style={styles.syncTime}>
              {lastUpdate.toLocaleTimeString('th-TH')}
            </div>
            {syncStatus && (
              <div style={styles.syncInfo}>
                Status: <span style={{ color: syncStatus.status === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                  {syncStatus.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Subscription List */}
        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <h2>รายการลูกค้า ({filteredSubscriptions.length})</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                style={styles.resetBtn} 
                onClick={() => {
                  localStorage.removeItem('subscriptions');
                  localStorage.removeItem('subscriptionHistory');
                  window.location.reload();
                }}
              >
                Reset Data
              </button>
              <ExportButton onExport={exportData} />
            </div>
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div style={styles.empty}>
              <Users size={48} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
              <p>ไม่พบข้อมูลลูกค้า</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredSubscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onClick={setSelectedCustomer}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div style={styles.modalOverlay} onClick={() => setSelectedCustomer(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3>{selectedCustomer.email}</h3>
                {selectedCustomer.name && <p style={styles.modalSubtitle}>{selectedCustomer.name}</p>}
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedCustomer(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalSection}>
                <h4>ข้อมูลปัจจุบัน</h4>
                <div style={styles.modalInfo}>
                  <div>สถานะ: <StatusBadge status={selectedCustomer.subscriptionStatus} /></div>
                  <div>แผน: <PlanBadge plan={selectedCustomer.servicePlan} /></div>
                  {selectedCustomer.company && <div>บริษัท: {selectedCustomer.company}</div>}
                </div>
              </div>

              <div style={styles.modalSection}>
                <h4>ประวัติการเปลี่ยนแปลง</h4>
                <HistoryTimeline history={getHistory(selectedCustomer.id)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '1.1rem',
    color: 'var(--text-secondary)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    color: 'var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    marginBottom: '4px',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  statBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statCount: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '24px'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  syncStatus: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '16px'
  },
  syncHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--primary-color)',
    padding: '4px'
  },
  syncTime: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  syncInfo: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    gap: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  modalSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginTop: '4px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)'
  },
  modalBody: {
    padding: '24px'
  },
  modalSection: {
    marginBottom: '24px'
  },
  modalInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px',
    fontSize: '0.95rem'
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--danger)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem'
  }
};

export default Subscriptions;
