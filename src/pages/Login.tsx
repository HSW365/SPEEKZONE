import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full pt-safe px-6 overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(21,101,192,0.3) 0%, #0a1628 60%)' }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-8">
        <div className="text-center mb-10 fade-up">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-4"
            style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 0 30px rgba(33,150,243,0.35)' }}
          >
            <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, color: '#fff' }}>SZ</span>
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28 }}>
            Speek<span style={{ color: '#2196f3' }}>Zone</span>
          </h1>
          <p style={{ color: '#9aa3b2', fontSize: 14, marginTop: 4 }}>Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm fade-up" style={{ background: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.3)', color: '#ff8a80' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 fade-up-2">
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: '#9aa3b2' }}>Email</label>
            <input
              type="email" autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-base text-white placeholder-gray-600"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: '#9aa3b2' }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl text-base text-white placeholder-gray-600"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5" style={{ color: '#5a6478' }}>
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white mt-2 transition-opacity active:opacity-80"
            style={{ fontFamily: 'Barlow Condensed', fontSize: 18, letterSpacing: '0.06em', background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 4px 20px rgba(25,118,210,0.4)' }}
          >
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center mt-6 fade-up-3" style={{ color: '#9aa3b2', fontSize: 14 }}>
          No account?{' '}
          <button onClick={() => navigate('/register')} style={{ color: '#2196f3', fontWeight: 600 }}>
            Create one free
          </button>
        </p>
      </div>
    </div>
  );
}