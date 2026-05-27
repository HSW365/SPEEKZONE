import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { CATEGORIES } from '../utils/plans';

const SHOWS = [
  { id: '1', title: 'Respect Da Game', host: 'HOODSTAR365', category: 'Music', eps: 24, plays: 48200 },
  { id: '2', title: 'Creator Mindset', host: 'CreatorKing', category: 'Business', eps: 18, plays: 23100 },
  { id: '3', title: 'Money Moves', host: 'EntrepreneurTV', category: 'Business', eps: 41, plays: 91200 },
  { id: '4', title: 'The Real Talk', host: 'Ali Torres', category: 'Society & Culture', eps: 12, plays: 14300 },
  { id: '5', title: 'Tech & Grind', host: 'DevKing', category: 'Technology', eps: 9, plays: 7800 },
  { id: '6', title: 'Health Reset', host: 'WellnessCoach', category: 'Health & Fitness', eps: 33, plays: 55600 },
];

export default function Discover() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const cats = ['All', ...CATEGORIES.slice(0, 6)];

  const filtered = SHOWS.filter(s => {
    const matchQ = !query || s.title.toLowerCase().includes(query.toLowerCase()) || s.host.toLowerCase().includes(query.toLowerCase());
    const matchC = activeCategory === 'All' || s.category === activeCategory;
    return matchQ && matchC;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="pt-safe flex-shrink-0 px-4 pb-2" style={{ background: '#0a1628' }}>
        <h1 className="py-3" style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 26, color: '#9aa3b2' }}>
          Discover
        </h1>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} color="#5a6478" className="absolute left-3 top-3.5" />
          <input
            type="search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search shows or creators"
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {cats.map(c => (
            <button
              key={c} onClick={() => setActiveCategory(c)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                fontFamily: 'Barlow Condensed', letterSpacing: '0.06em', textTransform: 'uppercase',
                background: activeCategory === c ? '#1976d2' : 'rgba(255,255,255,0.07)',
                color: activeCategory === c ? '#fff' : '#9aa3b2',
                border: '1px solid ' + (activeCategory === c ? '#2196f3' : 'rgba(255,255,255,0.1)'),
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 scroll-y px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16" style={{ color: '#5a6478' }}>
            <Mic size={40} style={{ marginBottom: 12, color: '#2d3548' }} />
            <p style={{ fontFamily: 'Barlow Condensed', fontSize: 18 }}>No shows found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-3">
            {filtered.map(s => (
              <div
                key={s.id}
                className="rounded-2xl p-3 active:scale-95 transition-transform cursor-pointer"
                style={{ background: 'linear-gradient(135deg,rgba(20,40,72,0.95),rgba(10,22,40,0.95))', border: '1px solid rgba(25,118,210,0.2)' }}
                onClick={() => navigate(`/podcast/${s.id}`)}
              >
                <div
                  className="rounded-xl flex items-center justify-center mb-3"
                  style={{ width: '100%', aspectRatio: '1', background: 'linear-gradient(135deg,#1565c0,#0d1f3c)' }}
                >
                  <Mic size={28} color="#42a5f5" />
                </div>
                <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 15, marginBottom: 2, lineHeight: 1.2 }}>
                  {s.title}
                </h3>
                <p style={{ color: '#42a5f5', fontSize: 11, fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {s.host}
                </p>
                <div className="flex justify-between">
                  <span style={{ color: '#5a6478', fontSize: 11 }}>{s.eps} eps</span>
                  <span style={{ color: '#5a6478', fontSize: 11 }}>{(s.plays / 1000).toFixed(1)}k plays</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
