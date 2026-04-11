import React, { useState, useEffect } from 'react';
import api from '../services/api';

const statusColor = { earned: '#f59e0b', activated: '#6366f1', redeemed: '#22c55e', expired: '#9ca3af', cancelled: '#ef4444' };

function Rewards() {
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = () => {
    setLoading(true);
    let params = filter !== 'all' ? `status=${filter}` : '';
    api.getRewards(params)
      .then(res => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRewards();
  }, [filter]);

  const handleRedeem = async (id) => {
    try {
      await api.redeemReward(id, { branch_id: 1 });
      fetchRewards();
    } catch (e) { alert('Error redeeming reward'); }
  };

  const handleVoid = async (id) => {
    try {
      await api.voidReward(id);
      fetchRewards();
    } catch (e) { alert('Error voiding reward'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rewards</h1>
          <p className="page-subtitle">Manage free item reward lifecycle across all branches</p>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'earned', 'activated', 'redeemed', 'expired', 'cancelled'].map(s => (
          <button
            key={s}
            className={`filter-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <p style={{ padding: '20px' }}>Loading rewards...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Earned</th>
                <th>Expires</th>
                <th>Earned Branch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => {
                const customer = r.customer || {};
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="customer-name">{customer.first_name} {customer.last_name || ''}</div>
                      <div className="customer-email">{customer.phone_number}</div>
                    </td>
                    <td>
                      <span className="status-pill" style={{ background: statusColor[r.status] + '22', color: statusColor[r.status] }}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(r.earned_at).toISOString().split('T')[0]}</td>
                    <td>{r.expires_at ? new Date(r.expires_at).toISOString().split('T')[0] : '—'}</td>
                    <td>{r.earned_branch?.name || '—'}</td>
                    <td className="action-btns">
                      {r.status === 'activated' && <button className="btn btn-sm btn-primary" onClick={() => handleRedeem(r.id)}>Redeem</button>}
                      {r.status === 'earned' && <button className="btn btn-sm btn-secondary" onClick={() => handleVoid(r.id)}>Void</button>}
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No rewards found in this state</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Rewards;
