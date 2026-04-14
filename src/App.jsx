import React, { useState } from 'react';
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
import BottomNav from './components/BottomNav';
import './App.css';

function RequireAuth({ children }) {
  if (!api.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <RequireAuth>
            <div className="iq-app-wrapper">
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

              {/* Mobile Sidebar Overlay */}
              {sidebarOpen && (
                <div
                  className="sidebar-backdrop show-mobile"
                  onClick={closeSidebar}
                ></div>
              )}

              <main className="main-side p-4 sm:ml-64 min-h-screen flex flex-col">
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

                {/* Copyright and Credits Footer (Desktop Only) */}
                <footer className="cp-foot fixed left-0 right-0 sm:left-64 bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-3 text-center text-xs text-gray-500 z-30 hidden sm:block">
                  <p>&copy; {new Date().getFullYear()} Caffissimo Australia. All rights reserved. | Developed By <a href="https://aakiv.com" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">AAKIV PVT LTD</a></p>
                </footer>
                <BottomNav onMenuClick={toggleSidebar} />
              </main>
            </div>
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
