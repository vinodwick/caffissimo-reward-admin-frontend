import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

function AddCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPhone = location.state?.phone || '';
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    phone_number: initialPhone,
    email: '',
    address: '',
    dob: '',
    registered_branch_id: ''
  });

  useEffect(() => {
    api.getBranches()
      .then(res => setBranches(res))
      .catch(err => console.error('Fetch branches error', err));
  }, []);

  const handleChange = e => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.createCustomer(newCustomer);
      if (res.customer) {
         navigate('/customers');
      }
    } catch (err) {
      setError(err.errors ? Object.values(err.errors).flat().join(', ') : (err.message || 'Error creating customer'));
      console.error('Create customer error', err);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: 'var(--iq-secondary)', fontSize: '14px', fontWeight: '500', marginBottom: '8px' };
  const inputStyle = { background: '#ffffff', border: '1px solid #EAEAEA', borderRadius: '4px', fontSize: '14px' };

  return (
    <div className="container-fluid iq-container">
      <div className="row">
         <div className="col-lg-12">
            <div className="card">
               <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                     <h4 className="card-title text-dark">New User Information</h4>
                  </div>
               </div>
               
               <div className="card-body">
                  <form onSubmit={handleSubmit}>
                     {error && <div className="alert-error">{error}</div>}
                     
                     <div className="row">
                        <div className="form-group col-md-6 mb-4">
                           <label style={labelStyle}>First Name:</label>
                           <input 
                              type="text"
                              name="first_name" 
                              value={newCustomer.first_name} 
                              onChange={handleChange} 
                              style={inputStyle}
                              placeholder="First Name"
                              required 
                           />
                        </div>
                        
                        <div className="form-group col-md-6 mb-4">
                           <label style={labelStyle}>Last Name:</label>
                           <input 
                              type="text"
                              name="last_name" 
                              value={newCustomer.last_name} 
                              onChange={handleChange} 
                              style={inputStyle}
                              placeholder="Last Name"
                           />
                        </div>

                        <div className="form-group col-md-6 mb-4">
                           <label style={labelStyle}>Mobile Number: *</label>
                           <input 
                              type="text"
                              name="phone_number" 
                              value={newCustomer.phone_number} 
                              onChange={handleChange} 
                              style={inputStyle}
                              placeholder="Mobile Number"
                              required 
                           />
                        </div>

                        <div className="form-group col-md-6 mb-4">
                           <label style={labelStyle}>Email:</label>
                           <input 
                              type="email"
                              name="email" 
                              value={newCustomer.email} 
                              onChange={handleChange} 
                              style={inputStyle}
                              placeholder="Email"
                           />
                        </div>
                        
                        <div className="form-group col-md-6 mb-4">
                           <label style={labelStyle}>Date of Birth:</label>
                           <input 
                              type="date"
                              name="dob" 
                              value={newCustomer.dob} 
                              onChange={handleChange} 
                              style={inputStyle}
                           />
                        </div>

                        <div className="form-group col-md-6 mb-4">
                           <label style={labelStyle}>Registered Branch:</label>
                           <select 
                              name="registered_branch_id" 
                              value={newCustomer.registered_branch_id} 
                              onChange={handleChange}
                              style={inputStyle}
                           >
                              <option value="">Select Branch</option>
                              {branches.map(b => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                           </select>
                        </div>
                        
                        <div className="form-group col-md-12 mb-4">
                           <label style={labelStyle}>Physical Address:</label>
                           <input 
                              type="text"
                              name="address" 
                              value={newCustomer.address} 
                              onChange={handleChange} 
                              style={inputStyle}
                              placeholder="Full Address"
                           />
                        </div>
                     </div>
                     
                     <hr className="my-4" style={{ borderColor: '#eee' }} />
                     
                     <div className="row">
                        <div className="col-12 mt-2">
                           <button type="submit" className="btn btn-primary" disabled={loading}>
                              {loading ? 'Creating...' : 'Register Customer'}
                           </button>
                           <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate('/customers')}>
                              Cancel
                           </button>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default AddCustomer;
