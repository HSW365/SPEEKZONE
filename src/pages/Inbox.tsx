import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquarePlus } from 'lucide-react';
import { CHATS, avatarColor } from '../utils/rooms';
import { isRead } from '../utils/chatThreads';

function ChatAvatar({ name, online, team }: { name: string; online: boolean; team?: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 50, height: 50,
          background: team ? 'linear-gradient(135deg,#3b82f6,#1d63e8)' : avatarColor(name),
          color: '#fff', fontWeight: 800, fontSize: 20,
        }}
      >
        {team ? 'S' : name[0]}
      </div>
      {online && (
        <span
          className="absolute rounded-full"
          style={{
            width: 13, height: 13, right: 0, bottom: 1,
            background: '#22c55e', border: '2.5px solid #fff',
          }}
        />
      )}
    </div>
  );
}

export default function Inbox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = CHATS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.message.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col" style={{ background: '#fff' }}>
      {/* Header */}
      <div
        className="px-5"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 10px)', paddingBottom: 8 }}
      >
        <div className="flex items-center justify-between">
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0e1726' }}>Chats</h1>
          <button
            onClick={() => navigate('/discover')}
            className="rounded-full flex items-center justify-center"
            style={{
              width: 38, height: 38, background: '#f1f5f9',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <MessageSquarePlus size={19} color="#1e6ff2" />
          </button>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-2xl px-4 mt-3"
          style={{ background: '#f1f5f9', height: 42 }}
        >
          <Search size={17} color="#94a3b8" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 14, color: '#0e1726' }}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
        {filtered.map(chat => {
          const unread = isRead(chat.id) ? 0 : chat.unread;
          return (
            <button
              key={chat.id}
              onClick={() => navigate(`/inbox/${chat.id}`)}
              className="flex items-center gap-3 w-full text-left rounded-2xl px-2 py-3"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              <ChatAvatar name={chat.name} online={chat.online} team={chat.team} />
              <div className="flex-1 min-w-0">
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0e1726' }}>{chat.name}</div>
                <div className="truncate" style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{chat.message}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{chat.time}</span>
                {unread > 0 && (
                  <span
                    className="rounded-full flex items-center justify-center"
                    style={{
                      minWidth: 19, height: 19, padding: '0 5px',
                      background: '#1e6ff2', color: '#fff', fontSize: 11, fontWeight: 800,
                    }}
                  >
                    {unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center mt-16" style={{ color: '#94a3b8', fontSize: 14 }}>
            No chats found
          </div>
        )}
      </div>
    </div>
  );
}

