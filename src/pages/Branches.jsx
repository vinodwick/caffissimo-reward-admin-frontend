import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Branches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    suburb: '',
    state: '',
    phone: ''
  });

  const loadBranches = () => {
    setLoading(true);
    api.getBranches()
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.createBranch(formData);
      setShowModal(false);
      setFormData({ name: '', code: '', address: '', suburb: '', state: '', phone: '' });
      loadBranches();
    } catch (err) {
      setError(err?.errors?.message || err?.message || 'Failed to create branch. Code may already exist.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="page-title">Branches</h1>
          <p className="page-subtitle text-gray-500">Manage Caffissimo franchise locations</p>
        </div>
        <button className="btn btn-primary whitespace-nowrap" onClick={() => setShowModal(true)}>+ Add Branch</button>
      </div>

      {loading ? <p>Loading branches...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((b) => (
            <div className="card" key={b.id} style={{ display: 'flex', flexDirection: 'column', padding: '24px', margin: 0, justifyContent: 'space-between' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F0E6DD', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
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
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6F4E37' }}>{b.customers_count || 0}</div>
                  <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginTop: '4px' }}>Customers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6F4E37' }}>{(b.visits_count || 0).toLocaleString()}</div>
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

      {/* Add Branch Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Add New Branch</h2>
            {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} className="form-stack">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Branch Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Caffissimo CBD" />
                </div>
                <div className="form-group">
                  <label>Branch Code *</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} required placeholder="e.g. CBD01" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="e.g. 123 Main St" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Suburb</label>
                  <input type="text" name="suburb" value={formData.suburb} onChange={handleInputChange} placeholder="e.g. Melbourne" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. VIC" />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. 03 9876 5432" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button type="button" className="btn btn-secondary w-full" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  {saving ? 'Saving...' : 'Add Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Branches;
