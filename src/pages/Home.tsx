import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROOMS, avatarColor } from '../utils/rooms';

function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: avatarColor(name),
        color: '#fff',
        fontWeight: 800,
        fontSize: size * 0.42,
        border: '2px solid rgba(255,255,255,.9)',
      }}
    >
      {name[0]}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.username || 'friend';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const liveRooms = ROOMS.filter(r => r.live);

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#f4f6fb' }}>
      {/* Blue header */}
      <div
        style={{
          background: 'linear-gradient(180deg,#3b82f6 0%,#1d63e8 100%)',
          paddingTop: 'calc(env(safe-area-inset-top, 20px) + 12px)',
          paddingBottom: 56,
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 20, letterSpacing: -0.3 }}>SpeekZone</span>
          <button
            onClick={() => navigate('/inbox')}
            className="rounded-full flex items-center justify-center"
            style={{
              width: 40, height: 40,
              background: 'rgba(255,255,255,.18)',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Bell size={20} color="#fff" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <Avatar name={displayName} size={72} />
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginTop: 12, lineHeight: 1.2 }}>
            {greeting},<br />{displayName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 6, maxWidth: 260 }}>
            Join a community where voices from around the world come together.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="flex gap-3 px-5" style={{ marginTop: -32 }}>
        {[
          { label: 'Rooms', value: '128' },
          { label: 'Members', value: '24.5K' },
          { label: 'Countries', value: '150+' },
        ].map(s => (
          <div
            key={s.label}
            className="flex-1 rounded-2xl text-center py-4"
            style={{ background: '#fff', boxShadow: '0 4px 16px rgba(15,40,105,.08)' }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0e1726' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live rooms */}
      <div className="px-5 mt-7 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0e1726' }}>Live Rooms</h2>
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
              className="flex items-center gap-3 rounded-2xl p-4 text-left w-full"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(15,40,105,.06)',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Avatar name={room.host} size={48} />
              <div className="flex-1 min-w-0">
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0e1726' }}>{room.name}</div>
                <div className="truncate" style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{room.topic}</div>
                <div className="flex items-center gap-1 mt-1" style={{ fontSize: 12, color: '#94a3b8' }}>
                  <Users size={13} /> {room.listeners}
                </div>
              </div>
              <span
                className="rounded-full px-2.5 py-1"
                style={{ background: '#ff2d3d', color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: 0.5 }}
              >
                LIVE
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
