import React, { useState } from 'react';

function Help() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Help & Documentation</h1>
          <p className="page-subtitle">User manual and system information</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '20px', gap: '10px' }}>
          <button 
            style={{ 
              padding: '10px 20px', 
              borderBottom: activeTab === 'general' ? '2px solid #2b6cb0' : '2px solid transparent', 
              fontWeight: activeTab === 'general' ? 'bold' : 'normal', 
              color: activeTab === 'general' ? '#2b6cb0' : '#666', 
              background: 'none', 
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer', 
              fontSize: '16px',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('general')}
          >
            System Information
          </button>
          <button 
            style={{ 
              padding: '10px 20px', 
              borderBottom: activeTab === 'manual' ? '2px solid #2b6cb0' : '2px solid transparent', 
              fontWeight: activeTab === 'manual' ? 'bold' : 'normal', 
              color: activeTab === 'manual' ? '#2b6cb0' : '#666', 
              background: 'none', 
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer', 
              fontSize: '16px',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('manual')}
          >
            User Manual
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="tab-content" style={{ padding: '10px 0', animation: 'fadeIn 0.3s' }}>
            <h2 style={{ marginBottom: '20px' }}>System Information</h2>
            
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '15px' }}>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>Project For</span>
                <span style={{ fontWeight: 'bold' }}>Caffissimo Australia</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '15px' }}>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>System Version</span>
                <span>2.0.0 (Loyalty & Rewards Suite)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '15px' }}>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>Developed By</span>
                <span><strong style={{ color: '#2b6cb0' }}>AAKIV PVT LTD</strong>, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '15px' }}>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>Developer Website</span>
                <span><a href="https://aakiv.com" target="_blank" rel="noreferrer" style={{color: '#2b6cb0', textDecoration: 'none'}}>www.aakiv.com</a></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>Support Contact</span>
                <span><a href="mailto:support@aakiv.com" style={{color: '#2b6cb0', textDecoration: 'none'}}>support@aakiv.com</a></span>
              </div>
            </div>
            
            <div style={{ marginTop: '30px', padding: '20px', background: '#ebf8ff', borderRadius: '8px', borderLeft: '4px solid #3182ce' }}>
              <h3 style={{ color: '#2b6cb0', marginBottom: '10px' }}>About AAKIV PVT LTD</h3>
              <p style={{ lineHeight: '1.6', color: '#2d3748' }}>
                AAKIV PVT LTD is a premier software development house based in Sri Lanka, specializing in creating high-performance, scalable web and mobile solutions. We partnered with Caffissimo Australia to deliver a modern, multi-branch Loyalty and Reward Suite tailored for rapid retail deployments.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="tab-content" style={{ padding: '10px 0', animation: 'fadeIn 0.3s' }}>
            <h2 style={{ marginBottom: '10px' }}>User Manual</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>Follow this introductory guide to manage the Caffissimo Loyalty System effectively.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2b6cb0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" /></svg>
                </div>
                <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '18px' }}>1. Recording Visits</h3>
                <p style={{ color: '#4a5568', lineHeight: '1.5', fontSize: '14px' }}>Navigate to the <b>Record Visit</b> page. Search for a customer using their phone number, email, or QR Code. Enter the purchase amount and record the visit. If it's their 7th visit, a Free Item Reward is automatically generated.</p>
              </div>

              <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2b6cb0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
                <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '18px' }}>2. Managing Customers</h3>
                <p style={{ color: '#4a5568', lineHeight: '1.5', fontSize: '14px' }}>Use the <b>Customers</b> page to view customer profiles, adjust points, and check their reward tier status. You can drill down into any customer to see their visit history and reward timeline.</p>
              </div>

              <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2b6cb0"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" /></svg>
                </div>
                <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '18px' }}>3. Visit Rewards</h3>
                <p style={{ color: '#4a5568', lineHeight: '1.5', fontSize: '14px' }}>Under <b>Visit Rewards</b> (Admin), configure what free item customers get for their 7th visit during specific months (e.g. Free Muffin in May). These rewards trigger automatically on visit 7.</p>
              </div>

              <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2b6cb0"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" /></svg>
                </div>
                <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '18px' }}>4. Understanding Tiers</h3>
                <p style={{ color: '#4a5568', lineHeight: '1.5', fontSize: '14px' }}>Tiers (Bronze, Silver, Gold) are assigned based on a customer's points over time. The thresholds and multipliers can be managed inside the <b>Settings</b> area.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Help;
