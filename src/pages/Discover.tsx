import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Bell, BellOff } from 'lucide-react';
import { getAllRooms, avatarColor } from '../utils/rooms';
import { hasReminder, toggleReminder } from '../utils/reminders';
import { useToast } from '../components/Toast';

const CATEGORIES = ['All', 'Talk', 'Music', 'Business', 'Stories'] as const;

export default function Discover() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<typeof CATEGORIES[number]>('All');
  const [reminderVersion, setReminderVersion] = useState(0);

  const filtered = getAllRooms().filter(r => {
    const matchesQuery =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.topic.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = cat === 'All' || r.category === cat;
    return matchesQuery && matchesCategory;
  });

  const handleRemind = (e: React.MouseEvent, roomId: string, roomName: string) => {
    e.stopPropagation();
    const nowSet = toggleReminder(roomId);
    toast(nowSet ? `We'll notify you when ${roomName} goes live` : `Reminder removed for ${roomName}`);
    setReminderVersion(v => v + 1);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#f4f6fb' }}>
      {/* Header */}
      <div
        className="px-5"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 10px)', paddingBottom: 6 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0e1726' }}>Rooms</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
          Follow people, explore rooms and build real connections.
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-2xl px-4 mt-4"
          style={{ background: '#fff', height: 44, border: '1px solid #e8edf5' }}
        >
          <Search size={17} color="#94a3b8" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search rooms"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 14, color: '#0e1726' }}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="rounded-full px-4 py-2 flex-shrink-0"
                style={{
                  background: active ? '#1e6ff2' : '#fff',
                  color: active ? '#fff' : '#475569',
                  border: active ? '1px solid #1e6ff2' : '1px solid #e8edf5',
                  fontSize: 13, fontWeight: 800,
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Room list */}
      <div className="px-5 pt-3 pb-6 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="text-center py-10" style={{ color: '#94a3b8', fontSize: 14 }}>
            No rooms match "{query}"{cat !== 'All' ? ` in ${cat}` : ''}
          </p>
        )}
        {filtered.map(room => {
          const reminded = hasReminder(room.id);
          return (
            <button
              key={room.id}
              onClick={() => navigate(`/room/${room.id}`)}
              className="rounded-2xl p-4 text-left w-full"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(15,40,105,.06)',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 48, height: 48, background: avatarColor(room.host),
                    color: '#fff', fontWeight: 800, fontSize: 19,
                  }}
                >
                  {room.host[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#0e1726' }}>{room.name}</span>
                    {room.live && (
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{ background: '#ff2d3d', color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 0.5 }}
                      >
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="truncate" style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{room.topic}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: '#94a3b8' }}>
                  <Users size={13} />
                  {room.live ? `${room.listeners} listening` : 'Starts soon'}
                </span>
                {room.live ? (
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#1e6ff2' }}>Join</span>
                ) : (
                  <button
                    onClick={(e) => handleRemind(e, room.id, room.name)}
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{
                      background: reminded ? 'rgba(30,111,242,0.1)' : 'transparent',
                      touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {reminded ? <Bell size={13} color="#1e6ff2" /> : <BellOff size={13} color="#94a3b8" />}
                    <span style={{ fontSize: 12, fontWeight: 800, color: reminded ? '#1e6ff2' : '#94a3b8' }}>
                      {reminded ? 'Reminder set' : 'Remind me'}
                    </span>
                  </button>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
