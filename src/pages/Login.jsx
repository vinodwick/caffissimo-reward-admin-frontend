import React, { useState } from 'react';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      if (res.token) {
        api.setToken(res.token);
        api.setUser(res.user);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="login-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--primary)' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Caffissimo</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>Admin Panel Login</p>
        
        <form onSubmit={handleSubmit} className="form-stack">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
