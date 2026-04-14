import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Reports() {
  const [range, setRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overall');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getReports(range)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [range]);

  const getFunnelColor = (label) => {
    if (label === 'Earned') return '#3b82f6';
    if (label === 'Activated') return '#8b5cf6';
    if (label === 'Redeemed') return '#10b981';
    return '#9ca3af';
  };

  return (
    <div className="page">
      <div className="page-header flex flex-col md:flex-row justify-between md:items-center gap-4 mb-3">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle text-gray-500">Comprehensive insights across all locations</p>
        </div>
        <div className="range-selector flex flex-wrap gap-2">
          {['7d', '30d', '90d', '1y', 'all'].map(r => (
            <button key={r} style={{ textTransform: r === 'all' ? 'capitalize' : 'none' }} className={`range-btn ${range === r ? 'active' : ''} px-3 py-1 rounded-md text-sm border`} onClick={() => setRange(r)}>
              {r === 'all' ? 'All Time' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-hide" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', gap: '32px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {[
          { id: 'overall', label: 'Overall Summary' },
          { id: 'branches', label: 'Branch Performance' },
          { id: 'engagement', label: 'Customer Engagement' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #2b6cb0' : '2px solid transparent',
              color: activeTab === tab.id ? '#2b6cb0' : '#718096',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading || !data ? <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading report data...</div> : (
        <>
          {activeTab === 'overall' && (
            <div className="reports-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary Stats */}
              <div className="card lg:col-span-2 m-0 border-0 shadow-sm" style={{ padding: '24px' }}>
                <div className="card-header"><h2 style={{ fontSize: '18px', color: '#2d3748', margin: 0 }}>Snapshot ({range === 'all' ? 'All Time' : range})</h2></div>
                <div className="summary-list mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.summary.map(s => (
                    <div className="summary-row" key={s.label} style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '13px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '8px' }}>{s.label}</span>
                      <strong style={{ fontSize: '28px', color: '#2b6cb0' }}>{s.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier Distribution */}
              <div className="card">
                <div className="card-header"><h2 style={{ fontSize: '18px', color: '#2d3748' }}>Tier Distribution</h2></div>
                <div style={{ marginTop: '10px' }}>
                  {data.tierDistribution.map((t) => (
                    <div className="tier-row" key={t.tier} style={{ marginBottom: '16px' }}>
                      <div className="tier-row-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                        <span style={{ fontWeight: 600, color: '#4a5568' }}>{t.tier} Tier</span>
                        <span style={{ color: '#718096' }}>{t.count} customers</span>
                      </div>
                      <div className="tier-bar-bg" style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div className="tier-bar-fill" style={{ height: '100%', background: t.tier === 'Gold' ? '#fbbf24' : t.tier === 'Silver' ? '#94a3b8' : '#cd7f32', width: `${t.pct}%`, borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>{t.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward Funnel */}
              <div className="card">
                <div className="card-header"><h2 style={{ fontSize: '18px', color: '#2d3748' }}>Reward Lifecycle Funnel</h2></div>
                <div className="reward-funnel" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', padding: '20px 0', borderBottom: '1px solid #edf2f7' }}>
                  {data.rewardFunnel.map((r) => {
                    const max = Math.max(...data.rewardFunnel.map(x => x.value), 1);
                    return (
                      <div className="funnel-item" key={r.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div className="funnel-val" style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#2d3748' }}>{r.value}</div>
                        <div className="funnel-bar-wrap" style={{ width: '40px', background: '#edf2f7', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', height: '120px' }}>
                          <div className="funnel-bar" style={{ width: '100%', height: `${(r.value / max) * 100}%`, background: getFunnelColor(r.label), transition: 'height 0.5s ease' }}></div>
                        </div>
                        <div className="funnel-label" style={{ marginTop: '12px', fontSize: '13px', color: '#718096', fontWeight: 500 }}>{r.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="card" style={{ padding: '0' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #edf2f7' }}>
                <h2 style={{ fontSize: '18px', color: '#2d3748', margin: 0 }}>Location Breakdowns ({range === 'all' ? 'All Time' : range})</h2>
                <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>Compare core metrics across all operating branches.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table min-w-[700px] w-full mb-0">
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', color: '#4a5568', fontWeight: 600 }}>Branch Name</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568', fontWeight: 600 }}>Total Visits</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568', fontWeight: 600 }}>Points Issued</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568', fontWeight: 600 }}>Rewards Earned</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568', fontWeight: 600 }}>Redemptions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.branchPerformance || []).map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                        <td style={{ padding: '16px 24px', fontWeight: 500, color: '#2b6cb0' }}>{b.name}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568' }}>{b.visits.toLocaleString()}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568' }}>{b.points.toLocaleString()}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568' }}>{b.rewards.toLocaleString()}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', color: '#4a5568' }}>{b.redemptions.toLocaleString()}</td>
                      </tr>
                    ))}
                    {(!data.branchPerformance || data.branchPerformance.length === 0) && (
                      <tr>
                        <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#a0aec0' }}>No branch data available for this period.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'engagement' && data.customerEngagement && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card m-0 p-6">
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', color: '#2d3748', margin: 0 }}>Activity Status ({range === 'all' ? 'All Time' : range})</h2>
                  <p style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>Active vs Dormant ratio across your database.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pb-4">
                  <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#3182ce ${(data.customerEngagement.active_in_period/Math.max(data.customerEngagement.total_customers, 1))*100}%, #e2e8f0 0)` }}>
                    <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: '#2d3748' }}>
                      {Math.round((data.customerEngagement.active_in_period/Math.max(data.customerEngagement.total_customers, 1))*100)}%
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3182ce' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#4a5568' }}>Active Customers</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginLeft: '20px' }}>{data.customerEngagement.active_in_period}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#e2e8f0' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#718096' }}>Dormant (No visits)</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#a0aec0', marginLeft: '20px' }}>{data.customerEngagement.dormant_in_period}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card m-0 p-6">
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', color: '#2d3748', margin: 0 }}>Retention ({range === 'all' ? 'All Time' : range})</h2>
                  <p style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>Single visit vs Repeat customers.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pb-4">
                  <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#38a169 ${(data.customerEngagement.repeat_visit_in_period/Math.max(data.customerEngagement.active_in_period, 1))*100}%, #fbd38d 0)` }}>
                    <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: '#2d3748' }}>
                      {Math.round((data.customerEngagement.repeat_visit_in_period/Math.max(data.customerEngagement.active_in_period, 1))*100)}%
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#38a169' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#4a5568' }}>Repeat Patrons</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginLeft: '20px' }}>{data.customerEngagement.repeat_visit_in_period}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbd38d' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#718096' }}>Single Visit</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#a0aec0', marginLeft: '20px' }}>{data.customerEngagement.single_visit_in_period}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
