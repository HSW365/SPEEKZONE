import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const THREADS = [
  { id: '1', name: 'CreatorKing', msg: 'Loved your latest episode!', time: '2m', unread: 2 },
  { id: '2', name: 'EntrepreneurTV', msg: 'Want to collab on an ep?', time: '1h', unread: 1 },
  { id: '3', name: 'SpeekZone Team', msg: 'Your show is now live on Spotify', time: '3h', unread: 0 },
  { id: '4', name: 'DevKing', msg: 'Great episode on ownership!', time: '1d', unread: 0 },
];

export default function Inbox() {
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const thread = THREADS.find(t => t.id === activeThread);

  if (activeThread && thread) {
    return (
      <div className="flex flex-col h-full">
        <div className="pt-safe flex-shrink-0 px-4" style={{ background: 'rgba(13,31,60,0.98)', borderBottom: '1px solid rgba(25,118,210,0.2)' }}>
          <div className="flex items-center gap-3 py-3">
            <button onClick={() => setActiveThread(null)} style={{ color: '#9aa3b2', fontSize: 14 }}>Back</button>
            <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18 }}>{thread.name}</h2>
          </div>
        </div>
        <div className="flex-1 scroll-y px-4 py-4 flex flex-col gap-3">
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tl-sm" style={{ background: 'rgba(25,118,210,0.25)', color: '#fff', fontSize: 14 }}>
              {thread.msg}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tr-sm" style={{ background: '#1565c0', color: '#fff', fontSize: 14 }}>
              Thanks! Glad you enjoyed it.
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 px-4 py-3 pb-safe flex gap-2" style={{ background: 'rgba(13,31,60,0.98)', borderTop: '1px solid rgba(25,118,210,0.15)' }}>
          <input
            type="text" value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm text-white placeholder-gray-600"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={() => setMsg('')}
            className="flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
            style={{ width: 40, height: 40, background: '#1565c0' }}
          >
            <Send size={16} color="#fff" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pt-safe flex-shrink-0 px-4 pb-2" style={{ background: '#0a1628', borderBottom: '1px solid rgba(25,118,210,0.15)' }}>
        <h1 className="py-3" style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 26, color: '#9aa3b2' }}>Inbox</h1>
      </div>
      <div className="flex-1 scroll-y">
        {THREADS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: '#5a6478' }}>
            <MessageCircle size={40} style={{ marginBottom: 12, color: '#2d3548' }} />
            <p style={{ fontFamily: 'Barlow Condensed', fontSize: 18 }}>No messages yet</p>
          </div>
        ) : (
          THREADS.map(t => (
            <button
              key={t.id} onClick={() => setActiveThread(t.id)}
              className="w-full flex items-center gap-3 px-4 py-4 active:bg-blue-900/20 transition-colors text-left"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 46, height: 46, background: 'linear-gradient(135deg,#1565c0,#0d1f3c)', border: '1px solid rgba(33,150,243,0.3)' }}>
                <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 16 }}>
                  {t.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 16 }}>{t.name}</span>
                  <span style={{ color: '#5a6478', fontSize: 12 }}>{t.time}</span>
                </div>
                <p className="truncate" style={{ color: t.unread ? '#9aa3b2' : '#5a6478', fontSize: 13 }}>{t.msg}</p>
              </div>
              {t.unread > 0 && (
                <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 20, height: 20, background: '#2196f3', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                  {t.unread}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
