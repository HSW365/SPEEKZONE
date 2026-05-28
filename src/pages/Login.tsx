import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login'|'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Fill in all fields'); return; }
    setLoading(true); setError('');
    try { await login(form.email, form.password); }
    catch { setError('Invalid credentials.'); }
    finally { setLoading(false); }
  };

  const { register } = useAuth();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Fill in all fields'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try { await register(form.name, form.email, form.password); }
    catch { setError('Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full pt-safe" style={{ background: '#000' }}>
      {/* Logo */}
      <div className="flex flex-col items-center pt-16 pb-10">
        <div style={{
          width: 64, height: 64, borderRadius: 20, marginBottom: 16,
          background: 'linear-gradient(135deg,#1565c0,#2196f3)',
          boxShadow: '0 0 30px rgba(33,150,243,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: '#fff' }}>SZ</span>
        </div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, color: '#fff' }}>
          Speek<span style={{ color: '#2196f3' }}>Zone</span>
        </h1>
        <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>Speak Your World</p>
      </div>

      {/* Tabs */}
      <div className="flex mx-6 mb-6 rounded-xl overflow-hidden" style={{ border: '1px solid #222' }}>
        {(['login','register'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setError(''); }}
            className="flex-1 py-3 font-bold text-sm transition-colors"
            style={{
              fontFamily: 'Barlow Condensed', fontSize: 16, letterSpacing: '0.08em',
              background: tab === t ? '#2196f3' : 'transparent',
              color: tab === t ? '#fff' : '#555',
            }}
          >
            {t === 'login' ? 'SIGN IN' : 'JOIN FREE'}
          </button>
        ))}
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.3)', color: '#ff8a80' }}>
            {error}
          </div>
        )}

        <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
          {tab === 'register' && (
            <input type="text" placeholder="Your name" value={form.name} onChange={set('name')}
              className="w-full px-4 py-4 rounded-xl text-white text-base"
              style={{ background: '#111', border: '1px solid #222' }} />
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')}
            className="w-full px-4 py-4 rounded-xl text-white text-base"
            style={{ background: '#111', border: '1px solid #222' }} />
          <input type="password" placeholder="Password" value={form.password} onChange={set('password')}
            className="w-full px-4 py-4 rounded-xl text-white text-base"
            style={{ background: '#111', border: '1px solid #222' }} />
          {tab === 'register' && (
            <input type="password" placeholder="Confirm password" value={form.confirm} onChange={set('confirm')}
              className="w-full px-4 py-4 rounded-xl text-white text-base"
              style={{ background: '#111', border: '1px solid #222' }} />
          )}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white mt-2"
            style={{ fontFamily: 'Barlow Condensed', fontSize: 18, letterSpacing: '0.06em', background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 4px 20px rgba(33,150,243,0.4)' }}>
            {loading ? '...' : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {tab === 'register' && (
          <p className="text-center mt-4 pb-6" style={{ color: '#444', fontSize: 11 }}>
            By joining you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </div>
    </div>
  );
}
