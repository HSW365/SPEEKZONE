import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, Grid, Heart, Play, ChevronRight, LogOut, Coins } from 'lucide-react';
import { MOCK_CLIPS, PLANS } from '../utils/data';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'clips'|'liked'>('clips');

  const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  const planColor = user?.plan === 'pro' ? '#ff5252' : user?.plan === 'creator' ? '#2196f3' : '#555';

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      {/* Header */}
      <div className="pt-safe flex-shrink-0 px-5" style={{ borderBottom: '1px solid #111' }}>
        <div className="flex items-center justify-between py-3">
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, color: '#fff' }}>
            @{user?.username}
          </h1>
          <button className="active:opacity-60"><Settings size={22} color="#888" /></button>
        </div>

        {/* Avatar + stats */}
        <div className="flex items-center gap-5 pb-4">
          <div className="rounded-full flex items-center justify-center flex-shrink-0 relative"
            style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#1565c0,#2196f3)', border: '2px solid rgba(33,150,243,0.5)', fontSize: 30, fontWeight: 900, color: '#fff' }}>
            {user?.name?.[0]}
            {user?.verified && (
              <div className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
                style={{ width: 22, height: 22, background: '#2196f3', fontSize: 12, border: '2px solid #000' }}>✓</div>
            )}
          </div>
          <div className="flex gap-6 flex-1">
            {[
              { val: fmt(MOCK_CLIPS.length), label: 'Clips' },
              { val: fmt(user?.followers ?? 0), label: 'Followers' },
              { val: fmt(user?.following ?? 0), label: 'Following' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span style={{ color: '#fff', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{val}</span>
                <span style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Name + bio */}
        <div className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{user?.name}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: `${planColor}22`, color: planColor, border: `1px solid ${planColor}44` }}>
              {(user?.plan ?? 'free').toUpperCase()}
            </span>
          </div>
          {user?.bio && <p style={{ color: '#888', fontSize: 14, lineHeight: 1.4 }}>{user.bio}</p>}
          {/* Coins */}
          <div className="flex items-center gap-2 mt-2">
            <span style={{ fontSize: 16 }}>🪙</span>
            <span style={{ color: '#ffd700', fontWeight: 700, fontSize: 14 }}>{fmt(user?.coins ?? 0)} coins</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pb-4">
          <button className="flex-1 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: '#111', border: '1px solid #222', color: '#fff', fontFamily: 'Barlow Condensed', fontSize: 16 }}>
            Edit Profile
          </button>
          <button onClick={() => navigate('/pricing')}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: user?.plan === 'free' ? 'linear-gradient(135deg,#1565c0,#2196f3)' : '#111', border: '1px solid #222', color: '#fff', fontFamily: 'Barlow Condensed', fontSize: 16 }}>
            {user?.plan === 'free' ? 'Go Creator' : 'Manage Plan'}
          </button>
          <button className="py-2.5 px-3 rounded-xl"
            style={{ background: '#111', border: '1px solid #222' }}>
            <ChevronRight size={18} color="#888" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: '#111', marginLeft: -20, marginRight: -20, paddingLeft: 20 }}>
          <button onClick={() => setTab('clips')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors"
            style={{ color: tab === 'clips' ? '#fff' : '#555', borderBottom: tab === 'clips' ? '2px solid #fff' : '2px solid transparent' }}>
            <Grid size={16} /> Clips
          </button>
          <button onClick={() => setTab('liked')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors"
            style={{ color: tab === 'liked' ? '#fff' : '#555', borderBottom: tab === 'liked' ? '2px solid #fff' : '2px solid transparent' }}>
            <Heart size={16} /> Liked
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Clips grid */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {(tab === 'clips' ? MOCK_CLIPS : MOCK_CLIPS.slice(0,2)).map(clip => (
            <div key={clip.id} className="relative active:opacity-70" style={{ aspectRatio: '9/16', background: '#0a0f1a' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-0.5">
                  {clip.waveform.slice(0,8).map((h, i) => (
                    <div key={i} style={{ width: 3, borderRadius: 1.5, height: `${h * 32 + 4}px`, background: 'rgba(33,150,243,0.5)' }} />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Play size={10} fill="#fff" color="#fff" />
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{(clip.likes/1000).toFixed(1)}K</span>
              </div>
            </div>
          ))}
        </div>

        {user?.plan === 'free' && tab === 'clips' && (
          <div className="mx-4 my-4 rounded-2xl p-5 text-center"
            style={{ background: 'rgba(33,150,243,0.08)', border: '1px solid rgba(33,150,243,0.2)' }}
            onClick={() => navigate('/pricing')}>
            <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Start Creating</p>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>Upgrade to post clips and grow your audience.</p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#1565c0,#2196f3)' }}>
              <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15 }}>Go Creator — $9.99/mo</span>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="mx-4 mt-4 mb-6 rounded-2xl overflow-hidden" style={{ border: '1px solid #111' }}>
          {[
            { label: 'Buy Coins', action: () => {} },
            { label: 'Manage Subscription', action: () => navigate('/pricing') },
            { label: 'Privacy Policy', action: () => {} },
            { label: 'Terms of Service', action: () => {} },
          ].map(({ label, action }) => (
            <button key={label} onClick={action}
              className="w-full flex items-center justify-between px-5 py-4 active:bg-white/5"
              style={{ borderBottom: '1px solid #111', background: '#0a0a0a' }}>
              <span style={{ color: '#888', fontSize: 15 }}>{label}</span>
              <ChevronRight size={16} color="#333" />
            </button>
          ))}
          <button onClick={logout}
            className="w-full flex items-center justify-between px-5 py-4 active:bg-white/5"
            style={{ background: '#0a0a0a' }}>
            <span style={{ color: '#ff5252', fontSize: 15 }}>Sign Out</span>
            <LogOut size={16} color="#ff5252" />
          </button>
        </div>
        <p className="text-center pb-6" style={{ color: '#222', fontSize: 11 }}>
          SpeekZone v2.0 · hsw365media@gmail.com
        </p>
      </div>
    </div>
  );
}
