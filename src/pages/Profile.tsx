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
  Crown,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle
} from 'lucide-react';
import { MOCK_CLIPS } from '../utils/data';

function DeleteAccountModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [step, setStep] = useState<'confirm' | 'deleting' | 'done'>('confirm');
  const [inputVal, setInputVal] = useState('');

  const handleDelete = async () => {
    setStep('deleting');
    await onConfirm();
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="mx-5 rounded-3xl p-8 text-center"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.1)', maxWidth: 380, width: '100%' }}
        >
          <CheckCircle size={56} color="#00eaff" className="mx-auto mb-4" />
          <h2 className="text-white font-black text-xl mb-2">Account Deleted</h2>
          <p className="text-white/55 text-sm">Your account and all associated data have been permanently removed.</p>
        </div>
      </div>
    );
  }

  if (step === 'deleting') {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="mx-5 rounded-3xl p-8 text-center"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.1)', maxWidth: 380, width: '100%' }}
        >
          <div
            className="mx-auto mb-4 rounded-full"
            style={{
              width: 56,
              height: 56,
              border: '3px solid #ff0055',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <h2 className="text-white font-black text-xl mb-2">Deleting Account...</h2>
          <p className="text-white/55 text-sm">Permanently removing your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="mx-5 rounded-3xl overflow-hidden"
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.1)', maxWidth: 380, width: '100%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div className="flex items-center gap-3">
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 44, height: 44, background: 'rgba(255,0,85,.15)', border: '1px solid rgba(255,0,85,.3)' }}
            >
              <AlertTriangle size={22} color="#ff0055" />
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">Delete Account</h2>
              <p className="text-white/40 text-xs">This cannot be undone</p>
            </div>
          </div>
          <button
            onPointerDown={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: 'rgba(255,255,255,.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation',
            }}
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            Permanently deleting your account will remove:
          </p>

          {['Your profile and username', 'All posts, clips, and content', 'Followers and following lists', 'Coins, gifts, and earnings', 'All account data and history'].map((item) => (
            <div key={item} className="flex items-center gap-3 mb-3">
              <div style={{ width: 6, height: 6, borderRadius: 3, background: '#ff0055', flexShrink: 0 }} />
              <span className="text-white/60 text-sm">{item}</span>
            </div>
          ))}

          <p className="text-white/70 text-sm mt-5 mb-3">
            Type <span className="text-white font-black">DELETE</span> to confirm:
          </p>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-4 py-3 rounded-2xl text-white text-sm font-bold outline-none"
            style={{
              background: 'rgba(255,255,255,.06)',
              border: `1px solid ${inputVal === 'DELETE' ? '#ff0055' : 'rgba(255,255,255,.12)'}`,
              letterSpacing: 1,
            }}
          />
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onPointerDown={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-sm"
            style={{
              background: 'rgba(255,255,255,.07)',
              color: '#fff',
              touchAction: 'manipulation',
            }}
          >
            Cancel
          </button>
          <button
            onPointerDown={() => { if (inputVal === 'DELETE') handleDelete(); }}
            className="flex-1 py-4 rounded-2xl font-black text-sm"
            style={{
              background: inputVal === 'DELETE' ? '#ff0055' : 'rgba(255,0,85,.2)',
              color: inputVal === 'DELETE' ? '#fff' : 'rgba(255,255,255,.3)',
              touchAction: 'manipulation',
              transition: 'all 0.2s',
            }}
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'clips' | 'liked' | 'ai'>('clips');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` :
    String(n);

  const plan = user?.plan ?? 'free';
  const planColor = plan === 'pro' ? '#ff0055' : plan === 'creator' ? '#00eaff' : '#777';

  const handleDeleteConfirm = async () => {
    await deleteAccount();
  };

  return (
    <div className="h-full bg-black text-white flex flex-col">
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

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
            className="rounded-full flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.1)',
              touchAction: 'manipulation',
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
              className="py-3 rounded-2xl font-black"
              style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,.1)',
                touchAction: 'manipulation',
              }}
            >
              Edit Profile
            </button>

            <button
              onPointerDown={() => navigate('/record')}
              className="py-3 rounded-2xl font-black"
              style={{
                background: 'linear-gradient(90deg,#00eaff,#ff0055)',
                color: '#fff',
                touchAction: 'manipulation',
              }}
            >
              Create
            </button>

            <button
              onPointerDown={() => navigate('/pricing')}
              className="py-3 rounded-2xl font-black"
              style={{
                background: '#fff',
                color: '#000',
                touchAction: 'manipulation',
              }}
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

              <button onPointerDown={() => navigate('/record')} style={{ touchAction: 'manipulation' }}>
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
                onPointerDown={() => setTab(id as any)}
                className="flex-1 flex items-center justify-center gap-2 py-3 font-black text-sm"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,.35)',
                  borderBottom: active ? '2px solid #fff' : '2px solid transparent',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
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
                className="relative overflow-hidden"
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
                onPointerDown={() => navigate('/record')}
                className="w-full rounded-3xl p-5 flex items-center gap-4 text-left"
                style={{
                  background: '#0b0b0b',
                  border: '1px solid rgba(255,255,255,.08)',
                  touchAction: 'manipulation',
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

        <div className="mx-4 mt-4 mb-2 rounded-3xl overflow-hidden" style={{ border: '1px solid #111' }}>
          {[
            { label: 'Buy Coins', action: () => navigate('/pricing') },
            { label: 'Manage Subscription', action: () => navigate('/pricing') },
            { label: 'Privacy Policy', action: () => {} },
            { label: 'Terms of Service', action: () => {} }
          ].map(({ label, action }) => (
            <button
              key={label}
              onPointerDown={action}
              className="w-full flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: '1px solid #111',
                background: '#070707',
                touchAction: 'manipulation',
              }}
            >
              <span className="text-white/55 text-sm font-bold">{label}</span>
              <ChevronRight size={16} color="#333" />
            </button>
          ))}

          <button
            onPointerDown={logout}
            className="w-full flex items-center justify-between px-5 py-4"
            style={{ background: '#070707', borderBottom: '1px solid #111', touchAction: 'manipulation' }}
          >
            <span className="text-sm font-bold" style={{ color: '#ff5252' }}>
              Sign Out
            </span>
            <LogOut size={16} color="#ff5252" />
          </button>

          {/* Delete Account — Apple 5.1.1(v) requirement */}
          <button
            onPointerDown={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between px-5 py-4"
            style={{ background: '#070707', touchAction: 'manipulation' }}
          >
            <span className="text-sm font-bold" style={{ color: '#ff3030' }}>
              Delete Account
            </span>
            <Trash2 size={16} color="#ff3030" />
          </button>
        </div>

        <p className="text-center text-white/15 text-xs mt-2 pb-6">
          SpeekZone · AI Creator Network
        </p>
      </div>
    </div>
  );
}
