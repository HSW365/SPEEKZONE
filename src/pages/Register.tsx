import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Fill in all fields'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be 6+ characters'); return; }
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
    } catch {
      setError('Registration failed. Try again.');
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
        <div className="text-center mb-8 fade-up">
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28 }}>
            Join Speek<span style={{ color: '#2196f3' }}>Zone</span>
          </h1>
          <p style={{ color: '#9aa3b2', fontSize: 14, marginTop: 4 }}>Your voice. Your platform. Free to start.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.3)', color: '#ff8a80' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 fade-up-2">
          {[
            { k: 'name',     label: 'Full Name',        type: 'text',     ph: 'Your name' },
            { k: 'email',    label: 'Email',            type: 'email',    ph: 'you@example.com' },
            { k: 'password', label: 'Password',         type: 'password', ph: 'Min. 6 characters' },
            { k: 'confirm',  label: 'Confirm Password', type: 'password', ph: 'Repeat password' },
          ].map(({ k, label, type, ph }) => (
            <div key={k}>
              <label className="block text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: '#9aa3b2' }}>{label}</label>
              <input
                type={type} placeholder={ph}
                value={form[k as keyof typeof form]}
                onChange={set(k)}
                className="w-full px-4 py-3 rounded-xl text-base text-white placeholder-gray-600"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white mt-2"
            style={{ fontFamily: 'Barlow Condensed', fontSize: 18, letterSpacing: '0.06em', background: 'linear-gradient(135deg,#1565c0,#2196f3)', boxShadow: '0 4px 20px rgba(25,118,210,0.4)' }}
          >
            {loading ? 'Creating...' : 'LAUNCH YOUR SHOW'}
          </button>
        </form>

        <p className="text-center mt-5 fade-up-3" style={{ color: '#9aa3b2', fontSize: 13 }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} style={{ color: '#2196f3', fontWeight: 600 }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}