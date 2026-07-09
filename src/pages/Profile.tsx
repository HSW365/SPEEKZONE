import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, MessageCircle, Users, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROOMS, avatarColor } from '../utils/rooms';
import { useToast, shareOrCopy } from '../components/Toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, deleteAccount } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<'rooms' | 'about' | 'connections'>('rooms');
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const displayName = user?.username || 'speaker';
  const handle = `@${displayName.toLowerCase()}.speaks`;
  const liveRooms = ROOMS.filter(r => r.live);

  const handleShare = () => {
    shareOrCopy(
      { title: 'SpeekZone', text: `Follow ${handle} on SpeekZone`, url: 'https://speekzone.com' },
      toast
    );
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#fff' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-end px-4 relative"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 8px)', paddingBottom: 4 }}
      >
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 38, height: 38, background: '#f1f5f9',
            touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <MoreHorizontal size={20} color="#0e1726" />
        </button>

        {menuOpen && (
          <div
            className="absolute rounded-2xl overflow-hidden"
            style={{
              top: 'calc(env(safe-area-inset-top, 20px) + 50px)',
              right: 16, zIndex: 50,
              background: '#fff',
              boxShadow: '0 8px 30px rgba(15,40,105,.18)',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="flex items-center gap-2 px-4 py-3 w-full"
              style={{
                color: '#ef4444', fontWeight: 700, fontSize: 14,
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <LogOut size={16} /> Log out
            </button>
            <button
              onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
              className="flex items-center gap-2 px-4 py-3 w-full"
              style={{
                color: '#ef4444', fontWeight: 700, fontSize: 14,
                borderTop: '1px solid #f1f5f9',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        )}
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center px-6">
        <div className="relative">
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 96, height: 96,
              background: avatarColor(displayName),
              color: '#fff', fontWeight: 900, fontSize: 38,
              border: '3px solid #fff',
              boxShadow: '0 4px 18px rgba(15,40,105,.15)',
            }}
          >
            {displayName[0].toUpperCase()}
          </div>
          <span
            className="absolute rounded-full"
            style={{
              width: 18, height: 18, right: 4, bottom: 4,
              background: '#f59e0b', border: '3px solid #fff',
            }}
          />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0e1726', marginTop: 12 }}>{displayName}</h1>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{handle}</div>
        <p className="text-center" style={{ fontSize: 13, color: '#475569', marginTop: 8, maxWidth: 260 }}>
          Love conversations that matter. Let's talk!
        </p>

        {/* Stats */}
        <div className="flex gap-10 mt-5">
          {[
            { label: 'Rooms', value: '128' },
            { label: 'Followers', value: '2.4K' },
            { label: 'Following', value: '980' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div style={{ fontSize: 17, fontWeight: 900, color: '#0e1726' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5 w-full max-w-xs">
          <button
            onClick={handleShare}
            className="flex-1 rounded-2xl py-3"
            style={{
              background: '#1e6ff2', color: '#fff', fontWeight: 900, fontSize: 14,
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
            }}
          >
            Share Profile
          </button>
          <button
            onClick={() => navigate('/inbox')}
            className="rounded-2xl flex items-center justify-center"
            style={{
              width: 52, background: '#f1f5f9',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <MessageCircle size={19} color="#1e6ff2" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around mt-7 px-6" style={{ borderBottom: '1px solid #e2e8f0' }}>
        {(['rooms', 'about', 'connections'] as const).map(t => {
          const active = tab === t;
          const label = t[0].toUpperCase() + t.slice(1);
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 4px',
                fontSize: 14,
                fontWeight: active ? 900 : 700,
                color: active ? '#1e6ff2' : '#94a3b8',
                borderBottom: active ? '2.5px solid #1e6ff2' : '2.5px solid transparent',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="px-5 pt-4 pb-8">
        {tab === 'rooms' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0e1726' }}>Live Rooms</h2>
              <button
                onClick={() => navigate('/discover')}
                style={{
                  fontSize: 13, fontWeight: 700, color: '#1e6ff2',
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                }}
              >
                See All
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {liveRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => navigate(`/room/${room.id}`)}
                  className="flex items-center gap-3 rounded-2xl p-3.5 text-left w-full"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #eef2f7',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 44, height: 44, background: avatarColor(room.host),
                      color: '#fff', fontWeight: 800, fontSize: 17,
                    }}
                  >
                    {room.host[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#0e1726' }}>{room.name}</div>
                    <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: 12, color: '#94a3b8' }}>
                      <Users size={12} /> {room.listeners}
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{ background: '#ff2d3d', color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 0.5 }}
                  >
                    LIVE
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'about' && (
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
            Hosting rooms on SpeekZone — a global voice community where people talk, listen, and connect in real time.
            Tap a live room to jump into the conversation.
          </p>
        )}

        {tab === 'connections' && (
          <p style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', marginTop: 24 }}>
            Connections you make in rooms will appear here.
          </p>
        )}
      </div>

      {confirmDelete && (
        <div
          className="flex items-center justify-center px-6"
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(14,23,38,.55)', backdropFilter: 'blur(2px)',
          }}
        >
          <div
            className="rounded-2xl w-full max-w-xs p-5"
            style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,.35)' }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0e1726' }}>Delete your account?</h2>
            <p style={{ fontSize: 13.5, color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>
              This permanently deletes your profile, rooms, followers, and messages. This can't be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="flex-1 rounded-2xl py-3"
                style={{
                  background: '#f1f5f9', color: '#0e1726', fontWeight: 800, fontSize: 14,
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 rounded-2xl py-3"
                style={{
                  background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14,
                  opacity: deleting ? 0.7 : 1,
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
