import React, { useState } from 'react';
import { Search, TrendingUp, Mic } from 'lucide-react';
import { MOCK_CLIPS, TRENDING_TAGS } from '../utils/data';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['For You','Music','Business','Motivation','Tech','Comedy','Sports','News'];

export default function Discover() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('For You');
  const navigate = useNavigate();

  const filtered = MOCK_CLIPS.filter(c =>
    !query || c.username.toLowerCase().includes(query.toLowerCase()) ||
    c.caption.toLowerCase().includes(query.toLowerCase())
  );

  const fmt = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      {/* Header */}
      <div className="pt-safe flex-shrink-0 px-4 pb-3" style={{ background: '#000' }}>
        <h1 className="py-3" style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#fff' }}>Discover</h1>
        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} color="#555" className="absolute left-4 top-3.5" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search creators or clips"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white"
            style={{ background: '#111', border: '1px solid #222' }} />
        </div>
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                fontFamily: 'Barlow Condensed', fontSize: 14, letterSpacing: '0.04em',
                background: cat === c ? '#2196f3' : '#111',
                color: cat === c ? '#fff' : '#888',
                border: `1px solid ${cat === c ? '#2196f3' : '#222'}`,
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Trending tags */}
        {!query && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} color="#2196f3" />
              <span style={{ color: '#fff', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, letterSpacing: '0.06em' }}>TRENDING</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map(t => (
                <button key={t} onClick={() => setQuery(t.slice(1))}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.3)', color: '#2196f3' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Creators row */}
        {!query && (
          <div className="mb-5">
            <p style={{ color: '#fff', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, letterSpacing: '0.06em', marginBottom: 12 }}>TOP CREATORS</p>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {['HOODSTAR365','CreatorKing','EntrepreneurTV','AliTorres','DevKing'].map((name, i) => (
                <div key={name} className="flex flex-col items-center flex-shrink-0 active:opacity-70">
                  <div className="rounded-full flex items-center justify-center mb-2 relative"
                    style={{ width: 64, height: 64, background: `linear-gradient(135deg,#1565c0,#2196f3)`, border: '2px solid #2196f3', fontSize: 22, fontWeight: 900 }}>
                    {name[0]}
                    {i < 2 && (
                      <div className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
                        style={{ width: 18, height: 18, background: '#2196f3', fontSize: 10 }}>✓</div>
                    )}
                  </div>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', maxWidth: 64 }}
                    className="truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clips grid */}
        <p style={{ color: '#fff', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, letterSpacing: '0.06em', marginBottom: 12 }}>
          {query ? 'RESULTS' : 'POPULAR CLIPS'}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(clip => (
            <div key={clip.id}
              className="rounded-2xl overflow-hidden relative active:scale-95 transition-transform cursor-pointer"
              style={{ aspectRatio: '9/16', background: `radial-gradient(ellipse at 50% 20%, rgba(33,150,243,0.3) 0%, #0a0f1a 70%)`, border: '1px solid #1a2a3a' }}>
              {/* Waveform preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-0.5">
                  {clip.waveform.slice(0,12).map((h, i) => (
                    <div key={i} style={{ width: 3, borderRadius: 1.5, height: `${h * 40 + 4}px`, background: 'rgba(33,150,243,0.6)' }} />
                  ))}
                </div>
              </div>
              {/* Avatar */}
              <div className="absolute top-3 left-3 rounded-full flex items-center justify-center"
                style={{ width: 32, height: 32, background: '#2196f3', fontSize: 14, fontWeight: 900 }}>
                {clip.username[0]}
              </div>
              {/* Duration */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                {clip.duration}s
              </div>
              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, marginBottom: 2 }}>@{clip.username}</p>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#aaa', fontSize: 11 }}>♥ {fmt(clip.likes)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
