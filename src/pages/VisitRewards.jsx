import React, { useState, useEffect } from 'react';
import api from '../services/api';

function VisitRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    valid_from: '',
    valid_to: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await api.getVisitRewards();
      setRewards(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('valid_from', formData.valid_from);
      fd.append('valid_to', formData.valid_to);
      fd.append('active', formData.active ? '1' : '0');
      if (imageFile) {
        fd.append('image', imageFile);
      }

      await api.createVisitReward(fd);
      setFormData({ name: '', description: '', valid_from: '', valid_to: '', active: true });
      setImageFile(null);
      if (document.getElementById('imageFile')) {
        document.getElementById('imageFile').value = '';
      }
      setShowAddForm(false);
      fetchRewards();
    } catch (err) {
      alert('Error creating reward configuration.');
      console.error(err);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Periodic Visit Rewards</h1>
          <p className="page-subtitle">Configure the free item given after the 7th visit</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Reward'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '15px' }}>Create Reward Configuration</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Reward Name (e.g., Free Coffee)</label>
              <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Valid From</label>
              <input type="date" className="form-control" required value={formData.valid_from} onChange={e => setFormData({...formData, valid_from: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Valid To</label>
              <input type="date" className="form-control" required value={formData.valid_to} onChange={e => setFormData({...formData, valid_to: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Reward Image (optional)</label>
              <input type="file" id="imageFile" className="form-control" onChange={e => setImageFile(e.target.files[0])} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ marginRight: '10px' }}>Active</label>
              <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary">Save Configuration</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading configurations...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Reward</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map(r => (
                <tr key={r.id}>
                  <td>
                    {r.image_url ? (
                      <img src={`http://localhost:8000${r.image_url}`} alt="reward" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px' }}></div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <small style={{ color: '#666' }}>{r.description || 'No description'}</small>
                  </td>
                  <td>{new Date(r.valid_from).toLocaleDateString()}</td>
                  <td>{new Date(r.valid_to).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-chip ${r.active ? 'active' : 'inactive'}`}>
                      {r.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {rewards.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No reward configurations found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VisitRewards;
