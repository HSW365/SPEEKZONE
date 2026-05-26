import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Create from './pages/Create';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import PodcastDetail from './pages/PodcastDetail';
import Splash from './pages/Splash';

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) return <Splash />;
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col h-full bg-brand-deep">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/create" element={<Create />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/podcast/:id" element={<PodcastDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
