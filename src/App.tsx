import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import Record from './pages/Record';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Splash from './pages/Splash';
import { ToastProvider } from './components/Toast';

function AppInner() {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Routes><Route path="*" element={<Login />} /></Routes>;
  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/"         element={<Feed />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/record"   element={<Record />} />
          <Route path="/inbox"    element={<Inbox />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/pricing"  element={<Pricing />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
