import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Video,
  Wand2,
  Hash,
  Captions,
  Lightbulb,
  Check,
  Sparkles,
  Upload,
  RefreshCcw
} from 'lucide-react';

const AI_IDEAS = [
  {
    niche: 'Music Artist',
    hook: 'Stop scrolling — this is the sound they tried to ignore.',
    caption: 'New heat from SpeekZone. Tap in, follow, and share if this speaks to you.',
    tags: '#music #indieartist #speekzone #newmusic #viral'
  },
  {
    niche: 'Motivation',
    hook: 'You are not too late. You are just getting started.',
    caption: 'Real talk for every creator building from the bottom.',
    tags: '#motivation #mindset #creator #grind #speekzone'
  },
  {
    niche: 'Business',
    hook: 'This is how creators turn attention into income.',
    caption: 'Build your audience. Own your content. Monetize your voice.',
    tags: '#business #creatorbusiness #money #ai #speekzone'
  },
  {
    niche: 'Athlete',
    hook: 'Everybody sees the highlights. Nobody sees the work.',
    caption: 'For athletes chasing greatness one rep at a time.',
    tags: '#athlete #training #basketball #sports #speekzone'
  }
];

export default function Record() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<'studio' | 'preview' | 'post'>('studio');
  const [selectedIdea, setSelectedIdea] = useState(AI_IDEAS[0]);
  const [caption, setCaption] = useState(AI_IDEAS[0].caption);
  const [tags, setTags] = useState(AI_IDEAS[0].tags);
  const [hook, setHook] = useState(AI_IDEAS[0].hook);
  const [posted, setPosted] = useState(false);

  const generateIdea = () => {
    const next = AI_IDEAS[Math.floor(Math.random() * AI_IDEAS.length)];
    setSelectedIdea(next);
    setHook(next.hook);
    setCaption(next.caption);
    setTags(next.tags);
  };

  const postClip = () => {
    setPosted(true);
    setTimeout(() => navigate('/'), 1400);
  };

  if (posted) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black text-white px-6">
        <div
          className="rounded-full flex items-center justify-center mb-5"
          style={{
            width: 92,
            height: 92,
            background: 'rgba(0,230,118,.15)',
            border: '2px solid #00e676',
            boxShadow: '0 0 45px rgba(0,230,118,.3)'
          }}
        >
          <Check size={42} color="#00e676" />
        </div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 34 }}>
          POSTED
        </h1>
        <p className="text-white/50 text-sm mt-2 text-center">
          Your AI-powered SpeekZone clip is ready.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white flex flex-col pt-safe">
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => navigate(-1)} className="active:opacity-60">
          <X size={25} />
        </button>

        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 23 }}>
          AI CREATE
        </h1>

        <button onClick={generateIdea} className="active:scale-95">
          <Sparkles size={24} color="#00eaff" />
        </button>
      </header>

      {mode === 'studio' && (
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <section
            className="rounded-3xl p-5 mb-5"
            style={{
              background:
                'linear-gradient(145deg, rgba(0,234,255,.18), rgba(255,0,85,.16), rgba(255,255,255,.04))',
              border: '1px solid rgba(255,255,255,.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,.5)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="rounded-2xl flex items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  background: 'rgba(255,255,255,.12)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Wand2 color="#00eaff" />
              </div>

              <div>
                <p className="text-xs text-white/50 font-bold tracking-widest">SPEEKZONE AI</p>
                <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28 }}>
                  Creator Studio
                </h2>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              Generate hooks, captions, hashtags, and post ideas before you upload your video.
            </p>

            <button
              onClick={generateIdea}
              className="w-full mt-5 py-4 rounded-2xl font-black active:scale-95"
              style={{
                background: 'linear-gradient(90deg,#00eaff,#ff0055)',
                fontFamily: 'Barlow Condensed',
                fontSize: 20,
                letterSpacing: '.04em'
              }}
            >
              GENERATE AI IDEA
            </button>
          </section>

          <section className="grid grid-cols-2 gap-3 mb-5">
            {AI_IDEAS.map((idea) => (
              <button
                key={idea.niche}
                onClick={() => {
                  setSelectedIdea(idea);
                  setHook(idea.hook);
                  setCaption(idea.caption);
                  setTags(idea.tags);
                }}
                className="rounded-2xl p-4 text-left active:scale-95"
                style={{
                  background: selectedIdea.niche === idea.niche ? '#111827' : '#090909',
                  border:
                    selectedIdea.niche === idea.niche
                      ? '1px solid #00eaff'
                      : '1px solid rgba(255,255,255,.08)'
                }}
              >
                <Lightbulb size={20} color="#ffd700" />
                <p className="mt-3 font-black text-sm">{idea.niche}</p>
                <p className="text-white/45 text-xs mt-1">AI content angle</p>
              </button>
            ))}
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl p-4" style={{ background: '#0b0b0b', border: '1px solid #1d1d1d' }}>
              <div className="flex items-center gap-2 mb-3">
                <Video size={18} color="#ff0055" />
                <label className="text-xs font-black tracking-widest text-white/45">VIDEO HOOK</label>
              </div>
              <textarea
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full bg-transparent text-white resize-none text-lg font-bold leading-tight"
                rows={3}
              />
            </div>

            <div className="rounded-2xl p-4" style={{ background: '#0b0b0b', border: '1px solid #1d1d1d' }}>
              <div className="flex items-center gap-2 mb-3">
                <Captions size={18} color="#00eaff" />
                <label className="text-xs font-black tracking-widest text-white/45">AI CAPTION</label>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-transparent text-white resize-none text-sm leading-relaxed"
                rows={4}
              />
            </div>

            <div className="rounded-2xl p-4" style={{ background: '#0b0b0b', border: '1px solid #1d1d1d' }}>
              <div className="flex items-center gap-2 mb-3">
                <Hash size={18} color="#7cffb2" />
                <label className="text-xs font-black tracking-widest text-white/45">AI HASHTAGS</label>
              </div>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-transparent text-white text-sm"
              />
            </div>
          </section>

          <button
            onClick={() => setMode('preview')}
            className="w-full mt-6 py-4 rounded-2xl font-black active:scale-95"
            style={{
              background: 'white',
              color: 'black',
              fontFamily: 'Barlow Condensed',
              fontSize: 20
            }}
          >
            PREVIEW POST
          </button>
        </div>
      )}

      {mode === 'preview' && (
        <div className="flex-1 flex flex-col px-5 pb-6">
          <div
            className="flex-1 rounded-3xl overflow-hidden relative mb-5"
            style={{
              background:
                'radial-gradient(circle at 25% 20%, rgba(0,234,255,.4), transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,0,85,.35), transparent 28%), linear-gradient(160deg,#050505,#170015)',
              border: '1px solid rgba(255,255,255,.12)'
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <Upload size={46} color="#fff" />
              <h2
                className="mt-4"
                style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 38, lineHeight: .9 }}
              >
                VIDEO PREVIEW
              </h2>
              <p className="text-white/60 text-sm mt-3">
                Add real camera/video upload later. This is the AI post preview.
              </p>
            </div>

            <div className="absolute left-4 right-20 bottom-5">
              <p className="text-lg font-black mb-2">@HOODSTAR365</p>
              <p className="text-sm leading-snug mb-2">{caption}</p>
              <p className="text-cyan-300 text-sm font-bold">{tags}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('studio')}
              className="py-4 rounded-2xl font-black flex items-center justify-center gap-2"
              style={{ background: '#111', border: '1px solid #2a2a2a' }}
            >
              <RefreshCcw size={18} /> EDIT
            </button>

            <button
              onClick={postClip}
              className="py-4 rounded-2xl font-black"
              style={{
                background: 'linear-gradient(90deg,#00eaff,#ff0055)',
                fontFamily: 'Barlow Condensed',
                fontSize: 20
              }}
            >
              POST
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
