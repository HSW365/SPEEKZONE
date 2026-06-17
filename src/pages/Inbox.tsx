import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Send, Phone, Video, MoreHorizontal, Search } from 'lucide-react';
import { useToast } from '../components/Toast';

const THREADS = [
  { id: '1', name: 'CreatorKing',    lastMsg: 'Your clip goes hard bro 🔥',          time: '2m',  unread: 3, online: true },
  { id: '2', name: 'EntrepreneurTV', lastMsg: 'Want to collab on something?',          time: '15m', unread: 1, online: true },
  { id: '3', name: 'AliTorres',      lastMsg: 'Followed you back!',                    time: '1h',  unread: 0, online: false },
  { id: '4', name: 'DevKing',        lastMsg: 'Check out my new clip',                 time: '3h',  unread: 0, online: false },
  { id: '5', name: 'WellnessCoach',  lastMsg: 'Thanks for the gift 🙏',               time: '1d',  unread: 0, online: false },
  { id: '6', name: 'SpeekZone',      lastMsg: 'Welcome to SpeekZone! 🎉',             time: '2d',  unread: 0, online: true },
];

const MOCK_MESSAGES: Record<string, { id: string; text: string; mine: boolean; time: string }[]> = {
  '1': [
    { id: '1', text: 'Yo just heard your latest clip!', mine: false, time: '10:24' },
    { id: '2', text: 'Thanks man 🔥 been working on it', mine: true, time: '10:25' },
    { id: '3', text: 'The waveform visuals are crazy', mine: false, time: '10:25' },
    { id: '4', text: 'SpeekZone different bro', mine: false, time: '10:26' },
    { id: '5', text: 'Your clip goes hard bro 🔥', mine: false, time: '10:30' },
  ],
  '2': [
    { id: '1', text: 'Hey! Love your content', mine: false, time: '9:00' },
    { id: '2', text: 'Want to collab on something?', mine: false, time: '9:01' },
  ],
  '6': [
    { id: '1', text: 'Welcome to SpeekZone! 🎉', mine: false, time: 'Yesterday' },
    { id: '2', text: 'Start recording your first clip and grow your audience.', mine: false, time: 'Yesterday' },
  ],
};

function ChatScreen({ threadId, name, online, onBack }: {
  threadId: string; name: string; online: boolean; onBack: () => void;
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(MOCK_MESSAGES[threadId] ?? []);
  const [msg, setMsg] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages(m => [...m, { id: Date.now().toString(), text: msg.trim(), mine: true, time: 'Now' }]);
    setMsg('');
    // Simulate reply
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now().toString() + 'r', text: '👍', mine: false, time: 'Now' }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      {/* Header */}
      <div className="pt-safe flex-shrink-0 px-4 py-3 flex items-center gap-3"
        style={{ background: '#000', borderBottom: '1px solid #111' }}>
        <button onClick={onBack} className="active:opacity-60">
          <ChevronLeft size={24} color="#fff" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="rounded-full flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#1565c0,#2196f3)', fontSize: 16, fontWeight: 900 }}>
              {name[0]}
            </div>
            {online && (
              <div className="absolute bottom-0 right-0 rounded-full"
                style={{ width: 12, height: 12, background: '#00e676', border: '2px solid #000' }} />
            )}
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>@{name}</p>
            <p style={{ color: online ? '#00e676' : '#555', fontSize: 12 }}>{online ? 'Active now' : 'Offline'}</p>
          </div>
        </div>
        <button className="active:opacity-60" onClick={() => toast('Voice calls coming soon')}><Phone size={20} color="#888" /></button>
        <button className="active:opacity-60" onClick={() => toast('Video calls coming soon')}><Video size={20} color="#888" /></button>
        <button className="active:opacity-60" onClick={() => toast('More options coming soon')}><MoreHorizontal size={20} color="#888" /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
            {!m.mine && (
              <div className="rounded-full flex items-center justify-center flex-shrink-0 mr-2 self-end"
                style={{ width: 28, height: 28, background: '#2196f3', fontSize: 12, fontWeight: 900 }}>
                {name[0]}
              </div>
            )}
            <div className="max-w-xs px-4 py-2.5 rounded-2xl"
              style={{
                background: m.mine ? '#2196f3' : '#1a1a1a',
                borderBottomRightRadius: m.mine ? 4 : 18,
                borderBottomLeftRadius: m.mine ? 18 : 4,
              }}>
              <p style={{ color: '#fff', fontSize: 15, lineHeight: 1.4 }}>{m.text}</p>
              <p style={{ color: m.mine ? 'rgba(255,255,255,0.6)' : '#555', fontSize: 11, marginTop: 2, textAlign: m.mine ? 'right' : 'left' }}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 pb-safe flex items-center gap-3"
        style={{ background: '#000', borderTop: '1px solid #111' }}>
        <input
          value={msg} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message..."
          className="flex-1 px-4 py-3 rounded-full text-white text-sm"
          style={{ background: '#111', border: '1px solid #222' }} />
        <button onClick={send}
          className="flex items-center justify-center rounded-full flex-shrink-0 active:scale-90 transition-transform"
          style={{ width: 44, height: 44, background: msg.trim() ? '#2196f3' : '#111', border: '1px solid #222' }}>
          <Send size={18} color={msg.trim() ? '#fff' : '#555'} />
        </button>
      </div>
    </div>
  );
}

export default function Inbox() {
  const [activeThread, setActiveThread] = useState<typeof THREADS[0] | null>(null);
  const [search, setSearch] = useState('');

  if (activeThread) {
    return (
      <ChatScreen
        threadId={activeThread.id}
        name={activeThread.name}
        online={activeThread.online}
        onBack={() => setActiveThread(null)}
      />
    );
  }

  const filtered = THREADS.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalUnread = THREADS.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      <div className="pt-safe flex-shrink-0 px-5 pb-3" style={{ borderBottom: '1px solid #111' }}>
        <div className="flex items-center justify-between py-3">
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#fff' }}>Messages</h1>
          {totalUnread > 0 && (
            <div className="rounded-full px-2.5 py-1" style={{ background: '#2196f3' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{totalUnread}</span>
            </div>
          )}
        </div>
        <div className="relative">
          <Search size={16} color="#555" className="absolute left-4 top-3.5" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white"
            style={{ background: '#111', border: '1px solid #222' }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Online now */}
        <div className="px-5 py-4">
          <p style={{ color: '#555', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>ACTIVE NOW</p>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {THREADS.filter(t => t.online).map(t => (
              <button key={t.id} onClick={() => setActiveThread(t)}
                className="flex flex-col items-center flex-shrink-0 active:opacity-70">
                <div className="relative mb-1">
                  <div className="rounded-full flex items-center justify-center"
                    style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#1565c0,#2196f3)', fontSize: 20, fontWeight: 900, color: '#fff' }}>
                    {t.name[0]}
                  </div>
                  <div className="absolute bottom-0 right-0 rounded-full"
                    style={{ width: 14, height: 14, background: '#00e676', border: '2px solid #000' }} />
                </div>
                <span style={{ color: '#888', fontSize: 11 }}>{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #111' }}>
          {filtered.map(t => (
            <button key={t.id} onClick={() => setActiveThread(t)}
              className="w-full flex items-center gap-4 px-5 py-4 active:bg-white/5 text-left"
              style={{ borderBottom: '1px solid #0a0a0a' }}>
              <div className="relative flex-shrink-0">
                <div className="rounded-full flex items-center justify-center"
                  style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#1565c0,#2196f3)', fontSize: 20, fontWeight: 900, color: '#fff' }}>
                  {t.name[0]}
                </div>
                {t.online && (
                  <div className="absolute bottom-0 right-0 rounded-full"
                    style={{ width: 14, height: 14, background: '#00e676', border: '2px solid #000' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>@{t.name}</span>
                  <span style={{ color: '#555', fontSize: 12 }}>{t.time}</span>
                </div>
                <p className="truncate" style={{ color: t.unread ? '#ccc' : '#555', fontSize: 13 }}>{t.lastMsg}</p>
              </div>
              {t.unread > 0 && (
                <div className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ width: 22, height: 22, background: '#2196f3', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                  {t.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
