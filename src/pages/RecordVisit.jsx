import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import QRScanner from '../components/QRScanner';

function RecordVisit() {
  const navigate = useNavigate();
  
  // Step 1: Identifier State
  const [identifier, setIdentifier] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Step 2: Verification State
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Step 3: Transaction State
  const [amount, setAmount] = useState('');
  const [sourceReference, setSourceReference] = useState('');
  const [qualifiesVisit, setQualifiesVisit] = useState(true);
  
  // Submission State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Debounced search logic for Step 1
  useEffect(() => {
    if (identifier.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // If we just selected a customer, don't re-search while the input reflects their phone
    if (selectedCustomer && selectedCustomer.phone_number === identifier) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      api.getCustomers(`search=${encodeURIComponent(identifier)}`)
        .then(data => {
          // data.data assuming pagination, or fallback to array if backend returns raw array
          const rows = data.data || data; 
          setSuggestions(rows);
          setShowSuggestions(true);
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [identifier, selectedCustomer]);

  const selectSuggestedCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIdentifier(customer.phone_number);
    setShowSuggestions(false);
    setError('');
    setResult(null);
  };

  const clearSelection = () => {
    setSelectedCustomer(null);
    setIdentifier('');
    setResult(null);
    setAmount('');
  };

  const handleRegisterRedirect = () => {
    navigate('/customers/add', { state: { phone: identifier } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError("You must verify a customer before recording.");
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.recordVisit({
        phone_number: selectedCustomer.phone_number,
        purchase_amount: parseFloat(amount),
        branch_id: 1, // Using default 1 temporarily
        qualifies_visit: qualifiesVisit,
        source_reference: sourceReference,
      });
      setResult(res);
      setAmount('');
      setSourceReference('');
      // Keep customer selected so they see the result cleanly
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).flat().join(', '));
      } else {
        setError(err.message || 'An error occurred.');
      }
    }
    setLoading(false);
  };

  const cycleWidth = result ? `${(result.visit.cycle_visit_number / 7) * 100}%` : '0%';

  return (
    <div className="page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Record Visit Transaction</h1>
          <p className="page-subtitle">Verify the patron's identity before calculating purchase thresholds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Verification & Transaction Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* STEP 1: VERIFICATION */}
          <div className="card" style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', color: '#2d3748', margin: 0 }}>Step 1: Identity Lookup</h2>
              <span style={{ fontSize: '12px', background: selectedCustomer ? '#c6f6d5' : '#e2e8f0', color: selectedCustomer ? '#22543d' : '#718096', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                {selectedCustomer ? 'Verified' : 'Pending'}
              </span>
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Patron Identifier (Phone)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g. 0400000000"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (selectedCustomer) setSelectedCustomer(null);
                  }}
                  disabled={selectedCustomer !== null}
                  style={{ flex: 1, background: selectedCustomer ? '#f8fafc' : 'white' }}
                />
                {!selectedCustomer ? (
                  <button type="button" className="btn btn-secondary flex items-center gap-2 justify-center" onClick={() => setIsScanning(!isScanning)} style={{ padding: '8px 16px', minWidth: '110px' }}>
                    {isScanning ? 'Close' : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Scan QR
                      </>
                    )}
                  </button>
                ) : (
                  <button type="button" className="btn" onClick={clearSelection} style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
                    Clear
                  </button>
                )}
              </div>
              
              {/* Intelligent Dropdown */}
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
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#e53e3e', fontWeight: 500 }}>⚠️ Unknown Identity</p>
                      <button type="button" onClick={handleRegisterRedirect} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        Register New Customer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isScanning && !selectedCustomer && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <QRScanner
                  onScanSuccess={(decodedText) => {
                    setIdentifier(decodedText);
                    setIsScanning(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* STEP 2: TRANSACTION CAPTURE (Animated Entry) */}
          <div 
            className="card" 
            style={{ 
              padding: '24px', 
              opacity: selectedCustomer ? 1 : 0.4, 
              pointerEvents: selectedCustomer ? 'auto' : 'none',
              transform: selectedCustomer ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          >
            <h2 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '16px', margin: 0 }}>Step 2: Transaction Capture</h2>
            <form onSubmit={handleSubmit} className="form-stack">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Total Purchase Value ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={!selectedCustomer}
                  style={{ fontSize: '18px', fontWeight: 'bold', color: '#6F4E37' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>External Invoice Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. INV-10023"
                  value={sourceReference}
                  onChange={(e) => setSourceReference(e.target.value)}
                  disabled={!selectedCustomer}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <label className="toggle-label" style={{ margin: 0, cursor: selectedCustomer ? 'pointer' : 'default' }}>
                  <input
                    type="checkbox"
                    checked={qualifiesVisit}
                    onChange={(e) => setQualifiesVisit(e.target.checked)}
                    disabled={!selectedCustomer}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#4a5568' }}>Counts as a Qualified Loyalty Visit</span>
                </label>
              </div>
              
              {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
              
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || !selectedCustomer} style={{ background: '#38a169', border: 'none', padding: '12px', fontSize: '15px' }}>
                {loading ? 'Processing Ledger...' : 'Secure & Record Visit'}
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic State Info / Result Panel */}
        <div style={{ position: 'sticky', top: '24px' }}>
          {selectedCustomer && !result ? (
            <div className="card" style={{ padding: '24px', background: '#F0E6DD', border: '1px solid #bee3f8', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', background: '#8C6239', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 12px auto' }}>
                  {selectedCustomer.first_name?.[0] || 'G'}
                </div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#2c5282' }}>{selectedCustomer.first_name} {selectedCustomer.last_name || ''}</h3>
                <p style={{ margin: 0, color: '#6F4E37', fontWeight: 600 }}>{selectedCustomer.phone_number}</p>
              </div>
              
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>
                  <span style={{ color: '#718096', fontSize: '13px' }}>Loyalty Tier</span>
                  <span style={{ fontWeight: 'bold', color: '#4a5568' }}>{selectedCustomer.tier?.name || 'Bronze'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>
                  <span style={{ color: '#718096', fontSize: '13px' }}>Current Points</span>
                  <span style={{ fontWeight: 'bold', color: '#d69e2e' }}>{selectedCustomer.points_balance} pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096', fontSize: '13px' }}>Visit Journey</span>
                  <span style={{ fontWeight: 'bold', color: '#38a169' }}>{selectedCustomer.visits_count % 7} / 7</span>
                </div>
              </div>
            </div>
          ) : result ? (
             <div className="card result-card" style={{ padding: '24px', background: '#f0fff4', border: '1px solid #c6f6d5', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', background: '#38a169', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px auto' }}>
                  ✓
                </div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#22543d' }}>Success</h3>
                <p style={{ margin: 0, color: '#276749', fontSize: '14px' }}>Transaction recorded for {result.customer.first_name}</p>
              </div>
              
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
                <div className="result-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#718096', fontSize: '13px' }}>Points Earned</span>
                  <strong style={{ color: '#d69e2e' }}>+{result.points.points_delta} pts</strong>
                </div>
                <div className="result-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#718096', fontSize: '13px' }}>Visit Cycle</span>
                  <strong style={{ color: '#38a169' }}>{result.visit.cycle_visit_number} / 7</strong>
                </div>
                <div className="mini-progress" style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="mini-fill" style={{ height: '100%', width: cycleWidth, background: '#38a169', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                </div>
              </div>

              {result.visit.cycle_visit_number === 7 && (
                <div className="reward-banner" style={{ background: '#fbd38d', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', color: '#744210', border: '1px solid #f6ad55', animation: 'pulse 2s infinite' }}>
                  🎉 Free Item Reward Issued!
                </div>
              )}
            </div>
          ) : (
            <div className="card empty-state" style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e0' }}>
              <div style={{ fontSize: '40px', opacity: 0.5, marginBottom: '16px' }}>🔍</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#4a5568', fontSize: '16px' }}>Awaiting Identity</h3>
              <p style={{ margin: 0, color: '#a0aec0', fontSize: '13px' }}>Scan a QR code or type a phone number to fetch customer status.</p>
            </div>
          )}
        </div>
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

export default RecordVisit;
