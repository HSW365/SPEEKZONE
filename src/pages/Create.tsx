import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Upload, Mic } from 'lucide-react';
import { CATEGORIES } from '../utils/plans';

export default function Create() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', explicit: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (user?.plan === 'free') {
    return (
      <div className="flex flex-col h-full">
        <div className="pt-safe flex-shrink-0 px-4 pb-2" style={{ background: 'rgba(13,31,60,0.98)', borderBottom: '1px solid rgba(25,118,210,0.2)' }}>
          <h1 className="py-3" style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22 }}>Create</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="rounded-2xl flex items-center justify-center mb-5" style={{ width: 80, height: 80, background: 'rgba(25,118,210,0.15)', border: '1px solid rgba(25,118,210,0.3)' }}>
            <Mic size={36} color="#2196f3" />
          </div>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 26, marginBottom: 10 }}>Upgrade to Create</h2>
          <p style={{ color: '#9aa3b2', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            A paid plan is required to host and publish podcasts on SpeekZone. Plans start at just $8/month.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="px-8 py-3.5 rounded-xl font-bold text-white"
            style={{ fontFamily: 'Barlow Condensed', fontSize: 18, letterSpacing: '0.06em', background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 4px 20px rgba(25,118,210,0.4)' }}
          >
            View Plans from $8/mo
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); navigate('/'); }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="rounded-full flex items-center justify-center mb-4" style={{ width: 72, height: 72, background: 'rgba(0,230,118,0.15)', border: '2px solid #00e676' }}>
          <Mic size={32} color="#00e676" />
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#00e676' }}>Show Created!</h2>
        <p style={{ color: '#9aa3b2', marginTop: 8 }}>Redirecting to your feed...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pt-safe flex-shrink-0 px-4" style={{ background: 'rgba(13,31,60,0.98)', borderBottom: '1px solid rgba(25,118,210,0.2)' }}>
        <div className="flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="active:opacity-60">
            <ChevronLeft size={24} color="#9aa3b2" />
          </button>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22 }}>New Podcast</h1>
        </div>
      </div>
      <div className="flex-1 scroll-y px-4 py-5">
        <div
          className="rounded-2xl flex flex-col items-center justify-center mb-5 active:opacity-70"
          style={{ height: 140, border: '2px dashed rgba(33,150,243,0.4)', background: 'rgba(21,101,192,0.06)', cursor: 'pointer' }}
        >
          <Upload size={28} color="#2196f3" style={{ marginBottom: 8 }} />
          <p style={{ color: '#2196f3', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16 }}>Upload Cover Art</p>
          <p style={{ color: '#5a6478', fontSize: 12, marginTop: 2 }}>JPG or PNG, 1:1 ratio</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-widest uppercase" style={{ color: '#9aa3b2' }}>Show Title *</label>
            <input
              type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Your podcast name"
              className="w-full px-4 py-3 rounded-xl text-base text-white placeholder-gray-600"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-widest uppercase" style={{ color: '#9aa3b2' }}>Description *</label>
            <textarea
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What is your show about?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-base text-white placeholder-gray-600 resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-widest uppercase" style={{ color: '#9aa3b2' }}>Category</label>
            <select
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-base text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer py-2">
            <input
              type="checkbox" checked={form.explicit}
              onChange={e => setForm(f => ({ ...f, explicit: e.target.checked }))}
              className="w-5 h-5 rounded"
            />
            <span style={{ color: '#9aa3b2', fontSize: 14 }}>This podcast contains explicit content</span>
          </label>
          <button
            type="submit" disabled={loading || !form.title || !form.description}
            className="w-full py-4 rounded-xl font-bold text-white mt-2 transition-opacity"
            style={{ fontFamily: 'Barlow Condensed', fontSize: 18, letterSpacing: '0.06em', background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 4px 20px rgba(25,118,210,0.4)', opacity: (!form.title || !form.description) ? 0.5 : 1 }}
          >
            {loading ? 'Creating Show...' : 'CREATE SHOW'}
          </button>
        </form>
      </div>
    </div>
  );
}