import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Gift, Music, Play } from 'lucide-react';
import { MOCK_CLIPS, Clip } from '../utils/data';

function ClipCard({ clip }: { clip: Clip }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(clip.likes);
  const [feedTab, setFeedTab] = useState<'following' | 'foryou' | 'live'>('foryou');

  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` :
    String(n);

  const handleLike = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <section className="relative w-full h-full flex-shrink-0 overflow-hidden bg-black">
      {clip.videoUrl ? (
        <video
          src={clip.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              clip.id === '1'
                ? 'linear-gradient(160deg,#050505 0%,#19002e 45%,#ff0055 140%)'
                : clip.id === '2'
                ? 'linear-gradient(160deg,#020202 0%,#001d28 45%,#00eaff 140%)'
                : clip.id === '3'
                ? 'linear-gradient(160deg,#040404 0%,#221000 45%,#ffb000 140%)'
                : clip.id === '4'
                ? 'linear-gradient(160deg,#020202 0%,#041e12 45%,#00ff88 140%)'
                : 'linear-gradient(160deg,#050505 0%,#2c0000 45%,#ff3030 140%)',
          }}
        >
          <div className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(circle at 25% 20%, rgba(255,255,255,.35), transparent 20%), radial-gradient(circle at 80% 65%, rgba(255,255,255,.2), transparent 25%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <div
              className="mb-5 rounded-full flex items-center justify-center"
              style={{
                width: 116,
                height: 116,
                background: 'rgba(255,255,255,.12)',
                border: '2px solid rgba(255,255,255,.35)',
                boxShadow: '0 0 40px rgba(255,255,255,.18)',
                backdropFilter: 'blur(12px)',
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {clip.username[0]}
            </div>

            <h1
              style={{
                fontFamily: 'Barlow Condensed',
                fontSize: 52,
                lineHeight: .9,
                fontWeight: 900,
                letterSpacing: -1,
                textShadow: '0 8px 35px rgba(0,0,0,.7)',
              }}
            >
              SPEEKZONE
            </h1>

            <p className="mt-3 text-sm text-white/80 max-w-xs">
              Audio &amp; video creator network. Record, share, go viral.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-full px-5 py-3"
              style={{
                background: 'rgba(0,0,0,.45)',
                border: '1px solid rgba(255,255,255,.15)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <Play size={18} fill="#fff" />
              <span className="text-sm font-bold">Tap. Watch. Create.</span>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,.55), transparent 25%, transparent 55%, rgba(0,0,0,.9))',
        }}
      />

      {/* Top tab buttons — high z-index, explicit pointer-events */}
      <div
        className="absolute top-0 left-0 right-0 z-30"
        style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}
      >
        <div className="flex justify-center gap-7 py-4">
          {(['following', 'foryou', 'live'] as const).map((t) => {
            const label = t === 'foryou' ? 'For You' : t === 'following' ? 'Following' : 'Live';
            const active = feedTab === t;
            return (
              <button
                key={t}
                onPointerDown={(e) => { e.stopPropagation(); setFeedTab(t); }}
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,.55)',
                  fontWeight: active ? 900 : 700,
                  borderBottom: active ? '2px solid #fff' : '2px solid transparent',
                  paddingBottom: 4,
                  fontSize: 15,
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  cursor: 'pointer',
                  minWidth: 60,
                  textAlign: 'center',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right action buttons */}
      <div className="absolute right-4 flex flex-col items-center gap-6 z-30" style={{ bottom: 150 }}>
        <button
          onPointerDown={(e) => { e.stopPropagation(); handleLike(e); }}
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <Heart size={31} color={liked ? '#ff2d55' : '#fff'} fill={liked ? '#ff2d55' : 'none'} />
          </div>
          <span className="text-xs font-black">{fmt(likes)}</span>
        </button>

        <button
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <MessageCircle size={31} color="#fff" />
          </div>
          <span className="text-xs font-black">{fmt(clip.comments)}</span>
        </button>

        <button
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <Share2 size={30} color="#fff" />
          </div>
          <span className="text-xs font-black">{fmt(clip.shares)}</span>
        </button>

        <button
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <Gift size={30} color="#ffd700" />
          </div>
          <span className="text-xs font-black">{fmt(clip.gifts)}</span>
        </button>

        <div className="rounded-full flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg,#00eaff,#ff0055)',
            border: '2px solid #fff',
            animation: 'spin 4s linear infinite',
            fontWeight: 900,
          }}>
          {clip.username[0]}
        </div>
      </div>

      <div className="absolute left-4 right-24 z-20" style={{ bottom: 138 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-black text-lg">@{clip.username}</span>
          {clip.userVerified && (
            <span className="rounded-full bg-blue-500 text-white text-xs px-1.5">✓</span>
          )}
          <button
            className="ml-2 px-3 py-1 rounded-full text-xs font-black border border-white"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            Follow
          </button>
        </div>

        <p className="text-sm leading-snug text-white mb-2">{clip.caption}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {clip.tags.map(t => (
            <span key={t} className="text-sm font-bold text-cyan-300">#{t}</span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-white/85">
          <Music size={15} />
          <span className="truncate">Original Sound - SpeekZone Creators</span>
        </div>
      </div>
    </section>
  );
}

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startY = useRef(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only track swipe on the background, not on interactive elements
    if ((e.target as HTMLElement).closest('button')) return;
    startY.current = e.clientY;
    startX.current = e.clientX;
    isDragging.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const diffY = startY.current - e.clientY;
    const diffX = Math.abs(startX.current - e.clientX);

    // Only vertical swipe if more vertical than horizontal
    if (Math.abs(diffY) > 60 && Math.abs(diffY) > diffX * 1.5) {
      if (diffY > 0 && currentIndex < MOCK_CLIPS.length - 1) {
        setCurrentIndex(i => i + 1);
      }
      if (diffY < 0 && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
          transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {MOCK_CLIPS.map((clip) => (
          <div key={clip.id} className="w-full h-full">
            <ClipCard clip={clip} />
          </div>
        ))}
      </div>
    </div>
  );
}
