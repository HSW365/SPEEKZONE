import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';

const TABS = [
  { path: '/',         icon: Home,          label: 'Home' },
  { path: '/discover', icon: Search,        label: 'Discover' },
  { path: '/record',   icon: PlusSquare,    label: 'Record', special: true },
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
        background: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        minHeight: 60,
      }}
    >
      {TABS.map(({ path, icon: Icon, label, special }: any) => {
        const active = pathname === path;
        if (special) {
          return (
            <button key={path} onClick={() => navigate(path)}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{ width: 52, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 0 16px rgba(33,150,243,0.5)' }}>
              <Icon size={20} color="#fff" strokeWidth={2.5} />
            </button>
          );
        }
        return (
          <button key={path} onClick={() => navigate(path)}
            className="flex flex-col items-center justify-center flex-1 py-2 active:opacity-60">
            <Icon size={24} color={active ? '#fff' : '#555'} strokeWidth={active ? 2.5 : 1.8} />
            {active && <div style={{ width: 4, height: 4, borderRadius: 2, background: '#2196f3', marginTop: 3 }} />}
          </button>
        );
      })}
    </div>
  );
}
