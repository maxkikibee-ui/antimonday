import React, { useState, useEffect, useMemo } from 'react';
import { initialData as store } from '../data';
import { TrendingUp, Users, FolderOpen, BarChart3, ArrowUpRight, Calendar, Activity } from 'lucide-react';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    setDeals(savedDeals ? JSON.parse(savedDeals) : store.deals);
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
  const shortCurrency = (val) => {
    if (val >= 1000000) return `฿${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `฿${Math.round(val / 1000)}K`;
    return `฿${val}`;
  };

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const uniqueCompanies = [...new Set(deals.map(d => d.company))].length;
  const activeProjects = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'won').length;
  const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const dealsByStage = store.pipelineStages.map(stage => ({
    stage: stage.name, count: deals.filter(d => d.stage === stage.id).length, color: stage.color
  }));
  const maxCount = Math.max(...dealsByStage.map(s => s.count), 1);

  const metrics = [
    { label: 'มูลค่าไปป์ไลน์รวม', value: shortCurrency(totalValue), sub: 'เพิ่มขึ้น 15% จากเดือนที่แล้ว', icon: TrendingUp, color: '#f97316', bg: '#fff7ed' },
    { label: 'ลูกค้าปัจจุบัน', value: `${uniqueCompanies} บริษัท`, sub: 'ไม่มีการเปลี่ยนแปลงมาก', icon: Users, color: '#1a1a1a', bg: '#f3f4f6' },
    { label: 'โครงการที่กำลังทำ', value: `${activeProjects} โครงการ`, sub: `เพิ่มงานใหม่ +2 โครงการ`, icon: FolderOpen, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'เปอร์เซ็นต์ปิดการขาย', value: `${conversionRate}%`, sub: 'เพิ่มขึ้น +5% ไตรมาสนี้', icon: BarChart3, color: '#10b981', bg: '#ecfdf5' },
  ];

  // Calculate monthly revenue from deals
  const monthlyData = useMemo(() => {
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthMap = {};
    months.forEach((m, i) => { monthMap[i] = { label: m, revenue: 0, deals: 0 }; });
    deals.forEach(d => {
      const month = new Date(d.date).getMonth();
      monthMap[month].revenue += d.value;
      monthMap[month].deals += 1;
    });
    return Object.values(monthMap);
  }, [deals]);

  // Calculate won deals per month for second line
  const wonMonthlyData = useMemo(() => {
    const data = new Array(12).fill(0);
    deals.filter(d => d.stage === 'won').forEach(d => {
      data[new Date(d.date).getMonth()] += d.value;
    });
    return data;
  }, [deals]);

  return (
    <div className="animate-fade-in">
      <div style={s.grid}>
        {metrics.map((m, i) => (
          <div key={i} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <div style={s.cardLabel}>{m.label}</div>
                <div style={s.cardValue}>{m.value}</div>
              </div>
              <div style={{ ...s.iconWrap, backgroundColor: m.bg }}><m.icon size={20} color={m.color} /></div>
            </div>
            <div style={s.cardSub}><ArrowUpRight size={12} color="#10b981" /><span>{m.sub}</span></div>
          </div>
        ))}
      </div>

      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>ความเคลื่อนไหวล่าสุด</h2>
        <button style={s.viewAllBtn}>ดูทั้งหมด</button>
      </div>

      <div style={s.activityList}>
        {deals.slice(0, 5).map((deal) => {
          const stage = store.pipelineStages.find(st => st.id === deal.stage);
          return (
            <div key={deal.id} style={s.activityItem}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=f3f4f6&color=374151&size=40`} alt="" style={s.activityImg} />
              <div style={s.activityContent}>
                <div style={s.activityTitle}>{deal.title}</div>
                <div style={s.activityMeta}>บจก. {deal.company} • {formatCurrency(deal.value)}</div>
              </div>
              <span style={{ ...s.stageBadge, color: stage?.color, backgroundColor: `${stage?.color}18` }}>{stage?.name}</span>
            </div>
          );
        })}
      </div>

      {/* Revenue Line Chart */}
      <div style={{ ...s.chartCard, marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={s.chartHeader}><Activity size={18} /><h3 style={s.chartTitle}>รายได้รายเดือน (฿)</h3></div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: '#f97316' }}></div><span style={{ color: '#9ca3af' }}>รายได้ทั้งหมด</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: '#10b981' }}></div><span style={{ color: '#9ca3af' }}>ปิดการขายได้</span></div>
          </div>
        </div>
        <LineChart data={monthlyData} wonData={wonMonthlyData} shortCurrency={shortCurrency} />
      </div>

      {/* Charts */}
      <div style={s.chartsGrid}>
        <div style={s.chartCard}>
          <div style={s.chartHeader}><BarChart3 size={18} /><h3 style={s.chartTitle}>สถานะ Deals ตาม Stage</h3></div>
          <div style={s.barChart}>
            {dealsByStage.map(st => (
              <div key={st.stage} style={s.barItem}>
                <div style={s.barLabel}>{st.stage}</div>
                <div style={s.barWrapper}>
                  <div style={{ ...s.bar, width: `${(st.count / maxCount) * 100}%`, backgroundColor: st.color }}>
                    <span style={s.barValue}>{st.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={s.chartCard}>
          <div style={s.chartHeader}><Calendar size={18} /><h3 style={s.chartTitle}>กิจกรรมล่าสุด</h3></div>
          {deals.slice(0, 5).map(deal => {
            const stage = store.pipelineStages.find(st => st.id === deal.stage);
            return (
              <div key={deal.id} style={s.miniActivity}>
                <div style={{ ...s.dot, backgroundColor: stage?.color }}></div>
                <div style={{ flex: 1 }}>
                  <div style={s.miniTitle}>{deal.title}</div>
                  <div style={s.miniMeta}>{deal.company} • {formatCurrency(deal.value)}</div>
                </div>
                <div style={s.miniDate}>{new Date(deal.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <div style={s.tableHead}><h2 style={s.sectionTitle}>รายการ Deals ทั้งหมด</h2></div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ชื่อ Deal</th><th style={s.th}>บริษัท</th><th style={s.th}>มูลค่า</th><th style={s.th}>สถานะ</th><th style={s.th}>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {deals.map(deal => {
              const stage = store.pipelineStages.find(st => st.id === deal.stage);
              return (
                <tr key={deal.id} style={s.tr}>
                  <td style={s.td}><strong>{deal.title}</strong></td>
                  <td style={s.td}>{deal.company}</td>
                  <td style={{ ...s.td, color: '#10b981', fontWeight: 600 }}>{formatCurrency(deal.value)}</td>
                  <td style={s.td}><span style={{ ...s.stageBadge, color: stage?.color, backgroundColor: `${stage?.color}18` }}>{stage?.name}</span></td>
                  <td style={s.td}>{new Date(deal.date).toLocaleDateString('th-TH')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LineChart = ({ data, wonData, shortCurrency }) => {
  const W = 700, H = 200, PX = 40, PY = 20;
  const chartW = W - PX * 2, chartH = H - PY * 2;
  const revenues = data.map(d => d.revenue);
  const maxVal = Math.max(...revenues, ...wonData, 1);

  const getX = (i) => PX + (i / 11) * chartW;
  const getY = (val) => PY + chartH - (val / maxVal) * chartH;

  const linePath = revenues.map((v, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(v)}`).join(' ');
  const areaPath = `${linePath} L${getX(11)},${PY + chartH} L${getX(0)},${PY + chartH} Z`;
  const wonPath = wonData.map((v, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(v)}`).join(' ');

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(p => ({
    y: PY + chartH - p * chartH,
    label: shortCurrency(maxVal * p)
  }));

  const [hover, setHover] = useState(null);

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: '100%', height: 'auto' }}>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PX} y1={g.y} x2={W - PX} y2={g.y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PX - 6} y={g.y + 3} textAnchor="end" fill="#d1d5db" fontSize="9" fontFamily="inherit">{g.label}</text>
          </g>
        ))}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={wonPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
        {revenues.map((v, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(v)} r={hover === i ? 5 : 3} fill="#f97316" stroke="#fff" strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'r 0.15s' }}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            <text x={getX(i)} y={H + 20} textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="inherit">{data[i].label}</text>
          </g>
        ))}
        {hover !== null && (
          <g>
            <line x1={getX(hover)} y1={PY} x2={getX(hover)} y2={PY + chartH} stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <rect x={getX(hover) - 50} y={getY(revenues[hover]) - 38} width="100" height="30" rx="6" fill="#111827" />
            <text x={getX(hover)} y={getY(revenues[hover]) - 19} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="inherit" fontWeight="600">
              {shortCurrency(revenues[hover])} ({data[hover].deals} deals)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  cardLabel: { fontSize: '0.78rem', color: '#9ca3af', marginBottom: '6px', fontWeight: '500' },
  cardValue: { fontSize: '1.5rem', fontWeight: '700', color: '#111827' },
  iconWrap: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardSub: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#059669' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  sectionTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#111827' },
  viewAllBtn: { padding: '5px 12px', borderRadius: '6px', border: '1px solid #f0f0f0', backgroundColor: '#fff', fontSize: '0.75rem', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' },
  activityList: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  activityItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid #f9fafb' },
  activityImg: { width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: '0.85rem', fontWeight: '600', color: '#111827', marginBottom: '2px' },
  activityMeta: { fontSize: '0.75rem', color: '#9ca3af' },
  stageBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' },
  chartCard: { backgroundColor: '#fff', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  chartHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#111827' },
  chartTitle: { fontSize: '0.88rem', fontWeight: '600' },
  barChart: { display: 'flex', flexDirection: 'column', gap: '12px' },
  barItem: { display: 'flex', flexDirection: 'column', gap: '5px' },
  barLabel: { fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' },
  barWrapper: { width: '100%', height: '26px', backgroundColor: '#f9fafb', borderRadius: '8px', overflow: 'hidden' },
  bar: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', borderRadius: '8px', minWidth: '36px', transition: 'width 0.4s ease' },
  barValue: { color: '#fff', fontSize: '0.75rem', fontWeight: '600' },
  miniActivity: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '1px solid #f9fafb' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0 },
  miniTitle: { fontSize: '0.82rem', fontWeight: '600', color: '#111827', marginBottom: '1px' },
  miniMeta: { fontSize: '0.72rem', color: '#9ca3af' },
  miniDate: { fontSize: '0.72rem', color: '#d1d5db', fontWeight: '500' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  tableHead: { padding: '16px 18px', borderBottom: '1px solid #f0f0f0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '11px 18px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '500' },
  tr: { borderBottom: '1px solid #f9fafb' },
  td: { padding: '12px 18px', fontSize: '0.82rem', color: '#374151' },
};

export default Dashboard;
