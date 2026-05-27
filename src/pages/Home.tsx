import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Mic, Play, Heart, Share2, ChevronRight } from 'lucide-react';

const MOCK_PODCASTS = [
  { id: '1', title: 'Respect Da Game', host: 'HOODSTAR365', ep: 'Ownership in the Indie Music Era', plays: 4820, duration: '42:18', cover: null },
  { id: '2', title: 'Creator Mindset', host: 'CreatorKing', ep: 'Building a Brand From Zero', plays: 2310, duration: '31:05', cover: null },
  { id: '3', title: 'Money Moves', host: 'EntrepreneurTV', ep: 'How to Fund Your Startup in 2026', plays: 9120, duration: '55:40', cover: null },
  { id: '4', title: 'The Real Talk', host: 'Ali Torres', ep: 'Why Authenticity Wins Every Time', plays: 1430, duration: '28:12', cover: null },
];

function PodcastCard({ pod }: { pod: typeof MOCK_PODCASTS[0] }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 mb-3 active:scale-98 transition-transform"
      style={{ background: 'linear-gradient(135deg,rgba(20,40,72,0.95),rgba(10,22,40,0.95))', border: '1px solid rgba(25,118,210,0.2)' }}
    >
      <div className="flex gap-3 items-start">
        {/* Cover */}
        <div
          className="rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#1565c0,#0d1f3c)' }}
          onClick={() => navigate(`/podcast/${pod.id}`)}
        >
          <Mic size={24} color="#42a5f5" />
        </div>
        <div className="flex-1 min-w-0" onClick={() => navigate(`/podcast/${pod.id}`)}>
          <p className="text-xs tracking-wider uppercase mb-0.5" style={{ color: '#42a5f5', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>
            {pod.host}
          </p>
          <h3 className="font-bold text-white text-sm leading-tight mb-1" style={{ fontFamily: 'Barlow Condensed', fontSize: 16 }}>
            {pod.title}
          </h3>
          <p className="text-xs leading-snug line-clamp-2" style={{ color: '#9aa3b2' }}>{pod.ep}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          className="flex items-center gap-1.5 rounded-full px-4 py-2 active:opacity-70"
          style={{ background: 'linear-gradient(135deg,#1565c0,#2196f3)' }}
          onClick={() => navigate(`/podcast/${pod.id}`)}
        >
          <Play size={14} fill="#fff" color="#fff" />
          <span className="text-xs font-bold text-white" style={{ fontFamily: 'Barlow Condensed', letterSpacing: '0.05em' }}>PLAY</span>
        </button>
        <span style={{ color: '#5a6478', fontSize: 12 }}>{pod.duration}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setLiked(!liked)} className="active:scale-90 transition-transform">
            <Heart size={18} color={liked ? '#ff5252' : '#5a6478'} fill={liked ? '#ff5252' : 'none'} />
          </button>
          <button className="active:scale-90 transition-transform">
            <Share2 size={18} color="#5a6478" />
          </button>
          <span style={{ color: '#5a6478', fontSize: 12 }}>{pod.plays.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full" style={{ background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(21,101,192,0.2) 0%, #0a1628 60%)' }}>
      {/* Header */}
      <div className="pt-safe flex-shrink-0">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p style={{ color: '#5a6478', fontSize: 12, fontFamily: 'Barlow Condensed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Good day,
            </p>
            <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, lineHeight: 1.1 }}>
              {user?.name?.split(' ')[0]}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {user?.plan !== 'free' && (
              <span
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ fontFamily: 'Barlow Condensed', letterSpacing: '0.05em', background: 'rgba(229,57,53,0.2)', color: '#ff5252', border: '1px solid rgba(229,57,53,0.3)' }}
              >
                {user?.plan?.toUpperCase()}
              </span>
            )}
            <button className="active:opacity-60">
              <Bell size={22} color="#9aa3b2" />
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 scroll-y px-4 pb-4">
        {/* Featured banner */}
        <div
          className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1565c0 0%,#0d47a1 60%,#0a1628 100%)', border: '1px solid rgba(33,150,243,0.3)' }}
          onClick={() => navigate('/discover')}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(33,150,243,0.15)' }} />
          <p style={{ fontFamily: 'Barlow Condensed', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#42a5f5', marginBottom: 6 }}>
            Featured
          </p>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, lineHeight: 1.1, marginBottom: 8 }}>
            Respect Da Game<br />
            <span style={{ color: '#ff5252' }}>Podcast</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
            Real conversations about music, entrepreneurship, and the indie grind.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Play size={12} fill="#fff" color="#fff" />
              <span style={{ fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: 700 }}>Listen Now</span>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.5)" />
          </div>
        </div>

        {/* Section label */}
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#42a5f5' }}>
            Latest Shows
          </p>
          <button onClick={() => navigate('/discover')} style={{ color: '#2196f3', fontSize: 13 }}>See all</button>
        </div>

        {MOCK_PODCASTS.map(pod => <PodcastCard key={pod.id} pod={pod} />)}

        {/* Upgrade nudge for free users */}
        {user?.plan === 'free' && (
          <div
            className="rounded-2xl p-4 mt-2 mb-4 text-center"
            style={{ background: 'linear-gradient(135deg,rgba(229,57,53,0.15),rgba(10,22,40,0.8))', border: '1px solid rgba(229,57,53,0.25)' }}
            onClick={() => navigate('/pricing')}
          >
            <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              Start Creating — from $8/mo
            </p>
            <p style={{ color: '#9aa3b2', fontSize: 13 }}>Launch your podcast and monetize your voice.</p>
          </div>
        )}
      </div>
    </div>
  );
}
