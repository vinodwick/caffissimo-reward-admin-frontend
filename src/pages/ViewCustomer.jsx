import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [visits, setVisits] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = () => {
    setLoading(true);
    api.getCustomer(id)
      .then(res => {
        setCustomer(res.customer || res);
        setVisits(res.visits || []);
        setRewards(res.rewards || []);
      })
      .catch(err => {
        setError(err.message || 'Error loading customer details');
        console.error('Fetch customer details error', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="page"><div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading customer profile...</div></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!customer) return <div className="page"><p>Customer not found</p></div>;

  // Calculate Progress (Assuming latest visit has the cycle number, or use modulo)
  const currentProgress = visits.length > 0 ? (visits[0].cycle_visit_number === 7 ? 0 : visits[0].cycle_visit_number) : 0;
  const progressPct = (currentProgress / 7) * 100;

  return (
    <div className="page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <button onClick={() => navigate('/customers')} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', fontSize: '13px' }}>
            <span>←</span> Back to Customers
          </button>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {customer.first_name} {customer.last_name || ''}
            <span className={`status-chip ${customer.status === 'active' ? 'active' : 'inactive'}`} style={{ fontSize: '12px' }}>{customer.status}</span>
          </h1>
          <p className="page-subtitle">Detailed Profile & Loyalty History</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Current Tier</div>
          <span className="tier-chip" data-tier={customer.tier?.name?.toLowerCase() || 'bronze'} style={{ fontSize: '18px', padding: '6px 16px', marginTop: '4px' }}>
            {customer.tier?.name || 'Bronze'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Identity Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #edf2f7' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#4a5568' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', opacity: 0.7 }}>📱</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 600 }}>Phone</div>
                  <div style={{ fontWeight: 500, color: '#2b6cb0' }}>{customer.phone_number}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', opacity: 0.7 }}>✉️</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 600 }}>Email</div>
                  <div>{customer.email || 'Not provided'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', opacity: 0.7 }}>📍</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 600 }}>Address</div>
                  <div>{customer.address || 'Not provided'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', opacity: 0.7 }}>🎂</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 600 }}>Date of Birth</div>
                  <div>{customer.dob || 'Not provided'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', opacity: 0.7 }}>🏪</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: 600 }}>Registered Branch</div>
                  <div>{customer.branch?.name || 'Any'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Rewards */}
          <div className="card" style={{ padding: '24px', background: '#f5f3ff', border: '1px solid #ede9fe' }}>
            <h3 style={{ fontSize: '16px', color: '#5b21b6', marginBottom: '16px' }}>🎁 Available Gifts</h3>
            {rewards.filter(r => r.status === 'activated').length === 0 ? (
              <p style={{ color: '#8b5cf6', fontSize: '14px' }}>No gifts are currently activated for redemption.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rewards.filter(r => r.status === 'activated').map(r => (
                  <div key={r.id} style={{ background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: '#4c1d95' }}>{r.reward_name}</div>
                    <div style={{ fontSize: '12px', color: '#8b5cf6', background: '#ede9fe', padding: '4px 8px', borderRadius: '4px' }}>
                      Exp: {new Date(r.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Progress & Stats Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #edf2f7' }}>Loyalty Progress</h3>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Points</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2b6cb0' }}>{customer.points_balance}</div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Visits</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#38a169' }}>{customer.visits_count}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#4a5568' }}>7-Visit Reward Journey</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#d97706' }}>{currentProgress} / 7</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', height: '16px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map(step => (
                  <div 
                    key={step} 
                    style={{ 
                      flex: 1, 
                      borderRadius: '4px', 
                      background: step <= currentProgress ? '#f59e0b' : '#edf2f7',
                      transition: 'background 0.3s'
                    }}
                  ></div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px', textAlign: 'right' }}>
                {7 - currentProgress} more visits until the next free item!
              </p>
            </div>
          </div>

          {/* Visits Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #edf2f7', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '15px', color: '#2d3748', margin: 0 }}>Recent Visit History</h3>
            </div>
            <table className="data-table" style={{ width: '100%', margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 20px' }}>Date</th>
                  <th style={{ padding: '12px 20px' }}>Branch</th>
                  <th style={{ textAction: 'right', padding: '12px 20px' }}>Amount Spent</th>
                  <th style={{ padding: '12px 20px' }}>Cycle Stamp</th>
                </tr>
              </thead>
              <tbody>
                {visits.slice(0, 5).map(v => (
                  <tr key={v.id}>
                    <td style={{ padding: '12px 20px', color: '#4a5568' }}>{new Date(v.visited_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 20px', color: '#4a5568' }}>{v.branch?.name || '—'}</td>
                    <td style={{ padding: '12px 20px', color: '#4a5568', fontWeight: 500 }}>${v.purchase_amount}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ background: '#ebf8ff', color: '#2b6cb0', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                        {v.cycle_visit_number}/7
                      </span>
                    </td>
                  </tr>
                ))}
                {visits.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>No visits recorded yet.</td></tr>
                )}
              </tbody>
            </table>
            {visits.length > 5 && (
              <div style={{ padding: '10px', textAlign: 'center', color: '#718096', fontSize: '12px', borderTop: '1px solid #edf2f7' }}>
                Showing last 5 of {visits.length} visits
              </div>
            )}
          </div>

          {/* Rewards History Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #edf2f7', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '15px', color: '#2d3748', margin: 0 }}>Reward Lifecycle</h3>
            </div>
            <table className="data-table" style={{ width: '100%', margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 20px' }}>Reward Parameter</th>
                  <th style={{ padding: '12px 20px' }}>Status</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Date Earned</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map(r => (
                  <tr key={r.id}>
                    <td style={{ padding: '12px 20px', color: '#4a5568', fontWeight: 500 }}>{r.reward_name}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span className={`status-chip ${r.status === 'redeemed' ? 'active' : ''}`} style={{ fontSize: '11px' }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right', color: '#718096' }}>{new Date(r.earned_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {rewards.length === 0 && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>No reward cycles completed yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCustomer;
