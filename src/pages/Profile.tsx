import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, Mic, Users, Play, ChevronRight, LogOut, BadgeCheck } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'shows'|'stats'>('shows');

  const planColors: Record<string, string> = { free: '#5a6478', basic: '#2196f3', pro: '#ff5252', elite: '#00e676' };
  const planColor = planColors[user?.plan ?? 'free'];

  return (
    <div className="flex flex-col h-full">
      <div className="pt-safe flex-shrink-0 px-4 pb-0" style={{ background: 'rgba(13,31,60,0.98)', borderBottom: '1px solid rgba(25,118,210,0.15)' }}>
        <div className="flex items-center justify-between py-3">
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22 }}>Profile</h1>
          <button className="active:opacity-60"><Settings size={22} color="#9aa3b2" /></button>
        </div>

        {/* Avatar + info */}
        <div className="flex items-center gap-4 py-4">
          <div
            className="rounded-2xl flex items-center justify-center flex-shrink-0 relative"
            style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#1565c0,#0d47a1)', border: '2px solid rgba(33,150,243,0.4)' }}
          >
            <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 26 }}>
              {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
            {user?.verified && (
              <div className="absolute -bottom-1 -right-1">
                <BadgeCheck size={18} color="#2196f3" fill="#0d1f3c" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>
                {user?.name}
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ fontFamily: 'Barlow Condensed', background: `${planColor}22`, color: planColor, border: `1px solid ${planColor}44` }}
              >
                {user?.plan?.toUpperCase()}
              </span>
            </div>
            <p style={{ color: '#42a5f5', fontSize: 13, fontFamily: 'Barlow Condensed', fontWeight: 600 }}>
              @{user?.username}
            </p>
            {user?.bio && <p className="mt-1 text-sm leading-snug" style={{ color: '#9aa3b2' }}>{user.bio}</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pb-3">
          {[
            { label: 'Followers', value: (user?.followers ?? 0).toLocaleString() },
            { label: 'Following', value: (user?.following ?? 0).toLocaleString() },
            { label: 'Total Plays', value: ((user?.totalPlays ?? 0) / 1000).toFixed(1) + 'k' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 20, color: '#2196f3' }}>{value}</div>
              <div style={{ color: '#5a6478', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {(['shows', 'stats'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{
                fontFamily: 'Barlow Condensed', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 13,
                color: tab === t ? '#2196f3' : '#5a6478',
                borderBottom: tab === t ? '2px solid #2196f3' : '2px solid transparent',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 scroll-y px-4 py-4">
        {tab === 'shows' ? (
          user?.plan === 'free' ? (
            <div
              className="rounded-2xl p-6 text-center mt-4"
              style={{ background: 'rgba(20,40,72,0.6)', border: '1px solid rgba(25,118,210,0.2)' }}
              onClick={() => navigate('/pricing')}
            >
              <Mic size={32} color="#2d3548" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 18, marginBottom: 6 }}>
                Start Creating
              </h3>
              <p style={{ color: '#9aa3b2', fontSize: 13, marginBottom: 16 }}>
                Upgrade to host your podcast and reach the world.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#1976d2' }}>
                <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15 }}>View Plans from $8/mo</span>
              </div>
            </div>
          ) : (
            <div>
              {/* Placeholder shows */}
              {['Respect Da Game'].map(title => (
                <div key={title} className="rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ background: 'rgba(20,40,72,0.6)', border: '1px solid rgba(25,118,210,0.2)' }}>
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#1565c0,#0d1f3c)' }}>
                    <Mic size={22} color="#42a5f5" />
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 16 }}>{title}</h3>
                    <p style={{ color: '#5a6478', fontSize: 12 }}>24 episodes · 48.2k plays</p>
                  </div>
                  <ChevronRight size={18} color="#5a6478" />
                </div>
              ))}
              <div
                className="rounded-2xl p-4 flex items-center justify-center gap-2 mt-1"
                style={{ border: '1px dashed rgba(33,150,243,0.3)', cursor: 'pointer' }}
                onClick={() => navigate('/create')}
              >
                <span style={{ color: '#2196f3', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15 }}>+ Add New Show</span>
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { label: 'Total Plays', value: '48.2k', icon: <Play size={18} color="#2196f3" /> },
              { label: 'Subscribers', value: '1,240', icon: <Users size={18} color="#ff5252" /> },
              { label: 'Episodes', value: '24', icon: <Mic size={18} color="#00e676" /> },
              { label: 'Platforms', value: '10+', icon: <Play size={18} color="#42a5f5" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-2xl p-4" style={{ background: 'rgba(20,40,72,0.6)', border: '1px solid rgba(25,118,210,0.15)' }}>
                <div className="mb-2">{icon}</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, lineHeight: 1 }}>{value}</div>
                <div style={{ color: '#5a6478', fontSize: 12, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Settings items */}
        <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { label: 'Manage Subscription', action: () => navigate('/pricing') },
            { label: 'Privacy Policy', action: () => {} },
            { label: 'Terms of Service', action: () => {} },
          ].map(({ label, action }) => (
            <button key={label} onClick={action} className="w-full flex items-center justify-between px-4 py-4 active:opacity-60" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(20,40,72,0.4)' }}>
              <span style={{ color: '#9aa3b2', fontSize: 15 }}>{label}</span>
              <ChevronRight size={16} color="#5a6478" />
            </button>
          ))}
          <button onClick={logout} className="w-full flex items-center justify-between px-4 py-4 active:opacity-60" style={{ background: 'rgba(20,40,72,0.4)' }}>
            <span style={{ color: '#ff5252', fontSize: 15 }}>Sign Out</span>
            <LogOut size={16} color="#ff5252" />
          </button>
        </div>
        <p className="text-center mt-4 pb-2" style={{ color: '#2d3548', fontSize: 11 }}>
          SpeekZone v1.0.0 · hsw365media@gmail.com
        </p>
      </div>
    </div>
  );
}
