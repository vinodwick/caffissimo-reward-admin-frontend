import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { to: '/visits', label: 'Record', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> },
  { to: '/redeem', label: 'Redeem', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" /></svg> },
  { to: '/customers', label: 'Users', icon: <svg width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
];

function BottomNav({ onMenuClick }) {
  return (
    <div className="bottom-nav show-mobile">
      {navItems.map((item) => (
        <NavLink 
          key={item.to} 
          to={item.to} 
          end={item.to === '/'}
          className={({ isActive }) => (isActive ? 'bottom-nav-item active' : 'bottom-nav-item')}
        >
          <div className="bottom-nav-icon">{item.icon}</div>
          <span>{item.label}</span>
        </NavLink>
      ))}
      
      {/* Menu Toggle Trigger */}
      <div className="bottom-nav-item" onClick={onMenuClick} style={{ cursor: 'pointer' }}>
        <div className="bottom-nav-icon">
          <svg width="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </div>
        <span>Menu</span>
      </div>
    </div>
  );
}

export default BottomNav;
