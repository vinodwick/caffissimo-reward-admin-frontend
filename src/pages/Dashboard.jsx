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

      const colors = ['#8C6239', '#38a169', '#d69e2e', '#e53e3e', '#805ad5', '#319795', '#dd6b20'];
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
               <h4 className="card-title text-center w-full" style={{ fontSize: '15px' }}>{title}</h4>
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
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-2 p-2 sm:p-4">

            <div className="big-static-card bg-white rounded-2xl p-6 flex flex-row items-center justify-between shadow-sm border border-gray-100">
               <div>
                  <div className="text-[#2C201A] text-4xl font-bold tracking-tight mb-2">{activeCustomers}</div>
                  <div className="text-gray-500 text-lg font-medium">Active Loyalty members</div>
               </div>
               <div className="w-16 h-16 min-w-[64px] rounded-full bg-[#fdf8f4] flex items-center justify-center text-[#D97706]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               </div>
            </div>

            <div className="big-static-card bg-white rounded-2xl p-6 flex flex-row items-center justify-between shadow-sm border border-gray-100">
               <div>
                  <div className="text-[#2C201A] text-4xl font-bold tracking-tight mb-2">{totalVisits}</div>
                  <div className="text-gray-500 text-lg font-medium">Visits Today</div>
               </div>
               <div className="w-16 h-16 min-w-[64px] rounded-full bg-[#fdf8f4] flex items-center justify-center text-[#D97706]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               </div>
            </div>

            <div className="big-static-card bg-white rounded-2xl p-6 flex flex-row items-center justify-between shadow-sm border border-gray-100">
               <div>
                  <div className="text-[#2C201A] text-4xl font-bold tracking-tight mb-2">{totalPoints}</div>
                  <div className="text-gray-500 text-lg font-medium">Points Issued</div>
               </div>
               <div className="w-16 h-16 min-w-[64px] rounded-full bg-[#fdf8f4] flex items-center justify-center text-[#D97706]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
               </div>
            </div>

            <div className="big-static-card bg-white rounded-2xl p-6 flex flex-row items-center justify-between shadow-sm border border-gray-100">
               <div>
                  <div className="text-[#2C201A] text-4xl font-bold tracking-tight mb-2">{activeRewards}</div>
                  <div className="text-gray-500 text-lg font-medium">Activated Today</div>
               </div>
               <div className="w-16 h-16 min-w-[64px] rounded-full bg-[#fdf8f4] flex items-center justify-center text-[#D97706]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
               </div>
            </div>

            <div className="big-static-card bg-white rounded-2xl p-6 flex flex-row items-center justify-between shadow-sm border border-gray-100">
               <div>
                  <div className="text-[#2C201A] text-4xl font-bold tracking-tight mb-2">{redeemedRewards}</div>
                  <div className="text-gray-500 text-lg font-medium">Redeemed Today</div>
               </div>
               <div className="w-16 h-16 min-w-[64px] rounded-full bg-[#fdf8f4] flex items-center justify-center text-[#D97706]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
               </div>
            </div>

            <div className="big-static-card bg-white rounded-2xl p-6 flex flex-row items-center justify-between shadow-sm border border-gray-100">
               <div>
                  <div className="text-[#2C201A] text-4xl font-bold tracking-tight mb-2">{expRewards}</div>
                  <div className="text-gray-500 text-lg font-medium">Expiring Risk (7d)</div>
               </div>
               <div className="w-16 h-16 min-w-[64px] rounded-full bg-[#fdf8f4] flex items-center justify-center text-[#D97706]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
               </div>
            </div>

         </div>

         {/* Distribution Pie Charts Row */}
         <div className="row" style={{ marginBottom: '20px', marginTop: '20px' }}>
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
               <div className="card h-100 overflow-y-auto" >
                  <div className="card-header">
                     <h4 className="card-title flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                        Global Event Stream
                     </h4>
                  </div>
                  <div className="card-body p-4 " style={{ maxHeight: '400px' }}>
                     <div className="flex flex-col gap-3">
                        {data.recentActivity && data.recentActivity.length > 0 ? (
                           data.recentActivity.map((a, i) => (
                              <div className="global-event-card  flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md" key={i}>
                                 <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex-shrink-0 flex items-center justify-center text-[#D4A373] border border-[#E7E5E4]">
                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    </div>
                                    <div>
                                       <h6 className="mb-1 text-sm font-bold text-[#2C201A]">{a.action}</h6>
                                       <p className="mb-0 text-xs text-gray-500 line-clamp-1">{a.customer} <span className="font-medium">@</span> <span className="font-semibold text-[#D97706]">{a.branch}</span></p>
                                       <p> <span className="text-[11px] font-semibold text-[#8C6239] bg-[#FAF8F5] px-2 py-1.5 rounded-md border border-[#E7E5E4]">{a.time}</span></p>
                                    </div>
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
