import React, { useState } from 'react';
import { Heart, MessageCircle, Gift, UserPlus, Bell } from 'lucide-react';

const NOTIFICATIONS = [
  { id: '1', type: 'like',    user: 'CreatorKing',    text: 'liked your clip',                    time: '2m',  read: false },
  { id: '2', type: 'follow',  user: 'EntrepreneurTV', text: 'started following you',               time: '5m',  read: false },
  { id: '3', type: 'comment', user: 'AliTorres',      text: 'commented: "This is hard 🔥"',        time: '12m', read: false },
  { id: '4', type: 'gift',    user: 'DevKing',        text: 'sent you a 💎 Diamond (200 coins)',   time: '1h',  read: true },
  { id: '5', type: 'like',    user: 'WellnessCoach',  text: 'liked your clip',                    time: '2h',  read: true },
  { id: '6', type: 'follow',  user: 'MusicVibes',     text: 'started following you',               time: '3h',  read: true },
  { id: '7', type: 'comment', user: 'TechGuru',       text: 'commented: "We needed this app fr"', time: '5h',  read: true },
  { id: '8', type: 'gift',    user: 'MoneyMoves',     text: 'sent you a 👑 Crown (500 coins)',     time: '1d',  read: true },
];

const iconFor = (type: string) => {
  switch(type) {
    case 'like':    return <Heart size={18} color="#ff5252" fill="#ff5252" />;
    case 'comment': return <MessageCircle size={18} color="#2196f3" />;
    case 'gift':    return <Gift size={18} color="#ffd700" />;
    case 'follow':  return <UserPlus size={18} color="#00e676" />;
    default:        return <Bell size={18} color="#888" />;
  }
};

const bgFor = (type: string) => {
  switch(type) {
    case 'like':    return 'rgba(255,82,82,0.15)';
    case 'comment': return 'rgba(33,150,243,0.15)';
    case 'gift':    return 'rgba(255,215,0,0.15)';
    case 'follow':  return 'rgba(0,230,118,0.15)';
    default:        return '#1a1a1a';
  }
};

export default function Activity() {
  const [tab, setTab] = useState<'all'|'mentions'|'gifts'>('all');
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const filtered = tab === 'gifts'
    ? NOTIFICATIONS.filter(n => n.type === 'gift')
    : tab === 'mentions'
    ? NOTIFICATIONS.filter(n => n.type === 'comment')
    : NOTIFICATIONS;

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      <div className="pt-safe flex-shrink-0 px-5 pb-2" style={{ borderBottom: '1px solid #111' }}>
        <div className="flex items-center justify-between py-3">
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#fff' }}>Activity</h1>
          {unread > 0 && (
            <div className="rounded-full px-2.5 py-1 flex items-center justify-center"
              style={{ background: '#2196f3', minWidth: 28 }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{unread}</span>
            </div>
          )}
        </div>
        {/* Tabs */}
        <div className="flex gap-4 pb-1">
          {(['all','mentions','gifts'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="pb-2 text-sm font-bold transition-colors"
              style={{
                fontFamily: 'Barlow Condensed', fontSize: 16, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: tab === t ? '#fff' : '#555',
                borderBottom: tab === t ? '2px solid #2196f3' : '2px solid transparent',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(n => (
          <div key={n.id}
            className="flex items-center gap-4 px-5 py-4 active:bg-white/5"
            style={{ borderBottom: '1px solid #0a0a0a', background: n.read ? 'transparent' : 'rgba(33,150,243,0.04)' }}>
            {/* Avatar */}
            <div className="rounded-full flex items-center justify-center flex-shrink-0 relative"
              style={{ width: 48, height: 48, background: '#111', border: '1px solid #222', fontSize: 18, fontWeight: 900, color: '#fff' }}>
              {n.user[0]}
              <div className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
                style={{ width: 22, height: 22, background: bgFor(n.type) }}>
                {iconFor(n.type)}
              </div>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 14, lineHeight: 1.4 }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>@{n.user} </span>
                <span style={{ color: '#888' }}>{n.text}</span>
              </p>
              <p style={{ color: '#444', fontSize: 12, marginTop: 2 }}>{n.time} ago</p>
            </div>
            {/* Unread dot */}
            {!n.read && (
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#2196f3', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
