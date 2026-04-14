import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Customers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    let params = [];
    if (search) params.push(`search=${search}`);
    if (tierFilter && tierFilter !== 'All Tiers') params.push(`tier=${tierFilter}`);
    api.getCustomers(params.join('&'))
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delay = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(delay);
  }, [search, tierFilter]);

  return (
    <div className="page">
      <div className="page-header flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle text-gray-500">Search and manage customer loyalty profiles</p>
        </div>
        <Link to="/customers/add" className="btn btn-primary whitespace-nowrap">+ Add Customer</Link>
      </div>

      <div className="card">
        <div className="table-toolbar flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            className="search-input flex-1 min-w-[200px]"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select w-full sm:w-auto" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
            <option value="">All Tiers</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        {loading ? (
          <p style={{ padding: '20px' }}>Loading customers...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table min-w-[800px] w-full">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Tier</th>
                  <th>Points</th>
                  <th>Visits</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">{c.first_name[0]}</div>
                        <div>
                          <div className="customer-name">{c.first_name} {c.last_name || ''}</div>
                          <div className="customer-email">{c.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.phone_number}</td>
                    <td>
                      <span className="tier-chip" data-tier={c.tier?.name?.toLowerCase() || 'bronze'}>
                        {c.tier?.name || 'Bronze'}
                      </span>
                    </td>
                    <td>{c.points_balance}</td>
                    <td>{c.visits_count}</td>
                    <td>
                      <span className={`status-chip ${c.status === 'active' ? 'active' : 'inactive'}`}>{c.status}</span>
                    </td>
                    <td>
                      <Link to={`/customers/${c.id}`} className="btn btn-sm btn-secondary">View</Link>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
