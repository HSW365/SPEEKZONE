import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import CreateChoice from './pages/CreateChoice';
import Record from './pages/Record';
import CreateClip from './pages/CreateClip';
import Room from './pages/Room';
import Inbox from './pages/Inbox';
import ChatThread from './pages/ChatThread';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Splash from './pages/Splash';
import { ToastProvider } from './components/Toast';

function AppInner() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Splash />;
  if (!user) return <Routes><Route path="*" element={<Login />} /></Routes>;

  // Hide bottom nav inside a live room or an individual chat thread for full-screen view
  const fullScreen = location.pathname.startsWith('/room/') || /^\/inbox\/.+/.test(location.pathname);

  return (
    <div className="flex flex-col h-full" style={{ background: '#f4f6fb' }}>
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/"         element={<Feed />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/record"   element={<CreateChoice />} />
          <Route path="/create/clip" element={<CreateClip />} />
          <Route path="/create/room" element={<Record />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/inbox"    element={<Inbox />} />
          <Route path="/inbox/:id" element={<ChatThread />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/pricing"  element={<Pricing />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!fullScreen && <BottomNav />}
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
