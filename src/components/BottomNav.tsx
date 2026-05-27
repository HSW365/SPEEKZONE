import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Mic, MessageCircle, User } from 'lucide-react';

const TABS = [
  { path: '/',         icon: Home,          label: 'Home' },
  { path: '/discover', icon: Search,        label: 'Discover' },
  { path: '/create',   icon: Mic,           label: 'Create' },
  { path: '/inbox',    icon: MessageCircle, label: 'Inbox' },
  { path: '/profile',  icon: User,          label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className="flex-shrink-0 flex items-center justify-around pb-safe"
      style={{
        background: 'rgba(10,22,40,0.98)',
        borderTop: '1px solid rgba(25,118,210,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        minHeight: 56,
      }}
    >
      {TABS.map(({ path, icon: Icon, label }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center justify-center flex-1 py-2 active:opacity-60 transition-opacity"
          >
            <Icon
              size={22}
              color={active ? '#2196f3' : '#5a6478'}
              strokeWidth={active ? 2.5 : 1.8}
            />
            {active && <div className="nav-dot" />}
          </button>
        );
      })}
    </div>
  );
}