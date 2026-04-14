import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Settings() {
  const [activeTab, setActiveTab] = useState('branding');
  const [settings, setSettings] = useState({
    system_name: '',
    system_logo: '',
    visit_threshold: 7,
    min_purchase_amount: 5.00,
    points_per_dollar: 1,
    reward_expiry_days: 30
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [apiRoutes, setApiRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getSettings(),
      api.getTiers(),
      api.getApiRoutes()
    ]).then(([settRes, tierRes, routesRes]) => {
      setSettings(prev => ({ ...prev, ...settRes }));
      setTiers(tierRes);
      setApiRoutes(routesRes);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings({
        visit_threshold: settings.visit_threshold,
        min_purchase_amount: settings.min_purchase_amount,
        points_per_dollar: settings.points_per_dollar,
        reward_expiry_days: settings.reward_expiry_days
      });
      
      for (const tier of tiers) {
        await api.updateTier(tier.id, tier);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving rule settings');
    }
  };

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('system_name', settings.system_name);
      if (logoFile) fd.append('system_logo', logoFile);

      const res = await api.updateBranding(fd);
      
      // Update local storage so the sidebar can read it on next refresh or standard event
      localStorage.setItem('system_name', settings.system_name);
      // Let's trigger a page refresh so sidebar updates immediately
      window.location.reload();

    } catch (err) {
      alert('Error saving branding settings');
    }
  };

  const updateSetting = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  
  const updateTierMax = (id, maxVal) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, max_points: maxVal } : t));
  };

  if (loading) return <div className="page"><div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading Platform Configuration...</div></div>;

  return (
    <div className="page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Global Platform Settings</h1>
          <p className="page-subtitle">Update rules, points, and app settings.</p>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', gap: '32px' }}>
        {[
          { id: 'branding', label: 'Branding & Theme' },
          { id: 'rules', label: 'Loyalty Rules' },
          { id: 'tiers', label: 'Tier Scaling' },
          { id: 'apis', label: 'Live APIs & Documentation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #6F4E37' : '2px solid transparent',
              color: activeTab === tab.id ? '#6F4E37' : '#718096',
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

      {saved && <div className="alert alert-success" style={{ marginBottom: '20px' }}>✅ Framework rules updated and saved successfully!</div>}

      {/* BRANDING TAB */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding}>
          <div className="card" style={{ maxWidth: '600px' }}>
            <div className="card-header"><h2 style={{ fontSize: '18px', margin: 0 }}>System Identity</h2></div>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>This identity will be injected across all internal operational apps.</p>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>System Name / Franchise Alias</label>
              <input 
                type="text" 
                value={settings.system_name || ''} 
                onChange={(e) => updateSetting('system_name', e.target.value)} 
                placeholder="e.g. Caffissimo Rewards"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Sidebar Logo (Upload Image)</label>
              {settings.system_logo && !logoFile && (
                <div style={{ marginBottom: '10px' }}>
                  <img src={`http://localhost:8000${settings.system_logo}`} alt="Current Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])} 
              />
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ background: '#6F4E37' }}>Inject Custom Branding</button>
            </div>
          </div>
        </form>
      )}

      {/* RULES TAB */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveSettings}>
          <div className="card" style={{ maxWidth: '600px' }}>
            <div className="card-header"><h2 style={{ fontSize: '18px', margin: 0 }}>Core Reward Mechanics</h2></div>
            
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Visit Reward Cycle Threshold</label>
              <input type="number" min="1" max="20" value={settings.visit_threshold} onChange={(e) => updateSetting('visit_threshold', e.target.value)} />
              <span className="form-hint">Number of visits required to earn one free product cycle.</span>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Minimum Required Spend (Per Visit)</label>
              <input type="number" step="0.50" min="0" value={settings.min_purchase_amount} onChange={(e) => updateSetting('min_purchase_amount', e.target.value)} />
              <span className="form-hint">Baseline spend a customer must execute for the visit to map into the cycle.</span>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Points Accumulation Engine</label>
              <input type="number" min="1" value={settings.points_per_dollar} onChange={(e) => updateSetting('points_per_dollar', e.target.value)} />
              <span className="form-hint">Points issued per every $1 successfully spent.</span>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Reward Expiration TTL (Days)</label>
              <input type="number" min="1" value={settings.reward_expiry_days} onChange={(e) => updateSetting('reward_expiry_days', e.target.value)} />
              <span className="form-hint">Time to live before an activated gift invalidates.</span>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary">Lock Mechanics</button>
            </div>
          </div>
        </form>
      )}

      {/* TIERS TAB */}
      {activeTab === 'tiers' && (
        <form onSubmit={handleSaveSettings}>
          <div className="card" style={{ maxWidth: '800px' }}>
            <div className="card-header"><h2 style={{ fontSize: '18px', margin: 0 }}>Progressive Tier Scaffolding</h2></div>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>Adjust the mathematical boundaries mapping point milestones to membership levels.</p>

            <div className="tier-settings" style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {tiers.map((t, idx) => {
                const prevTier = idx > 0 ? tiers[idx - 1] : null;
                const minPoints = prevTier ? parseInt(prevTier.max_points) + 1 : 0;
                
                return (
                  <div className="tier-setting-row" key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: idx !== tiers.length-1 ? '1px solid #edf2f7' : 'none' }}>
                    <div style={{ width: '120px' }}>
                      <span className="tier-chip" data-tier={t.name.toLowerCase()} style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>{t.name}</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#4a5568', fontWeight: 600 }}>{minPoints}</span>
                      <span style={{ color: '#a0aec0' }}>–</span>
                      {t.name === 'Gold' ? (
                        <input type="text" value="∞" disabled style={{ width: '120px', textAlign: 'center', background: '#edf2f7', border: '1px solid #cbd5e0', color: '#a0aec0' }} />
                      ) : (
                        <input type="number" value={t.max_points || ''} onChange={(e) => updateTierMax(t.id, e.target.value)} style={{ width: '120px', textAlign: 'center' }} />
                      )}
                      <span style={{ fontSize: '14px', color: '#718096' }}>points</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary">Propagate Tier Logic</button>
            </div>
          </div>
        </form>
      )}

      {/* APIs TAB */}
      {activeTab === 'apis' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #edf2f7', background: '#faf5ff' }}>
            <h2 style={{ fontSize: '18px', margin: 0, color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> Backend API Directory (V1 Live)
            </h2>
            <p style={{ fontSize: '14px', color: '#6b46c1', marginTop: '8px' }}>This table intelligently interfaces with Laravel's router to auto-generate endpoint documentation. Adding a new route in the codebase instantly maps here.</p>
          </div>
          <table className="data-table" style={{ width: '100%', margin: 0 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', width: '10%' }}>Method</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', width: '50%' }}>Endpoint Path</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', width: '40%' }}>Controller Binding</th>
              </tr>
            </thead>
            <tbody>
              {apiRoutes.map((route, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      background: route.method.includes('GET') ? '#e6fffa' : route.method.includes('POST') ? '#F0E6DD' : route.method.includes('PUT') ? '#fffff0' : '#fff5f5',
                      color: route.method.includes('GET') ? '#319795' : route.method.includes('POST') ? '#8C6239' : route.method.includes('PUT') ? '#d69e2e' : '#e53e3e' 
                    }}>
                      {route.method}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '13px', color: '#2d3748' }}>{route.uri}</td>
                  <td style={{ padding: '16px 24px', color: '#718096', fontSize: '13px' }}>{route.action}</td>
                </tr>
              ))}
              {apiRoutes.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#a0aec0' }}>Awaiting router diagnostics...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Settings;
