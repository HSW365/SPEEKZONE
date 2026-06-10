import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Bell, User } from 'lucide-react';

const TABS = [
  { path: '/',         icon: Home,       label: 'Home'    },
  { path: '/discover', icon: Search,     label: 'Discover' },
  { path: '/record',   icon: PlusSquare, label: 'Create'  },
  { path: '/inbox',    icon: Bell,       label: 'Inbox'   },
  { path: '/profile',  icon: User,       label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(0,0,0,.92)',
        borderTop: '1px solid rgba(255,255,255,.08)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {TABS.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        const isCreate = path === '/record';

        return (
          <button
            key={path}
            onPointerDown={() => navigate(path)}
            style={{
              flex: 1,
              height: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: 0,
              // Larger hit area for iPad
              minWidth: 44,
              minHeight: 44,
            }}
          >
            {isCreate ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg,#00eaff,#ff0055)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0,234,255,.35)',
                }}
              >
                <Icon size={22} color="#fff" strokeWidth={2.5} />
              </div>
            ) : (
              <>
                <Icon
                  size={24}
                  color={active ? '#fff' : 'rgba(255,255,255,.4)'}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 800 : 500,
                    color: active ? '#fff' : 'rgba(255,255,255,.4)',
                    letterSpacing: 0.3,
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
