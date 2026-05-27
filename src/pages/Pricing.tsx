import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../utils/plans';
import { Check, ChevronLeft, X } from 'lucide-react';

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  // Apple IAP: in production, call Capacitor In-App Purchase plugin here
  // For now, simulates the purchase flow
  const handlePurchase = async (planId: string, productId: string, price: number) => {
    setLoading(planId);
    try {
      // TODO: Replace with Capacitor IAP plugin call:
      // import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
      // const product = InAppPurchase2.get(productId);
      // await InAppPurchase2.order(productId);
      
      // Simulate Apple purchase flow delay
      await new Promise(r => setTimeout(r, 1500));
      updateUser({ plan: planId as 'basic' | 'pro' | 'elite' });
      setSuccess(`${planId.charAt(0).toUpperCase() + planId.slice(1)} plan activated!`);
      setTimeout(() => { setSuccess(''); navigate(-1); }, 2000);
    } catch (err) {
      console.error('IAP error:', err);
    } finally {
      setLoading(null);
    }
  };

  const planColors: Record<string, string> = {
    basic: '#2196f3',
    pro:   '#ff5252',
    elite: '#00e676',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-safe flex-shrink-0 px-4 pb-2" style={{ background: 'rgba(13,31,60,0.98)', borderBottom: '1px solid rgba(25,118,210,0.2)' }}>
        <div className="flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="active:opacity-60">
            <ChevronLeft size={24} color="#9aa3b2" />
          </button>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22 }}>
            Pick Your Plan
          </h1>
        </div>
      </div>

      <div className="flex-1 scroll-y px-4 py-4">
        {success && (
          <div className="mb-4 p-3 rounded-xl text-center" style={{ background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)', color: '#00e676', fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 700 }}>
            {success}
          </div>
        )}

        <p className="text-center mb-6" style={{ color: '#9aa3b2', fontSize: 14 }}>
          Unlock the full power of SpeekZone. Cancel anytime.
        </p>

        {/* Current plan badge */}
        {user?.plan !== 'free' && (
          <div className="mb-4 p-3 rounded-xl text-center" style={{ background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.25)' }}>
            <span style={{ color: '#42a5f5', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15 }}>
              Current plan: {user?.plan?.toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4 pb-6">
          {PLANS.map(plan => {
            const active = user?.plan === plan.id;
            const isLoading = loading === plan.id;
            const color = planColors[plan.id];

            return (
              <div
                key={plan.id}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg,rgba(20,40,72,0.95),rgba(10,22,40,0.95))',
                  border: `${plan.popular ? 2 : 1}px solid ${plan.popular ? color : 'rgba(25,118,210,0.25)'}`,
                  transform: plan.popular ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-xs font-bold"
                    style={{ fontFamily: 'Barlow Condensed', letterSpacing: '0.08em', background: color, color: '#fff', borderBottomLeftRadius: 12 }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 26, color: '#9aa3b2', lineHeight: 1 }}>
                      {plan.name}
                    </h2>
                    <div className="flex items-end gap-1 mt-1">
                      <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 38, color, lineHeight: 1 }}>
                        ${plan.price}
                      </span>
                      <span style={{ color: '#5a6478', fontSize: 13, paddingBottom: 5 }}>/mo</span>
                    </div>
                  </div>
                  {active && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)' }}>
                      <Check size={12} color="#00e676" />
                      <span style={{ color: '#00e676', fontSize: 11, fontFamily: 'Barlow Condensed', fontWeight: 700 }}>ACTIVE</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check size={14} color="#00e676" className="flex-shrink-0 mt-0.5" />
                      <span style={{ color: '#9aa3b2', fontSize: 13, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={active || isLoading}
                  onClick={() => handlePurchase(plan.id, plan.appleProductId, plan.price)}
                  className="w-full py-3.5 rounded-xl font-bold text-white transition-opacity active:opacity-80"
                  style={{
                    fontFamily: 'Barlow Condensed', fontSize: 17, letterSpacing: '0.06em',
                    background: active ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${color}bb, ${color})`,
                    boxShadow: active ? 'none' : `0 4px 20px ${color}40`,
                    opacity: active ? 0.6 : 1,
                  }}
                >
                  {isLoading ? 'Processing...' : active ? 'Current Plan' : `Subscribe — $${plan.price}/mo`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Apple IAP legal text — REQUIRED by App Store */}
        <div className="pb-6 px-2" style={{ color: '#5a6478', fontSize: 11, lineHeight: 1.6, textAlign: 'center' }}>
          <p className="mb-2">
            Payment will be charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. Manage or cancel your subscription in your Apple ID Account Settings.
          </p>
          <p>
            <button onClick={() => {}} style={{ color: '#2196f3' }}>Privacy Policy</button>
            {' · '}
            <button onClick={() => {}} style={{ color: '#2196f3' }}>Terms of Use</button>
          </p>
        </div>
      </div>
    </div>
  );
}
