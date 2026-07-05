import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Mic, MicOff, Hand, Share2, LogOut, Users } from 'lucide-react';
import { ROOMS, avatarColor } from '../utils/rooms';
import { useToast, shareOrCopy } from '../components/Toast';

function Avatar({ name, size = 64, ring }: { name: string; size?: number; ring?: boolean }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: avatarColor(name),
        color: '#fff',
        fontWeight: 800,
        fontSize: size * 0.4,
        border: ring ? '3px solid #3b82f6' : '2px solid rgba(255,255,255,.25)',
        boxShadow: ring ? '0 0 20px rgba(59,130,246,.45)' : 'none',
      }}
    >
      {name[0]}
    </div>
  );
}

function Person({ name, size = 64, role, ring }: { name: string; size?: number; role?: string; ring?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ width: size + 16 }}>
      <Avatar name={name} size={size} ring={ring} />
      <span className="truncate w-full text-center" style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{name}</span>
      {role && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', marginTop: -4 }}>{role}</span>}
    </div>
  );
}

export default function Room() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [muted, setMuted] = useState(true);

  const room = ROOMS.find(r => r.id === id) || ROOMS[0];
  const listenerNames = ['Ava', 'Ben', 'Cleo', 'Dev'];
  const extraListeners = Math.max(room.listeners - listenerNames.length - room.speakers.length - 2, 0);

  const handleShare = () => {
    shareOrCopy(
      { title: 'SpeekZone', text: `Join "${room.name}" live on SpeekZone`, url: 'https://speekzone.com' },
      toast
    );
  };

  const controls = [
    {
      key: 'mic',
      label: muted ? 'Unmute' : 'Mute',
      icon: muted ? MicOff : Mic,
      onClick: () => { setMuted(m => !m); toast(muted ? 'Mic on' : 'Mic muted'); },
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'hand',
      label: 'Raise Hand',
      icon: Hand,
      onClick: () => toast('Hand raised — the host will see it'),
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'share',
      label: 'Share',
      icon: Share2,
      onClick: handleShare,
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'leave',
      label: 'Leave',
      icon: LogOut,
      onClick: () => navigate(-1),
      bg: '#ff2d3d',
    },
  ];

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: 'linear-gradient(180deg,#0a1430 0%,#0d1f4a 100%)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 8px)', paddingBottom: 12 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 38, height: 38, background: 'rgba(255,255,255,.1)',
            touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
        <div className="flex-1 text-center">
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{room.name}</div>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            {room.live && (
              <span
                className="rounded-full px-2 py-0.5"
                style={{ background: '#ff2d3d', color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 0.5 }}
              >
                LIVE
              </span>
            )}
            <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,.6)', fontSize: 12 }}>
              <Users size={12} /> {room.listeners}
            </span>
          </div>
        </div>
        <div style={{ width: 38 }} />
      </div>

      {/* Stage */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Host + co-host */}
        <div className="flex justify-center gap-8 mt-4">
          <Person name={room.host} size={76} role={`Host\u00A0· ${room.host}`} ring />
          {room.coHost && <Person name={room.coHost} size={76} role={`Co-host · ${room.coHost}`} ring />}
        </div>

        {/* Speakers */}
        <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 800, marginTop: 28, marginBottom: 12 }}>
          Speakers
        </div>
        <div className="flex flex-wrap gap-4">
          {room.speakers.map(s => <Person key={s} name={s} size={60} />)}
        </div>

        {/* Listeners */}
        <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 800, marginTop: 26, marginBottom: 12 }}>
          Listeners
        </div>
        <div className="flex flex-wrap gap-4 items-start">
          {listenerNames.map(l => <Person key={l} name={l} size={52} />)}
          {extraListeners > 0 && (
            <div className="flex flex-col items-center gap-1.5" style={{ width: 68 }}>
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 52, height: 52,
                  background: 'rgba(255,255,255,.12)',
                  color: '#fff', fontWeight: 800, fontSize: 15,
                  border: '2px solid rgba(255,255,255,.2)',
                }}
              >
                +{extraListeners}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="flex justify-around px-5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 10px)', paddingTop: 10 }}
      >
        {controls.map(({ key, label, icon: Icon, onClick, bg }) => (
          <button
            key={key}
            onClick={onClick}
            className="flex flex-col items-center gap-1.5"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 54, height: 54, background: bg, backdropFilter: 'blur(10px)' }}
            >
              <Icon size={24} color="#fff" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
