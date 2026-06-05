import React, { useState } from 'react';
import { Search, TrendingUp, Sparkles, Play, Flame, Crown, Wand2, Hash } from 'lucide-react';
import { MOCK_CLIPS, TRENDING_TAGS } from '../utils/data';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['For You', 'Music', 'Business', 'Motivation', 'Tech', 'Comedy', 'Sports', 'AI'];

const CREATORS = [
  { name: 'HOODSTAR365', role: 'Founder · Music · AI', verified: true },
  { name: 'CreatorKing', role: 'Viral creator', verified: true },
  { name: 'EntrepreneurTV', role: 'Business creator', verified: true },
  { name: 'AliTorres', role: 'Motivation', verified: false },
  { name: 'DevKing', role: 'Tech builder', verified: false }
];

export default function Discover() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('For You');
  const navigate = useNavigate();

  const filtered = MOCK_CLIPS.filter(c =>
    !query ||
    c.username.toLowerCase().includes(query.toLowerCase()) ||
    c.caption.toLowerCase().includes(query.toLowerCase()) ||
    c.tags.join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` :
    String(n);

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <div
        className="pt-safe flex-shrink-0 px-4 pb-4"
        style={{
          background:
            'radial-gradient(circle at 20% 0%, rgba(0,234,255,.22), transparent 30%), radial-gradient(circle at 80% 5%, rgba(255,0,85,.18), transparent 30%), #000',
          borderBottom: '1px solid rgba(255,255,255,.08)'
        }}
      >
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-white/40 text-xs font-black tracking-widest">SPEEKZONE</p>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 34 }}>
              Discover
            </h1>
          </div>

          <button
            onClick={() => navigate('/record')}
            className="rounded-full flex items-center justify-center active:scale-95"
            style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg,#00eaff,#ff0055)',
              boxShadow: '0 0 28px rgba(0,234,255,.25)'
            }}
          >
            <Sparkles size={23} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={17} color="#888" className="absolute left-4 top-3.5" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search creators, clips, AI ideas..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-white"
            style={{
              background: 'rgba(255,255,255,.07)',
              border: '1px solid rgba(255,255,255,.12)',
              backdropFilter: 'blur(12px)'
            }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-black active:scale-95"
              style={{
                background: cat === c ? '#fff' : 'rgba(255,255,255,.07)',
                color: cat === c ? '#000' : 'rgba(255,255,255,.65)',
                border: `1px solid ${cat === c ? '#fff' : 'rgba(255,255,255,.1)'}`,
                fontFamily: 'Barlow Condensed',
                fontSize: 15,
                letterSpacing: '.04em'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-5">
        {!query && (
          <>
            <section
              onClick={() => navigate('/record')}
              className="rounded-3xl p-5 my-5 active:scale-[.98]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,234,255,.18), rgba(255,0,85,.18)), #080808',
                border: '1px solid rgba(255,255,255,.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)' }}
                >
                  <Wand2 color="#00eaff" />
                </div>

                <div>
                  <p className="text-white/45 text-xs font-black tracking-widest">AI TREND ENGINE</p>
                  <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 26 }}>
                    Create what is trending
                  </h2>
                </div>
              </div>

              <p className="text-white/65 text-sm leading-relaxed">
                Generate hooks, captions, hashtags, and video ideas built for creators.
              </p>
            </section>

            <section className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={17} color="#00eaff" />
                <span className="font-black text-sm tracking-widest">TRENDING HASHTAGS</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => setQuery(t.slice(1))}
                    className="px-3 py-2 rounded-full text-sm font-black active:scale-95"
                    style={{
                      background: 'rgba(0,234,255,.09)',
                      border: '1px solid rgba(0,234,255,.25)',
                      color: '#7eefff'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <p className="font-black text-sm tracking-widest mb-3">TOP CREATORS</p>

              <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {CREATORS.map((creator, i) => (
                  <button
                    key={creator.name}
                    className="flex-shrink-0 rounded-3xl p-3 text-left active:scale-95"
                    style={{
                      width: 136,
                      background: '#080808',
                      border: '1px solid rgba(255,255,255,.08)'
                    }}
                  >
                    <div
                      className="relative rounded-full flex items-center justify-center mb-3"
                      style={{
                        width: 62,
                        height: 62,
                        background:
                          i === 0
                            ? 'linear-gradient(135deg,#00eaff,#ff0055)'
                            : 'linear-gradient(135deg,#111,#333)',
                        fontSize: 22,
                        fontWeight: 900
                      }}
                    >
                      {creator.name[0]}

                      {creator.verified && (
                        <span
                          className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center text-xs"
                          style={{ width: 20, height: 20, background: '#0b84ff', border: '2px solid #080808' }}
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="font-black text-sm truncate">@{creator.name}</p>
                    <p className="text-white/40 text-xs mt-1 truncate">{creator.role}</p>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-sm tracking-widest">
            {query ? 'SEARCH RESULTS' : 'POPULAR CLIPS'}
          </p>

          <button onClick={() => navigate('/record')} className="text-cyan-300 text-xs font-black">
            AI CREATE
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((clip, index) => (
            <button
              key={clip.id}
              onClick={() => navigate('/')}
              className="rounded-3xl overflow-hidden relative active:scale-95 text-left"
              style={{
                aspectRatio: '9/16',
                background:
                  index % 4 === 0
                    ? 'linear-gradient(160deg,#050505,#24002d,#ff0055)'
                    : index % 4 === 1
                    ? 'linear-gradient(160deg,#020202,#002833,#00eaff)'
                    : index % 4 === 2
                    ? 'linear-gradient(160deg,#030303,#251500,#ffb000)'
                    : 'linear-gradient(160deg,#020202,#062416,#00ff88)',
                border: '1px solid rgba(255,255,255,.08)'
              }}
            >
              <div className="absolute top-3 left-3 rounded-full flex items-center justify-center"
                style={{ width: 34, height: 34, background: 'rgba(0,0,0,.45)', border: '1px solid rgba(255,255,255,.15)' }}>
                {clip.username[0]}
              </div>

              <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-black"
                style={{ background: 'rgba(0,0,0,.5)' }}>
                {clip.duration}s
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 58,
                    height: 58,
                    background: 'rgba(255,255,255,.15)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <Play size={26} fill="#fff" />
                </div>
              </div>

              {index === 0 && (
                <div className="absolute top-14 left-3 flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255,0,85,.18)', border: '1px solid rgba(255,0,85,.35)' }}>
                  <Flame size={12} color="#ff4d6d" />
                  <span className="text-xs font-black">HOT</span>
                </div>
              )}

              {index === 1 && (
                <div className="absolute top-14 left-3 flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255,215,0,.15)', border: '1px solid rgba(255,215,0,.3)' }}>
                  <Crown size={12} color="#ffd700" />
                  <span className="text-xs font-black">PRO</span>
                </div>
              )}

              <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{ background: 'linear-gradient(transparent,rgba(0,0,0,.95))' }}
              >
                <p className="font-black text-sm mb-1 truncate">@{clip.username}</p>
                <p className="text-white/65 text-xs line-clamp-2 mb-2">{clip.caption}</p>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">♥ {fmt(clip.likes)}</span>
                  <span className="text-cyan-300 text-xs font-black">
                    <Hash size={10} className="inline" /> {clip.tags[0]}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
