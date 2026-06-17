import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Mic, Heart, Share2 } from 'lucide-react';
import { useToast, shareOrCopy } from '../components/Toast';

const MOCK_DETAIL = {
  id: '1',
  title: 'Respect Da Game',
  host: 'HOODSTAR365',
  description: 'Real conversations about music, entrepreneurship, ownership, and the indie grind. Hosted by Ali Torres.',
  episodes: [
    { id: 'e1', title: 'Ownership in the Indie Music Era', duration: 2538, plays: 4820, publishedAt: '2026-05-01', audioUrl: '' },
    { id: 'e2', title: 'Building Your Brand From Nothing', duration: 1865, plays: 3210, publishedAt: '2026-04-22', audioUrl: '' },
    { id: 'e3', title: 'How to Monetize Your Audience', duration: 3120, plays: 5540, publishedAt: '2026-04-10', audioUrl: '' },
  ],
};

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function PodcastDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pod = MOCK_DETAIL;
  const toast = useToast();

  const [playingEp, setPlayingEp] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (epId: string) => {
    if (playingEp === epId) {
      audioRef.current?.pause();
      setPlayingEp(null);
    } else {
      setPlayingEp(epId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-safe flex-shrink-0 px-4" style={{ background: 'rgba(13,31,60,0.98)', borderBottom: '1px solid rgba(25,118,210,0.2)' }}>
        <div className="flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="active:opacity-60">
            <ChevronLeft size={24} color="#9aa3b2" />
          </button>
          <h1 className="flex-1 truncate" style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 20 }}>
            {pod.title}
          </h1>
          <button onClick={() => setLiked(!liked)} className="active:scale-90 transition-transform">
            <Heart size={22} color={liked ? '#ff5252' : '#5a6478'} fill={liked ? '#ff5252' : 'none'} />
          </button>
          <button
            onClick={() => shareOrCopy({ title: pod.title, text: `${pod.title} — ${pod.host} on SpeekZone`, url: 'https://speekzone.com' }, toast)}
            className="active:opacity-60"
          >
            <Share2 size={20} color="#5a6478" />
          </button>
        </div>
      </div>

      <div className="flex-1 scroll-y px-4 py-4">
        {/* Cover + info */}
        <div className="flex gap-4 mb-5 items-start">
          <div
            className="rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: 100, height: 100, background: 'linear-gradient(135deg,#1565c0,#0d1f3c)', border: '1px solid rgba(33,150,243,0.3)', boxShadow: '0 8px 24px rgba(21,101,192,0.3)' }}
          >
            <Mic size={36} color="#42a5f5" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, lineHeight: 1.1, marginBottom: 4 }}>
              {pod.title}
            </h2>
            <p style={{ color: '#42a5f5', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
              {pod.host}
            </p>
            <p style={{ color: '#9aa3b2', fontSize: 13, lineHeight: 1.5 }}>{pod.description}</p>
          </div>
        </div>

        {/* Episodes */}
        <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#42a5f5', marginBottom: 12 }}>
          Episodes
        </p>

        {pod.episodes.map((ep, i) => {
          const isPlaying = playingEp === ep.id;
          return (
            <div
              key={ep.id}
              className="rounded-2xl p-4 mb-3"
              style={{ background: 'rgba(20,40,72,0.7)', border: `1px solid ${isPlaying ? 'rgba(33,150,243,0.5)' : 'rgba(25,118,210,0.15)'}` }}
            >
              <div className="flex items-start gap-3">
                <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, color: '#2d3548', minWidth: 28, lineHeight: 1 }}>
                  {String(pod.episodes.length - i).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 15, marginBottom: 4, lineHeight: 1.2 }}>{ep.title}</h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#5a6478' }}>
                    <span>{new Date(ep.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{fmt(ep.duration)}</span>
                    <span>{ep.plays.toLocaleString()} plays</span>
                  </div>
                </div>
              </div>

              {/* Player bar */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => togglePlay(ep.id)}
                  className="flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
                  style={{ width: 40, height: 40, background: isPlaying ? '#ff5252' : 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: isPlaying ? '0 0 12px rgba(255,82,82,0.4)' : '0 0 12px rgba(25,118,210,0.4)' }}
                >
                  {isPlaying ? <Pause size={18} fill="#fff" color="#fff" /> : <Play size={18} fill="#fff" color="#fff" />}
                </button>
                {/* Progress bar */}
                <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: isPlaying ? '38%' : '0%', background: 'linear-gradient(90deg,#1565c0,#2196f3)', transition: 'width 0.3s' }}
                  />
                </div>
                <span style={{ color: '#5a6478', fontSize: 12, flexShrink: 0 }}>{fmt(ep.duration)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
