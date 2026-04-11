import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Branches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBranches()
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Branches</h1>
          <p className="page-subtitle">Manage Caffissimo franchise locations</p>
        </div>
        <button className="btn btn-primary">+ Add Branch</button>
      </div>

      {loading ? <p>Loading branches...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {data.map((b) => (
            <div className="card" key={b.id} style={{ display: 'flex', flexDirection: 'column', padding: '24px', margin: 0, justifyContent: 'space-between' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#ebf8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    🏪
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2d3748' }}>{b.name}</div>
                    <div style={{ fontSize: '14px', color: '#718096', fontWeight: 500 }}>{b.code}</div>
                  </div>
                </div>
                <span className={`status-chip ${b.status || 'active'}`}>{b.status || 'Active'}</span>
              </div>

              {/* Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#4a5568' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ opacity: 0.7 }}>📍</span> 
                  <span>{b.address || '—'}, {b.suburb || '—'} {b.state || '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: 0.7 }}>📞</span> 
                  <span>{b.phone || '—'}</span>
                </div>
              </div>

              {/* Stats Box */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b6cb0' }}>{b.customers_count || 0}</div>
                  <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginTop: '4px' }}>Customers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b6cb0' }}>{(b.visits_count || 0).toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginTop: '4px' }}>Total Visits</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #edf2f7' }}>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Edit Detail</button>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>View Report</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Branches;
