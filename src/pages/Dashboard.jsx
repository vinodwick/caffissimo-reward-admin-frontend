import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   const fetchDashboard = () => {
      api.getDashboard()
         .then(setData)
         .catch((err) => console.error("Failed to load dashboard data", err))
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchDashboard();
   }, []);

   // Helper for pie charts
   const renderPieChart = (dataArr, title, emptyMsg) => {
      if (!dataArr || dataArr.length === 0) return (
         <div className="flex flex-col items-center justify-center p-4 border rounded bg-gray-50 h-full">
            <p className="text-muted">{emptyMsg}</p>
         </div>
      );
      
      const colors = ['#3182ce', '#38a169', '#d69e2e', '#e53e3e', '#805ad5', '#319795', '#dd6b20'];
      const total = dataArr.reduce((sum, item) => sum + item.value, 0);
      
      let currentAngle = 0;
      const gradientStops = dataArr.map((item, i) => {
         const percentage = (item.value / total) * 100;
         const start = currentAngle;
         const end = currentAngle + percentage;
         currentAngle = end;
         return `${colors[i % colors.length]} ${start}% ${end}%`;
      }).join(', ');
      
      return (
         <div className="card h-full flex flex-col justify-between">
            <div className="card-header border-b-0 pb-0">
               <h4 className="card-title text-center w-full" style={{fontSize: '15px'}}>{title}</h4>
            </div>
            <div className="card-body flex flex-col items-center flex-grow justify-center pb-2">
               <div 
                  style={{ 
                     width: '140px', height: '140px', 
                     borderRadius: '50%', 
                     background: `conic-gradient(${gradientStops})`,
                     marginBottom: '20px',
                     boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
               ></div>
               <ul style={{ listStyle: 'none', padding: 0, width: '100%', margin: 0 }}>
                  {dataArr.map((item, i) => (
                     <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                           <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: colors[i % colors.length], marginRight: '8px', borderRadius: '50%' }}></span>
                           {item.name}
                        </span>
                        <strong>{item.value}</strong>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      );
   };

   if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading Command Center...</div>;
   if (!data) return <div style={{ padding: '40px' }}>Error loading data.</div>;

   const activeCustomers = data.stats.find(s => s.label === 'Active Customers')?.value || 0;
   const totalVisits = data.stats.find(s => s.label === 'Visits Today')?.value || 0;
   const totalPoints = data.stats.find(s => s.label === 'Points Issued Today')?.value || 0;
   const expRewards = data.stats.find(s => s.label === 'Expiring (7 days)')?.value || 0;
   const activeRewards = data.stats.find(s => s.label === 'Rewards Activated')?.value || 0;
   const redeemedRewards = data.stats.find(s => s.label === 'Rewards Redeemed')?.value || 0;

   return (
      <div className="container-fluid iq-container">
         {/* KPI Row */}
         <div className="row">
            <dl className="grid max-w-screen-xl grid-cols-2 gap-4 p-4 mx-auto text-heading sm:grid-cols-3 xl:grid-cols-6 sm:p-4 w-full">
               <div className="flex flex-col card p-4 shadow-sm" style={{borderLeft: '4px solid #3182ce'}}>
                  <dt className="mb-1 text-2xl font-semibold tracking-tight text-heading">{activeCustomers}</dt>
                  <dd className="text-body text-sm font-medium text-gray-500">Active Patrons</dd>
               </div>
               <div className="flex flex-col card p-4 shadow-sm" style={{borderLeft: '4px solid #38a169'}}>
                  <dt className="mb-1 text-2xl font-semibold tracking-tight text-heading">{totalVisits}</dt>
                  <dd className="text-body text-sm font-medium text-gray-500">Visits Today</dd>
               </div>
               <div className="flex flex-col card p-4 shadow-sm" style={{borderLeft: '4px solid #d69e2e'}}>
                  <dt className="mb-1 text-2xl font-semibold tracking-tight text-heading">{totalPoints}</dt>
                  <dd className="text-body text-sm font-medium text-gray-500">Points Issued (Today)</dd>
               </div>
               <div className="flex flex-col card p-4 shadow-sm" style={{borderLeft: '4px solid #805ad5'}}>
                  <dt className="mb-1 text-2xl font-semibold tracking-tight text-heading">{activeRewards}</dt>
                  <dd className="text-body text-sm font-medium text-gray-500">Activated (Today)</dd>
               </div>
               <div className="flex flex-col card p-4 shadow-sm" style={{borderLeft: '4px solid #319795'}}>
                  <dt className="mb-1 text-2xl font-semibold tracking-tight text-heading">{redeemedRewards}</dt>
                  <dd className="text-body text-sm font-medium text-gray-500">Redeemed (Today)</dd>
               </div>
               <div className="flex flex-col card p-4 shadow-sm" style={{borderLeft: '4px solid #e53e3e'}}>
                  <dt className="mb-1 text-2xl font-semibold tracking-tight text-heading">{expRewards}</dt>
                  <dd className="text-body text-sm font-medium text-gray-500">Expiring Risk (7d)</dd>
               </div>
            </dl>
         </div>

         {/* Distribution Pie Charts Row */}
         <div className="row" style={{marginBottom: '20px'}}>
            <div className="col-lg-4 mb-4 mb-lg-0">
               {renderPieChart(data.pieVisits, "Branch Visit Distribution (All-Time)", "Awaiting visit data")}
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
               {renderPieChart(data.pieRegistrations, "Customer Registration Density", "Awaiting registration data")}
            </div>
            <div className="col-lg-4">
               {renderPieChart(data.pieRewards, "Reward Redemption Volume", "Awaiting reward data")}
            </div>
         </div>

         {/* Widgets Row */}
         <div className="row">
            <div className="col-lg-6 mb-4">
               {/* Today Branch List Table */}
               <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                     <h4 className="card-title">Daily Branch Activity</h4>
                  </div>
                  <div className="card-body p-0">
                     <div className="table-responsive">
                        <table className="w-full text-sm text-left rtl:text-right text-body data-table m-0">
                           <thead className="text-xs text-body bg-neutral-secondary-soft border-b border-default uppercase">
                              <tr>
                                 <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                                 <th scope="col" className="px-4 py-3 font-semibold text-center">In-Store</th>
                                 <th scope="col" className="px-4 py-3 font-semibold text-right">Points</th>
                              </tr>
                           </thead>
                           <tbody>
                              {data.branchPerformance && data.branchPerformance.length > 0 ? (
                                 data.branchPerformance.map(b => (
                                    <tr key={b.name} className="border-b last:border-0 hover:bg-gray-50">
                                       <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                                       <td className="px-4 py-3 text-center">
                                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{b.visits} Vol</span>
                                       </td>
                                       <td className="px-4 py-3 text-right font-bold text-gray-600">{b.points.toLocaleString()}</td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr><td colSpan="3" align="center" className="text-muted p-4">Awaiting daily transactions</td></tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>

            <div className="col-lg-6 mb-4">
               {/* Recent Activity Timeline */}
               <div className="card h-100">
                  <div className="card-header">
                     <h4 className="card-title flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        Global Event Stream
                     </h4>
                  </div>
                  <div className="card-body p-4 overflow-y-auto" style={{maxHeight: '400px'}}>
                     <div className="iq-timeline">
                        {data.recentActivity && data.recentActivity.length > 0 ? (
                           data.recentActivity.map((a, i) => (
                              <div className="timeline-item mb-4 pb-2 border-l-2 border-blue-200 pl-4 relative ml-2" key={i}>
                                 <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1"></div>
                                 <div className="timeline-content">
                                    <h6 className="mb-1 text-sm font-bold text-gray-800">{a.action}</h6>
                                    <p className="mb-1 text-xs text-gray-500">{a.customer} @ <span className="font-semibold text-blue-600">{a.branch}</span></p>
                                    <small className="text-gray-400 font-medium text-xs">{a.time}</small>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-muted text-center text-sm py-4">System stream idle.</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div >
   );
}

export default Dashboard;
