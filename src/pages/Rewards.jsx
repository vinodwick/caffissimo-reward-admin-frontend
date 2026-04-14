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
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="page-title">Reward Ledger</h1>
          <p className="page-subtitle text-gray-500">Track all member free items</p>
        </div>
      </div>

      <div className="filter-tabs flex flex-row overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide w-full whitespace-nowrap">
        {['all', 'earned', 'activated', 'redeemed', 'expired', 'cancelled'].map(s => (
          <button
            key={s}
            className={`filter-tab whitespace-nowrap ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card w-full overflow-hidden">
        {loading ? <p style={{ padding: '20px' }}>Loading rewards...</p> : (
          <div className="overflow-x-auto w-full">
            <table className="data-table min-w-[700px]">
              <thead>
                <tr>
                  <th>Loyalty member</th>
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
                        <div className="customer-name font-semibold text-gray-800">{customer.first_name} {customer.last_name || ''}</div>
                        <div className="customer-email text-sm text-gray-500">{customer.phone_number}</div>
                      </td>
                      <td>
                        <span className="status-pill inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ background: statusColor[r.status] + '22', color: statusColor[r.status] }}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">{new Date(r.earned_at).toISOString().split('T')[0]}</td>
                      <td className="text-sm text-gray-600">{r.expires_at ? new Date(r.expires_at).toISOString().split('T')[0] : '—'}</td>
                      <td className="text-sm text-gray-600">{r.earned_branch?.name || '—'}</td>
                      <td className="action-btns flex gap-2">
                        {r.status === 'activated' && <button className="btn btn-sm btn-primary whitespace-nowrap" onClick={() => handleRedeem(r.id)}>Redeem</button>}
                        {r.status === 'earned' && <button className="btn btn-sm btn-secondary whitespace-nowrap" onClick={() => handleVoid(r.id)}>Void</button>}
                      </td>
                    </tr>
                  );
                })}
                {data.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }} className="text-gray-500">No rewards found in this state</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rewards;
