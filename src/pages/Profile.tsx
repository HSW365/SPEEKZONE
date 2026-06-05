import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Grid,
  Heart,
  Play,
  ChevronRight,
  LogOut,
  Coins,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Video,
  Crown
} from 'lucide-react';
import { MOCK_CLIPS } from '../utils/data';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'clips' | 'liked' | 'ai'>('clips');

  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` :
    String(n);

  const plan = user?.plan ?? 'free';
  const planColor = plan === 'pro' ? '#ff0055' : plan === 'creator' ? '#00eaff' : '#777';

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <div
        className="pt-safe flex-shrink-0"
        style={{
          background:
            'radial-gradient(circle at 20% 0%, rgba(0,234,255,.22), transparent 28%), radial-gradient(circle at 85% 20%, rgba(255,0,85,.18), transparent 30%), #000',
          borderBottom: '1px solid rgba(255,255,255,.08)'
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24 }}>
            @{user?.username || 'hoodstar365'}
          </h1>

          <button
            className="rounded-full flex items-center justify-center active:scale-95"
            style={{
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.1)'
            }}
          >
            <Settings size={21} color="#fff" />
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-5">
            <div
              className="relative rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                width: 92,
                height: 92,
                background: 'linear-gradient(135deg,#00eaff,#ff0055)',
                boxShadow: '0 0 45px rgba(0,234,255,.22)',
                fontSize: 34,
                fontWeight: 900
              }}
            >
              {user?.name?.[0] || 'H'}

              <div
                className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  background: '#0b84ff',
                  border: '3px solid #000'
                }}
              >
                <ShieldCheck size={16} color="#fff" />
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-2">
              {[
                { val: fmt(MOCK_CLIPS.length), label: 'Clips' },
                { val: fmt(user?.followers ?? 12400), label: 'Followers' },
                { val: fmt(user?.totalLikes ?? 248000), label: 'Likes' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 25 }}>
                    {stat.val}
                  </p>
                  <p className="text-white/45 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-black text-lg">{user?.name || 'HOODSTAR365'}</p>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-black"
                style={{
                  color: planColor,
                  background: `${planColor}22`,
                  border: `1px solid ${planColor}55`
                }}
              >
                {plan.toUpperCase()}
              </span>
            </div>

            <p className="text-white/65 text-sm leading-snug">
              Creator. Artist. Builder. Powered by SpeekZone AI.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Coins size={16} color="#ffd700" />
              <span className="text-sm font-bold" style={{ color: '#ffd700' }}>
                {fmt(user?.coins ?? 2500)} coins
              </span>
              <span className="text-white/25">•</span>
              <span className="text-cyan-300 text-sm font-bold">AI Creator Score 92</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <button
              className="py-3 rounded-2xl font-black active:scale-95"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,.1)' }}
            >
              Edit Profile
            </button>

            <button
              onClick={() => navigate('/record')}
              className="py-3 rounded-2xl font-black active:scale-95"
              style={{ background: 'linear-gradient(90deg,#00eaff,#ff0055)', color: '#fff' }}
            >
              Create
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="py-3 rounded-2xl font-black active:scale-95"
              style={{ background: '#fff', color: '#000' }}
            >
              Upgrade
            </button>
          </div>

          <div
            className="mt-5 rounded-3xl p-4"
            style={{
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.1)',
              backdropFilter: 'blur(14px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles color="#00eaff" size={22} />
                <div>
                  <p className="font-black text-sm">AI Growth Kit</p>
                  <p className="text-white/45 text-xs">Captions, scripts, hashtags, analytics</p>
                </div>
              </div>

              <button onClick={() => navigate('/record')}>
                <ChevronRight size={20} color="#777" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex px-5">
          {[
            { id: 'clips', label: 'Clips', icon: Grid },
            { id: 'liked', label: 'Liked', icon: Heart },
            { id: 'ai', label: 'AI', icon: Sparkles }
          ].map(({ id, label, icon: Icon }) => {
            const active = tab === id;

            return (
              <button
                key={id}
                onClick={() => setTab(id as any)}
                className="flex-1 flex items-center justify-center gap-2 py-3 font-black text-sm"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,.35)',
                  borderBottom: active ? '2px solid #fff' : '2px solid transparent'
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(tab === 'clips' || tab === 'liked') && (
          <div className="grid grid-cols-3 gap-1 p-1">
            {(tab === 'clips' ? MOCK_CLIPS : MOCK_CLIPS.slice(0, 3)).map((clip, index) => (
              <div
                key={clip.id}
                className="relative overflow-hidden active:opacity-80"
                style={{
                  aspectRatio: '9/16',
                  background:
                    index % 3 === 0
                      ? 'linear-gradient(160deg,#050505,#24002d,#ff0055)'
                      : index % 3 === 1
                      ? 'linear-gradient(160deg,#020202,#002833,#00eaff)'
                      : 'linear-gradient(160deg,#030303,#251500,#ffb000)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                  <Video size={30} color="#fff" />
                </div>

                <div className="absolute left-2 bottom-2 flex items-center gap-1">
                  <Play size={11} fill="#fff" color="#fff" />
                  <span className="text-xs font-black">{fmt(clip.likes)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ai' && (
          <div className="p-5 space-y-4">
            {[
              {
                icon: Sparkles,
                title: 'AI Caption Generator',
                desc: 'Turn your idea into viral-ready captions.'
              },
              {
                icon: BarChart3,
                title: 'Creator Analytics',
                desc: 'Track growth, engagement, likes, and watch time.'
              },
              {
                icon: Crown,
                title: 'Monetization Tools',
                desc: 'Gifts, coins, subscriptions, and premium content.'
              }
            ].map(({ icon: Icon, title, desc }) => (
              <button
                key={title}
                onClick={() => navigate('/record')}
                className="w-full rounded-3xl p-5 flex items-center gap-4 text-left active:scale-95"
                style={{
                  background: '#0b0b0b',
                  border: '1px solid rgba(255,255,255,.08)'
                }}
              >
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    width: 54,
                    height: 54,
                    background: 'linear-gradient(135deg,rgba(0,234,255,.22),rgba(255,0,85,.2))'
                  }}
                >
                  <Icon color="#00eaff" />
                </div>

                <div className="flex-1">
                  <p className="font-black">{title}</p>
                  <p className="text-white/45 text-sm mt-1">{desc}</p>
                </div>

                <ChevronRight size={18} color="#555" />
              </button>
            ))}
          </div>
        )}

        <div className="mx-4 mt-4 mb-7 rounded-3xl overflow-hidden" style={{ border: '1px solid #111' }}>
          {[
            { label: 'Buy Coins', action: () => navigate('/pricing') },
            { label: 'Manage Subscription', action: () => navigate('/pricing') },
            { label: 'Privacy Policy', action: () => {} },
            { label: 'Terms of Service', action: () => {} }
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center justify-between px-5 py-4 active:bg-white/5"
              style={{ borderBottom: '1px solid #111', background: '#070707' }}
            >
              <span className="text-white/55 text-sm font-bold">{label}</span>
              <ChevronRight size={16} color="#333" />
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-5 py-4 active:bg-white/5"
            style={{ background: '#070707' }}
          >
            <span className="text-sm font-bold" style={{ color: '#ff5252' }}>
              Sign Out
            </span>
            <LogOut size={16} color="#ff5252" />
          </button>
        </div>

        <p className="text-center pb-6 text-white/15 text-xs">
          SpeekZone · AI Creator Network
        </p>
      </div>
    </div>
  );
}
