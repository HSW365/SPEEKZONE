import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mic, MicOff, RotateCcw, Check, ChevronLeft } from 'lucide-react';

const MAX_DURATION = 60;

export default function Record() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup'|'recording'|'preview'|'post'>('setup');
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);

  const startRecording = () => {
    setRecording(true);
    setDuration(0);
    setWaveform([]);
    setStep('recording');
    timerRef.current = setInterval(() => {
      setDuration(d => {
        if (d >= MAX_DURATION) {
          stopRecording();
          return MAX_DURATION;
        }
        setWaveform(w => [...w, Math.random() * 0.8 + 0.2].slice(-40));
        return d + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current!);
    setRecording(false);
    setStep('preview');
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/'), 1800);
  };

  const progress = (duration / MAX_DURATION) * 100;
  const circumference = 2 * Math.PI * 54;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ background: '#000' }}>
        <div className="rounded-full flex items-center justify-center mb-5"
          style={{ width: 80, height: 80, background: 'rgba(0,230,118,0.15)', border: '2px solid #00e676' }}>
          <Check size={36} color="#00e676" />
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#00e676' }}>Posted!</h2>
        <p style={{ color: '#555', marginTop: 8 }}>Your clip is live on SpeekZone</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pt-safe" style={{ background: '#000' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => navigate(-1)} className="active:opacity-60">
          <X size={24} color="#fff" />
        </button>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 20, color: '#fff' }}>
          {step === 'setup' ? 'New Clip' : step === 'recording' ? 'Recording...' : step === 'preview' ? 'Preview' : 'Post'}
        </h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Setup / Recording */}
      {(step === 'setup' || step === 'recording') && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Waveform visualization */}
          <div className="flex items-center justify-center gap-1 mb-10" style={{ height: 80 }}>
            {recording ? (
              waveform.map((h, i) => (
                <div key={i} style={{
                  width: 4, borderRadius: 2,
                  height: `${h * 80}px`,
                  background: '#2196f3',
                  animation: `wave ${0.3 + h * 0.5}s ease-in-out infinite alternate`,
                }} />
              ))
            ) : (
              Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ width: 4, borderRadius: 2, height: '8px', background: '#222' }} />
              ))
            )}
          </div>

          {/* Record button with progress ring */}
          <div className="relative flex items-center justify-center mb-8">
            <svg width={128} height={128} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
              <circle cx={64} cy={64} r={54} fill="none" stroke="#222" strokeWidth={6} />
              {recording && (
                <circle cx={64} cy={64} r={54} fill="none" stroke="#2196f3" strokeWidth={6}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (progress / 100) * circumference}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
              )}
            </svg>
            <button
              onClick={recording ? stopRecording : startRecording}
              className="flex items-center justify-center rounded-full active:scale-95 transition-transform"
              style={{
                width: 96, height: 96,
                background: recording ? '#ff5252' : 'linear-gradient(135deg,#1565c0,#2196f3)',
                boxShadow: recording ? '0 0 30px rgba(255,82,82,0.5)' : '0 0 30px rgba(33,150,243,0.5)',
              }}>
              {recording ? <MicOff size={36} color="#fff" /> : <Mic size={36} color="#fff" />}
            </button>
          </div>

          {/* Timer */}
          <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, color: recording ? '#2196f3' : '#333' }}>
            {duration}s / {MAX_DURATION}s
          </p>

          {/* Tips */}
          {!recording && (
            <div className="mt-8 text-center">
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                Tap the button to start recording{'\n'}
                Up to 60 seconds
              </p>
            </div>
          )}

          {/* Options row */}
          <div className="flex gap-6 mt-8">
            {['15s','30s','60s'].map(t => (
              <button key={t} className="px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: t === '60s' ? '#2196f3' : '#111', color: t === '60s' ? '#fff' : '#555', border: `1px solid ${t === '60s' ? '#2196f3' : '#222'}` }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full rounded-2xl p-6 mb-6" style={{ background: '#111', border: '1px solid #222' }}>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>Your clip · {duration}s</p>
            <div className="flex items-center gap-1 justify-center" style={{ height: 64 }}>
              {waveform.map((h, i) => (
                <div key={i} style={{ width: 4, borderRadius: 2, height: `${h * 64}px`, background: '#2196f3' }} />
              ))}
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <button onClick={() => setStep('setup')}
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              style={{ background: '#111', border: '1px solid #333', color: '#888' }}>
              <RotateCcw size={18} /> Redo
            </button>
            <button onClick={() => setStep('post')}
              className="flex-1 py-4 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#1565c0,#2196f3)' }}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Post */}
      {step === 'post' && (
        <div className="flex-1 overflow-y-auto px-5">
          <form onSubmit={handlePost} className="flex flex-col gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold mb-2 tracking-widest uppercase" style={{ color: '#555' }}>Caption</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="What's this clip about? 🔥"
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-white resize-none"
                style={{ background: '#111', border: '1px solid #222', fontSize: 15 }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 tracking-widest uppercase" style={{ color: '#555' }}>Tags</label>
              <input value={tags} onChange={e => setTags(e.target.value)}
                placeholder="#music #vibes #speekzone"
                className="w-full px-4 py-3 rounded-xl text-white"
                style={{ background: '#111', border: '1px solid #222' }} />
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-bold mb-2 tracking-widest uppercase" style={{ color: '#555' }}>Audience</label>
              <div className="flex gap-3">
                {['Everyone','Followers','Subscribers'].map(a => (
                  <button key={a} type="button"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: a === 'Everyone' ? '#2196f3' : '#111', color: a === 'Everyone' ? '#fff' : '#555', border: `1px solid ${a === 'Everyone' ? '#2196f3' : '#222'}` }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading || !caption}
              className="w-full py-4 rounded-xl font-bold text-white mt-4"
              style={{ fontFamily: 'Barlow Condensed', fontSize: 18, letterSpacing: '0.06em', background: 'linear-gradient(135deg,#1565c0,#2196f3)', opacity: !caption ? 0.5 : 1 }}>
              {loading ? 'Posting...' : 'POST CLIP'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
