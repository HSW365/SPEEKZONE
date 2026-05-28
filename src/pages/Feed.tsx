import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Gift, MoreHorizontal, Play, Pause, Volume2 } from 'lucide-react';
import { MOCK_CLIPS, GIFTS, Clip } from '../utils/data';
import { useAuth } from '../context/AuthContext';

function Waveform({ bars, progress, playing }: { bars: number[]; progress: number; playing: boolean }) {
  return (
    <div className="flex items-center gap-0.5" style={{ height: 48 }}>
      {bars.map((h, i) => {
        const pct = i / bars.length;
        const active = pct <= progress;
        return (
          <div key={i} style={{
            width: 4, borderRadius: 2,
            height: `${Math.max(8, h * 48)}px`,
            background: active ? '#2196f3' : 'rgba(255,255,255,0.2)',
            transition: 'background 0.1s',
            animation: playing && active ? `wave ${0.4 + h * 0.6}s ease-in-out infinite alternate` : 'none',
          }} />
        );
      })}
    </div>
  );
}

function GiftSheet({ onClose, onSend }: { onClose: () => void; onSend: (g: typeof GIFTS[0]) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
      onClick={onClose}>
      <div className="rounded-t-3xl p-6" style={{ background: '#111' }} onClick={e => e.stopPropagation()}>
        <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 20, marginBottom: 20, textAlign: 'center' }}>
          Send a Gift
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {GIFTS.map(g => (
            <button key={g.id} onClick={() => onSend(g)}
              className="flex flex-col items-center p-4 rounded-2xl active:scale-95 transition-transform"
              style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <span style={{ fontSize: 36, marginBottom: 6 }}>{g.emoji}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{g.name}</span>
              <span style={{ color: '#2196f3', fontSize: 12, marginTop: 2 }}>{g.coins} coins</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl" style={{ background: '#222', color: '#888' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function CommentSheet({ onClose }: { onClose: () => void }) {
  const [msg, setMsg] = useState('');
  const { user } = useAuth();
  const comments = [
    { id: '1', username: 'CreatorKing',    text: 'This is hard 🔥🔥🔥',           likes: 234, time: '2m' },
    { id: '2', username: 'EntrepreneurTV', text: 'Bro said SPEAK YOUR WORLD 💯',   likes: 189, time: '5m' },
    { id: '3', username: 'AliTorres',      text: 'We needed this app fr',           likes: 145, time: '12m' },
    { id: '4', username: 'DevKing',        text: 'The waveform animation clean 👌', likes: 98,  time: '18m' },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
      onClick={onClose}>
      <div className="rounded-t-3xl flex flex-col" style={{ background: '#111', maxHeight: '70%' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #222' }}>
          <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18 }}>Comments</p>
          <button onClick={onClose} style={{ color: '#555' }}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ width: 36, height: 36, background: '#2196f3', fontSize: 14, fontWeight: 800 }}>
                {c.username[0]}
              </div>
              <div className="flex-1">
                <span style={{ color: '#2196f3', fontSize: 13, fontWeight: 700 }}>@{c.username} </span>
                <span style={{ color: '#ccc', fontSize: 14 }}>{c.text}</span>
                <div className="flex gap-4 mt-1">
                  <span style={{ color: '#555', fontSize: 12 }}>{c.time}</span>
                  <span style={{ color: '#555', fontSize: 12 }}>♥ {c.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-5 py-4 pb-safe" style={{ borderTop: '1px solid #222' }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Add a comment..."
            className="flex-1 px-4 py-3 rounded-full text-white text-sm"
            style={{ background: '#222', border: '1px solid #333' }} />
          <button onClick={() => setMsg('')}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 44, height: 44, background: '#2196f3' }}>
            <span style={{ fontSize: 18 }}>↑</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ClipCard({ clip, active }: { clip: Clip; active: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(clip.likes);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGifts, setShowGifts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [giftAnim, setGiftAnim] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = () => {
    if (playing) {
      clearInterval(timerRef.current!);
      setPlaying(false);
    } else {
      setPlaying(true);
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) { clearInterval(timerRef.current!); setPlaying(false); return 0; }
          return p + (1 / (clip.duration * 10));
        });
      }, 100);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  const handleGift = (g: typeof GIFTS[0]) => {
    setGiftAnim(g.emoji);
    setTimeout(() => setGiftAnim(null), 1500);
    setShowGifts(false);
  };

  const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  // BG colors per clip
  const bgs = [
    'radial-gradient(ellipse at 20% 20%, rgba(21,101,192,0.4) 0%, #000 60%)',
    'radial-gradient(ellipse at 80% 20%, rgba(229,57,53,0.3) 0%, #000 60%)',
    'radial-gradient(ellipse at 50% 80%, rgba(0,150,136,0.3) 0%, #000 60%)',
    'radial-gradient(ellipse at 20% 80%, rgba(156,39,176,0.3) 0%, #000 60%)',
    'radial-gradient(ellipse at 80% 50%, rgba(255,152,0,0.3) 0%, #000 60%)',
  ];
  const bg = bgs[parseInt(clip.id) % bgs.length];

  return (
    <div className="relative w-full h-full flex-shrink-0" style={{ background: bg }}>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6"
        onClick={togglePlay}>
        {/* Avatar */}
        <div className="rounded-full flex items-center justify-center mb-6"
          style={{ width: 100, height: 100, background: 'linear-gradient(135deg,#1565c0,#2196f3)', border: '3px solid rgba(33,150,243,0.5)', fontSize: 36, fontWeight: 900 }}>
          {clip.username[0]}
        </div>

        {/* Play/Pause indicator */}
        {!playing && (
          <div className="absolute flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <Play size={32} fill="#fff" color="#fff" />
          </div>
        )}

        {/* Waveform */}
        <div className="mt-4">
          <Waveform bars={clip.waveform} progress={progress} playing={playing} />
        </div>

        {/* Duration */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8 }}>
          {Math.floor(progress * clip.duration)}s / {clip.duration}s
        </p>
      </div>

      {/* Right action bar */}
      <div className="absolute right-4 flex flex-col items-center gap-6"
        style={{ bottom: 160 }}>
        <button onClick={handleLike} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Heart size={32} color={liked ? '#ff5252' : '#fff'} fill={liked ? '#ff5252' : 'none'} strokeWidth={1.5} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{fmt(likes)}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <MessageCircle size={32} color="#fff" strokeWidth={1.5} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{fmt(clip.comments)}</span>
        </button>
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Share2 size={32} color="#fff" strokeWidth={1.5} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{fmt(clip.shares)}</span>
        </button>
        <button onClick={() => setShowGifts(true)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Gift size={32} color="#ffd700" strokeWidth={1.5} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{fmt(clip.gifts)}</span>
        </button>
        {/* Spinning avatar */}
        <div className="rounded-full flex items-center justify-center"
          style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#1565c0,#2196f3)', border: '2px solid #fff', animation: 'spin 4s linear infinite', fontSize: 20, fontWeight: 900 }}>
          {clip.username[0]}
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute left-4 right-20" style={{ bottom: 160 }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>@{clip.username}</span>
          {clip.userVerified && (
            <div className="rounded-full flex items-center justify-center"
              style={{ width: 18, height: 18, background: '#2196f3', fontSize: 11 }}>✓</div>
          )}
          <button className="ml-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{ border: '1px solid #fff', color: '#fff' }}>
            Follow
          </button>
        </div>
        <p style={{ color: '#fff', fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>{clip.caption}</p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {clip.tags.map(t => (
            <span key={t} style={{ color: '#2196f3', fontSize: 13, fontWeight: 600 }}>#{t}</span>
          ))}
        </div>
        {/* Audio bar */}
        <div className="flex items-center gap-2 mt-3">
          <Volume2 size={14} color="#ccc" />
          <div className="flex-1 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: '#2196f3', transition: 'width 0.1s' }} />
          </div>
        </div>
      </div>

      {/* Gift animation */}
      {giftAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 40 }}>
          <span style={{ fontSize: 80, animation: 'fadeUp 1.5s ease forwards' }}>{giftAnim}</span>
        </div>
      )}

      {showGifts && <GiftSheet onClose={() => setShowGifts(false)} onSend={handleGift} />}
      {showComments && <CommentSheet onClose={() => setShowComments(false)} />}
    </div>
  );
}

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < MOCK_CLIPS.length - 1) setCurrentIndex(i => i + 1);
      if (diff < 0 && currentIndex > 0) setCurrentIndex(i => i - 1);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
      ref={containerRef}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center pt-safe z-10 py-3"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
        <div className="flex gap-6">
          <button style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 17 }}>Following</button>
          <button style={{ color: '#fff', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 17, borderBottom: '2px solid #2196f3', paddingBottom: 2 }}>For You</button>
          <button style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 17 }}>Live</button>
        </div>
      </div>

      {/* Clips */}
      <div className="w-full h-full" style={{
        transform: `translateY(-${currentIndex * 100}%)`,
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {MOCK_CLIPS.map((clip, i) => (
          <div key={clip.id} className="w-full" style={{ height: '100%' }}>
            <ClipCard clip={clip} active={i === currentIndex} />
          </div>
        ))}
      </div>

      {/* Scroll indicator dots */}
      <div className="absolute right-2 flex flex-col gap-1.5" style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
        {MOCK_CLIPS.map((_, i) => (
          <div key={i} style={{
            width: 3, height: i === currentIndex ? 20 : 8, borderRadius: 2,
            background: i === currentIndex ? '#2196f3' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}
