import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Send } from 'lucide-react';
import { CHATS, avatarColor } from '../utils/rooms';
import { getMessages, sendMessage, markRead } from '../utils/chatThreads';

export default function ChatThread() {
  const navigate = useNavigate();
  const { id } = useParams();
  const chat = CHATS.find(c => c.id === id);
  const [messages, setMessages] = useState(() => {
    if (id) markRead(id);
    return id ? getMessages(id) : [];
  });
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !id) return;
    const msg = sendMessage(id, trimmed);
    setMessages(m => [...m, msg]);
    setText('');
  };

  if (!chat) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <p style={{ color: '#64748b', fontSize: 14 }}>Chat not found</p>
        <button onClick={() => navigate('/inbox')} style={{ color: '#1e6ff2', fontWeight: 700, marginTop: 8 }}>
          Back to Chats
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#fff' }}>
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 10px)', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}
      >
        <button onClick={() => navigate('/inbox')} className="active:opacity-60">
          <ChevronLeft size={24} color="#0e1726" />
        </button>
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            width: 38, height: 38,
            background: chat.team ? 'linear-gradient(135deg,#3b82f6,#1d63e8)' : avatarColor(chat.name),
            color: '#fff', fontWeight: 800, fontSize: 15,
          }}
        >
          {chat.team ? 'S' : chat.name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#0e1726' }}>{chat.name}</div>
          {chat.online && <div style={{ fontSize: 11, color: '#22c55e' }}>Online</div>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        {messages.map(m => (
          <div key={m.id} className="flex flex-col" style={{ alignItems: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div
              className="rounded-2xl px-4 py-2.5 max-w-[75%]"
              style={{
                background: m.from === 'me' ? '#1e6ff2' : '#f1f5f9',
                color: m.from === 'me' ? '#fff' : '#0e1726',
                fontSize: 14,
              }}
            >
              {m.text}
            </div>
            <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{m.time}</span>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderTop: '1px solid #f1f5f9', paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 12px)' }}
      >
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Message..."
          className="flex-1 rounded-full px-4 py-2.5 outline-none"
          style={{ background: '#f1f5f9', fontSize: 14, color: '#0e1726' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 40, height: 40, background: text.trim() ? '#1e6ff2' : '#e2e8f0', touchAction: 'manipulation' }}
        >
          <Send size={17} color="#fff" />
        </button>
      </div>
    </div>
  );
}
