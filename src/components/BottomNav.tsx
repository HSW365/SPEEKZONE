import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Plus, MessageCircle, User } from 'lucide-react';

const TABS = [
  { path: '/',         icon: Home,          label: 'Home'    },
  { path: '/discover', icon: Users,         label: 'Rooms'   },
  { path: '/record',   icon: Plus,          label: ''        },
  { path: '/inbox',    icon: MessageCircle, label: 'Chats'   },
  { path: '/profile',  icon: User,          label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        height: 'calc(62px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: '#ffffff',
        borderTop: '1px solid #eef2f7',
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
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              height: 62,
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
            }}
          >
            {isCreate ? (
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 46,
                  height: 46,
                  background: 'linear-gradient(135deg,#3b82f6,#1d63e8)',
                  boxShadow: '0 6px 16px rgba(29,99,232,.4)',
                  marginTop: -14,
                }}
              >
                <Icon size={24} color="#fff" />
              </div>
            ) : (
              <>
                <Icon size={22} color={active ? '#1e6ff2' : '#94a3b8'} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 800 : 600,
                    color: active ? '#1e6ff2' : '#94a3b8',
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
