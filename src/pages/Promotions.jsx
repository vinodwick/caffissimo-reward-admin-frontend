import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Promotions() {
  const [tab, setTab] = useState('active');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getPromotions(`status=${tab}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Promotions</h1>
          <p className="page-subtitle">Manage campaigns, bonus points, and special offers</p>
        </div>
        <button className="btn btn-primary">+ New Promotion</button>
      </div>

      <div className="filter-tabs">
        <button className={`filter-tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>Active</button>
        <button className={`filter-tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>Past</button>
      </div>

      <div className="card">
        {loading ? <p style={{ padding: '20px' }}>Loading promotions...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Branch Scope</th>
                <th>Tier Scope</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.type}</td>
                  <td>{p.branch_scope || 'All'}</td>
                  <td>{p.tier_scope || 'All'}</td>
                  <td>{new Date(p.start_at).toISOString().split('T')[0]}</td>
                  <td>{new Date(p.end_at).toISOString().split('T')[0]}</td>
                  <td>
                    <span className={`status-chip ${p.active ? 'active' : 'inactive'}`}>
                      {p.active ? 'Active' : 'Ended'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center' }}>No promotions found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Promotions;
