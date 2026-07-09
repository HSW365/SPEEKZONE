import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../utils/data';
import { purchasePlan, restorePurchases } from '../utils/purchases';
import { useToast } from '../components/Toast';
import VerifiedBadge from '../components/VerifiedBadge';
import { Check, ChevronLeft } from 'lucide-react';

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [success, setSuccess] = useState('');

  const handlePurchase = async (planId: string, appleProductId: string) => {
    setLoading(planId);
    try {
      const newPlan = await purchasePlan(appleProductId);
      updateUser({ plan: newPlan });
      setSuccess(newPlan === 'verified' ? "You're verified!" : 'Updated!');
      setTimeout(() => { setSuccess(''); navigate(-1); }, 2000);
    } catch (err: any) {
      // RevenueCat/StoreKit reports user-initiated cancellation on this flag —
      // don't show an error toast for that, it's not a failure.
      if (!err?.userCancelled) {
        toast(err?.message || 'Purchase failed. Please try again.');
      }
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const restoredPlan = await restorePurchases();
      updateUser({ plan: restoredPlan });
      toast(restoredPlan === 'free' ? 'No active purchases found' : 'Verified plan restored');
    } catch (err: any) {
      toast(err?.message || 'Could not restore purchases');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#000' }}>
      <div className="pt-safe flex-shrink-0 px-5 pb-3" style={{ borderBottom: '1px solid #111' }}>
        <div className="flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="active:opacity-60">
            <ChevronLeft size={24} color="#888" />
          </button>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: '#fff' }}>
            Get Verified
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
          SpeekZone is free — always. Get verified to stand out and unlock creator tools.
        </p>

        {/* Free tier — the whole app, no paywall */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 24, color: '#555' }}>FREE</h2>
              <p style={{ color: '#333', fontSize: 14 }}>$0 / month, forever</p>
            </div>
            {user?.plan === 'free' && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}>
                <Check size={12} color="#00e676" />
                <span style={{ color: '#00e676', fontSize: 11, fontWeight: 700 }}>CURRENT</span>
              </div>
            )}
          </div>
          {['Post clips & host live voice rooms','Follow creators & join rooms','Leave comments','Send gifts'].map(f => (
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
              style={{ background: '#0a0a0a', border: `1.5px solid ${plan.color}` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <VerifiedBadge size={22} />
                    <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#eee', lineHeight: 1 }}>{plan.name}</h2>
                  </div>
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
                onClick={() => handlePurchase(plan.id, plan.appleProductId)}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-opacity active:opacity-80"
                style={{
                  fontFamily: 'Barlow Condensed', fontSize: 17, letterSpacing: '0.06em',
                  background: active ? '#1a1a1a' : `linear-gradient(135deg, ${plan.color}bb, ${plan.color})`,
                  boxShadow: active ? 'none' : `0 4px 20px ${plan.color}40`,
                  opacity: active ? 0.5 : 1,
                }}>
                {isLoading ? 'Processing...' : active ? 'Current Plan' : `Get Verified — $${plan.price}/mo`}
              </button>
            </div>
          );
        })}

        <div className="pb-6 px-2 text-center" style={{ color: '#333', fontSize: 11, lineHeight: 1.6 }}>
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="mb-3"
            style={{ color: '#2196f3', fontSize: 13, fontWeight: 700 }}
          >
            {restoring ? 'Restoring…' : 'Restore Purchases'}
          </button>
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
