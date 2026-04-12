import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = api.getUser();

  const titles = {
    '/': 'Overview',
    '/visits': 'Record Visit',
    '/customers': 'Customers',
    '/customers/add': 'Add Customer',
    '/rewards': 'Rewards',
    '/branches': 'Branches',
    '/promotions': 'Promotions',
    '/reports': 'Reports',
    '/settings': 'Settings',
  };

  let pageTitle = titles[location.pathname] || 'Dashboard';
  if (location.pathname.startsWith('/customers/') && location.pathname !== '/customers/add') {
    pageTitle = 'View Customer';
  }

  return (
    <div className="top-header">
      <div className="header-title">{pageTitle}</div>
      <div className="header-right">
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/visits')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
          >
            <svg width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Record Visit
          </button>
          
          <button 
            onClick={() => navigate('/redeem')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', backgroundColor: '#FFF5F5', color: '#E53E3E', border: '1px solid #FED7D7' }}
          >
            <svg width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" /></svg>
            Redeem Reward
          </button>
        </div>
        {/* <div style={{ cursor: 'pointer', color: 'var(--primary)' }}>
          <svg width="25" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
        </div>
        <div style={{ cursor: 'pointer', color: 'var(--secondary)' }}>
          <svg width="25" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
        </div> */}
        <div className="profile-avatar">
          {user?.name?.charAt(0) ?? 'U'}
        </div>
      </div>
    </div>
  );
}

export default Header;
