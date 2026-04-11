import React from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

function Header() {
  const location = useLocation();
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
        <div className="search-bar">
          <svg width="20" viewBox="0 0 24 24" fill="var(--muted)"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
          <input type="text" placeholder="Search for something" />
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
