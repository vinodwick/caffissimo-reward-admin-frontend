import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RedeemReward() {
  const navigate = useNavigate();
  
  // Identifier State
  const [identifier, setIdentifier] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Verification State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [rewardList, setRewardList] = useState([]);
  
  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Debounced search logic
  useEffect(() => {
    if (identifier.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    if (selectedCustomer && selectedCustomer.phone_number === identifier) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      api.getCustomers(`search=${encodeURIComponent(identifier)}`)
        .then(data => {
          const rows = data.data || data; 
          setSuggestions(rows);
          setShowSuggestions(true);
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [identifier, selectedCustomer]);

  const selectSuggestedCustomer = async (customer) => {
    setIsSearching(true);
    setIdentifier(customer.phone_number);
    setShowSuggestions(false);
    setError('');
    setSuccessMsg('');
    
    try {
       // Fetch full customer details including rewards
       const details = await api.getCustomer(customer.id);
       setSelectedCustomer(details.customer);
       // Filter activated or earned rewards
       setRewardList(details.rewards.filter(r => r.status === 'activated' || r.status === 'earned'));
    } catch(err) {
       setError("Error fetching customer data");
    }
    setIsSearching(false);
  };

  const clearSelection = () => {
    setSelectedCustomer(null);
    setIdentifier('');
    setRewardList([]);
    setSuccessMsg('');
    setError('');
  };

  const handleRegisterRedirect = () => {
    navigate('/customers/add', { state: { phone: identifier } });
  };

  const handleRedeem = async (rewardId) => {
    if (!window.confirm("Confirm redemption of this reward?")) return;
    setLoading(true);
    setError('');
    
    try {
      await api.redeemReward(rewardId, { branch_id: 1 }); // Default to branch 1
      setSuccessMsg("Reward successfully redeemed!");
      
      // Refresh the specific customer's reward list to remove the redeemed item
      const details = await api.getCustomer(selectedCustomer.id);
      setRewardList(details.rewards.filter(r => r.status === 'activated' || r.status === 'earned'));
      
      // Hide success message after 3 secs
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to redeem reward');
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title text-red-600">Redeem Free Item Reward</h1>
          <p className="page-subtitle">Lookup a customer and process their 7th visit free item claim.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* CUSTOMER SEARCH */}
        <div className="card" style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '16px', margin: '0 0 16px 0' }}>Step 1: Search Patron</h2>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Phone Number</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="0400000000"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (selectedCustomer) setSelectedCustomer(null);
                }}
                disabled={selectedCustomer !== null}
                style={{ flex: 1, background: selectedCustomer ? '#f8fafc' : 'white', fontSize: '18px' }}
              />
              {selectedCustomer && (
                <button type="button" className="btn" onClick={clearSelection} style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
                  Clear
                </button>
              )}
            </div>
            
            {/* Dropdown Auto-Complete */}
            {showSuggestions && !selectedCustomer && identifier.length >= 3 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 20, overflow: 'hidden' }}>
                {isSearching ? (
                  <div style={{ padding: '12px', fontSize: '13px', color: '#718096', textAlign: 'center' }}>Searching database...</div>
                ) : suggestions.length > 0 ? (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                    {suggestions.map((c) => (
                      <li key={c.id} onClick={() => selectSuggestedCustomer(c)} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '13px' }}>{c.phone_number}</div>
                          <div style={{ fontSize: '12px', color: '#718096' }}>{c.first_name} {c.last_name}</div>
                        </div>
                        <span style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{c.tier?.name || 'Bronze'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#e53e3e', fontWeight: 500 }}>⚠️ Customer Not Found</p>
                    <button type="button" onClick={handleRegisterRedirect} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      Register New Customer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CUSTOMER WALLET / REDEMPTION AREA */}
        {selectedCustomer && (
           <div className="card" style={{ padding: '24px', animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                 <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#2c5282' }}>{selectedCustomer.first_name} {selectedCustomer.last_name || ''}</h3>
                    <p style={{ margin: 0, color: '#4a5568', fontWeight: 500 }}>{selectedCustomer.phone_number}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <span className="tier-chip" data-tier={selectedCustomer.tier?.name?.toLowerCase() || 'bronze'} style={{ fontSize: '13px' }}>
                       {selectedCustomer.tier?.name || 'Bronze'}
                    </span>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#718096' }}>Visit {(selectedCustomer.visits_count || 0) % 7} / 7</div>
                 </div>
              </div>

              <h4 style={{ margin: '0 0 16px 0', color: '#e53e3e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span>🎁</span> Available Free Items
              </h4>

              {successMsg && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{successMsg}</div>}
              {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

              {rewardList.length > 0 ? (
                 <div style={{ display: 'grid', gap: '16px' }}>
                    {rewardList.map(r => (
                       <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px' }}>
                          <div>
                             <h4 style={{ margin: '0 0 4px 0', color: '#9b2c2c', fontSize: '16px' }}>Free Item — Cycle {r.cycle_number}</h4>
                             <p style={{ margin: 0, color: '#c53030', fontSize: '13px' }}>Expires: <strong>{new Date(r.expires_at).toLocaleDateString()}</strong></p>
                          </div>
                          <button 
                             className="btn btn-primary" 
                             onClick={() => handleRedeem(r.id)} 
                             disabled={loading}
                             style={{ background: '#e53e3e', border: 'none', padding: '10px 20px', fontSize: '14px', fontWeight: 'bold', borderRadius: '6px' }}
                          >
                             {loading ? 'Processing...' : 'REDEEM NOW'}
                          </button>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e0' }}>
                    <div style={{ fontSize: '32px', opacity: 0.5, marginBottom: '8px' }}>☕</div>
                    <p style={{ margin: 0, color: '#718096', fontWeight: 500 }}>No earned or activated rewards found for this customer.</p>
                 </div>
              )}
           </div>
        )}

      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default RedeemReward;
