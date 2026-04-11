import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RecordVisit from './pages/RecordVisit';
import RedeemReward from './pages/RedeemReward';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import ViewCustomer from './pages/ViewCustomer';
import Rewards from './pages/Rewards';
import Branches from './pages/Branches';
import Promotions from './pages/Promotions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Users from './pages/Users';
import VisitRewards from './pages/VisitRewards';
import Help from './pages/Help';
import Login from './pages/Login';
import api from './services/api';
import Header from './components/Header';
import './App.css';

function RequireAuth({ children }) {
  if (!api.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <RequireAuth>
            <div className="iq-app-wrapper">
              <Sidebar />
              <main className="main-side p-4 sm:ml-64">
                <div className="iq-navbar-header banner-bg"></div>
                <Header />
                <div className="iq-page-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/visits" element={<RecordVisit />} />
                    <Route path="/redeem" element={<RedeemReward />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/add" element={<AddCustomer />} />
                    <Route path="/customers/:id" element={<ViewCustomer />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/branches" element={<Branches />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/visit-rewards" element={<VisitRewards />} />
                    <Route path="/help" element={<Help />} />
                  </Routes>
                </div>
                
                {/* Copyright and Credits Footer (Right-side bottom) */}
                <footer style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '10px 15px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#718096', fontSize: '12px', textAlign: 'right', zIndex: 100 }}>
                  <p style={{ marginBottom: '4px' }}>&copy; {new Date().getFullYear()} Caffissimo Australia. All rights reserved.</p>
                  <p>Developed By <a href="https://aakiv.com" target="_blank" rel="noreferrer" style={{color: '#2b6cb0', fontWeight: 'bold', textDecoration: 'none'}}>AAKIV PVT LTD</a>, Sri Lanka</p>
                </footer>
              </main>
            </div>
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
