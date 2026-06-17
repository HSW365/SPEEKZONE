import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../utils/data';
import { Check, ChevronLeft } from 'lucide-react';

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    await new Promise(r => setTimeout(r, 1500));
    updateUser({ plan: planId as 'creator' | 'pro' });
    setSuccess(`${planId.charAt(0).toUpperCase() + planId.slice(1)} activated!`);
    setTimeout(() => { setSuccess(''); navigate(-1); }, 2000);
    setLoading(null);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      <div className="pt-safe flex-shrink-0 px-5 pb-3" style={{ borderBottom: '1px solid #111' }}>
        <div className="flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="active:opacity-60">
            <ChevronLeft size={24} color="#888" />
          </button>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: '#fff' }}>
            Choose Your Plan
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {success && (
          <div className="mb-4 p-3 rounded-xl text-center"
            style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', color: '#00e676', fontFamily: 'Barlow Condensed', fontSize: 18 }}>
            {success}
          </div>
        )}

        <p className="text-center mb-6" style={{ color: '#555', fontSize: 14 }}>
          Grow your audience. Monetize your voice. Cancel anytime.
        </p>

        {/* Free tier */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: '#555' }}>FREE</h2>
              <p style={{ color: '#333', fontSize: 14 }}>$0 / month</p>
            </div>
            {user?.plan === 'free' && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}>
                <Check size={12} color="#00e676" />
                <span style={{ color: '#00e676', fontSize: 11, fontWeight: 700 }}>CURRENT</span>
              </div>
            )}
          </div>
          {['Browse & listen to clips','Follow creators','Leave comments','Send gifts'].map(f => (
            <div key={f} className="flex items-center gap-2 mb-2">
              <Check size={14} color="#333" />
              <span style={{ color: '#444', fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>

        {PLANS.map(plan => {
          const active = user?.plan === plan.id;
          const isLoading = loading === plan.id;
          return (
            <div key={plan.id} className="rounded-2xl p-5 mb-4 relative overflow-hidden"
              style={{
                background: '#0a0a0a',
                border: `${(plan as any).popular ? 2 : 1}px solid ${(plan as any).popular ? plan.color : '#1a1a1a'}`,
                transform: (plan as any).popular ? 'scale(1.01)' : 'scale(1)',
              }}>
              {(plan as any).popular && (
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold"
                  style={{ background: plan.color, color: '#fff', borderBottomLeftRadius: 12, fontFamily: 'Barlow Condensed', letterSpacing: '0.06em' }}>
                  MOST POPULAR
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#888', lineHeight: 1 }}>{plan.name}</h2>
                  <div className="flex items-end gap-1 mt-1">
                    <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 40, color: plan.color, lineHeight: 1 }}>${plan.price}</span>
                    <span style={{ color: '#444', fontSize: 13, paddingBottom: 5 }}>/mo</span>
                  </div>
                </div>
                {active && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}>
                    <Check size={12} color="#00e676" />
                    <span style={{ color: '#00e676', fontSize: 11, fontWeight: 700 }}>ACTIVE</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={14} color="#00e676" className="flex-shrink-0 mt-0.5" />
                    <span style={{ color: '#888', fontSize: 13, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                disabled={active || !!isLoading}
                onClick={() => handlePurchase(plan.id)}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-opacity active:opacity-80"
                style={{
                  fontFamily: 'Barlow Condensed', fontSize: 17, letterSpacing: '0.06em',
                  background: active ? '#1a1a1a' : `linear-gradient(135deg, ${plan.color}bb, ${plan.color})`,
                  boxShadow: active ? 'none' : `0 4px 20px ${plan.color}40`,
                  opacity: active ? 0.5 : 1,
                }}>
                {isLoading ? 'Processing...' : active ? 'Current Plan' : `Subscribe — $${plan.price}/mo`}
              </button>
            </div>
          );
        })}

        <div className="pb-6 px-2 text-center" style={{ color: '#333', fontSize: 11, lineHeight: 1.6 }}>
          <p className="mb-2">Payment charged to your Apple ID at confirmation. Subscriptions auto-renew unless cancelled 24 hours before period end.</p>
          <p>
            <a href="https://speekzone.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3' }}>Privacy Policy</a>
            {' · '}
            <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3' }}>Terms of Use</a>
          </p>
        </div>
      </div>
    </div>
  );
}
