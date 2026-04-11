import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../services/api';

const baseNav = [
  { to: '/', label: 'Dashboard', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3V11H21V3H13ZM3 13V21H11V13H3ZM3 3V11H11V3H3ZM13 13V21H21V13H13Z" /></svg> },
  { to: '/visits', label: 'Record Visit', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" /></svg> },
  { to: '/redeem', label: 'Redeem Reward', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" /></svg> },
  { to: '/customers', label: 'Customers', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg> },
  { to: '/rewards', label: 'Reward Ledger', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 9h-4V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v4H3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4v4c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-6 10H9v-4H5v-4h4V7h6v4h4v4h-4v4z" /></svg> },
  { to: '/help', label: 'Help & Manual', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg> }
];

const managerNav = [
  { to: '/branches', label: 'Branches', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg> },
  { to: '/promotions', label: 'Promotions', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 6l-3.8 9.5-1.4-.6L12.6 6H14zM8 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-8-3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" /></svg> },
  { to: '/reports', label: 'Reports', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" /></svg> },
];

const superAdminNav = [
  { to: '/settings', label: 'Settings', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" /></svg> },
  { to: '/users', label: 'Users', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg> },
  { to: '/visit-rewards', label: 'Visit Rewards', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" /></svg> },
];

function Sidebar() {
  const user = api.getUser();
  const role = user?.role || 'operator';

  const [systemName, setSystemName] = useState(localStorage.getItem('system_name') || 'Caffissimo');
  const [systemLogo, setSystemLogo] = useState(localStorage.getItem('system_logo') || null);

  useEffect(() => {
    api.getSettings().then(res => {
      if (res.system_name) {
        setSystemName(res.system_name);
        localStorage.setItem('system_name', res.system_name);
      }
      if (res.system_logo) {
        setSystemLogo(res.system_logo);
        localStorage.setItem('system_logo', res.system_logo);
      }
    }).catch(console.error);
  }, []);

  let navItems = [...baseNav];
  if (role === 'manager' || role === 'super_admin') {
    navItems = navItems.concat(managerNav);
  }
  if (role === 'super_admin') {
    navItems = navItems.concat(superAdminNav);
  }

  return (
    <aside id="default-sidebar" className="sidebar fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {systemLogo ? (
            <img src={`http://localhost:8000${systemLogo}`} alt="Brand Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          ) : (
            <svg width="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z" /></svg>
          )}
        </div>
        <h2>{systemName}</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <div className="nav-icon">{item.icon}</div>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={() => api.logout()}>
          <svg width="24" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
