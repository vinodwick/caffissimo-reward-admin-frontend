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
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fcfcfc', fontFamily: "'Inter', sans-serif" }}>
      {/* Left side: Background Image */}
      <div style={{ 
        flex: 1.2, 
        backgroundImage: "url('/login-bg.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px'
      }}>
        {/* Premium Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
        }}></div>
        
        <div style={{ position: 'relative', color: 'white', zIndex: 1, maxWidth: '500px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Elevate Your Experience
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, fontWeight: '300' }}>
            Manage the Caffissimo loyalty ecosystem, track branch performance, and reward your customers seamlessly.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff',
        boxShadow: '-20px 0 40px rgba(0,0,0,0.08)',
        zIndex: 10
      }}>
        <div style={{ width: '100%', maxWidth: '440px', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ color: 'var(--primary, #2A3F54)', marginBottom: '12px', fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' }}>
              Caffissimo
            </h1>
            <p style={{ color: '#718096', fontSize: '16px' }}>Admin Portal Access</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#FFF5F5', 
                color: '#E53E3E', 
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #FED7D7'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#4A5568' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@caffissimo.com"
                required 
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  backgroundColor: '#F7FAFC'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary, #3182ce)';
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.backgroundColor = '#F7FAFC';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#4A5568' }}>Password</label>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  backgroundColor: '#F7FAFC'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary, #3182ce)';
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.backgroundColor = '#F7FAFC';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: 'var(--primary, #2A3F54)',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.1s, opacity 0.2s',
                marginTop: '10px',
                opacity: loading ? 0.7 : 1
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
