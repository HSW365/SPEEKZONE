import React, { useState } from 'react';
import { X, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GIFTS, Gift } from '../utils/data';
import { useToast } from './Toast';

interface Props {
  open: boolean;
  onClose: () => void;
  username: string;
  onSent?: (gift: Gift) => void;
}

export default function GiftSheet({ open, onClose, username, onSent }: Props) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [sending, setSending] = useState<string | null>(null);

  if (!open) return null;

  const handleSend = (gift: Gift) => {
    if (!user) return;
    if (user.coins < gift.coins) {
      toast(`Not enough coins — you need ${gift.coins}, you have ${user.coins}`);
      return;
    }
    setSending(gift.id);
    updateUser({ coins: user.coins - gift.coins });
    toast(`Sent ${gift.emoji} ${gift.name} to @${username}!`);
    onSent?.(gift);
    setTimeout(() => { setSending(null); onClose(); }, 400);
  };

  return (
    <div
      className="flex items-end justify-center"
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl px-5 pt-4"
        style={{ background: '#111', paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 20px)', maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Send a gift</span>
          <button onClick={onClose} style={{ touchAction: 'manipulation' }}>
            <X size={22} color="#888" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <Coins size={14} color="#ffd700" />
          <span style={{ color: '#aaa', fontSize: 13 }}>{user?.coins.toLocaleString()} coins</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {GIFTS.map(gift => {
            const canAfford = (user?.coins ?? 0) >= gift.coins;
            return (
              <button
                key={gift.id}
                onClick={() => handleSend(gift)}
                disabled={sending === gift.id}
                className="rounded-2xl flex flex-col items-center py-4"
                style={{
                  background: '#1a1a1a', opacity: canAfford ? 1 : 0.45,
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: 30 }}>{gift.emoji}</span>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, marginTop: 6 }}>{gift.name}</span>
                <span className="flex items-center gap-1 mt-1" style={{ color: '#ffd700', fontSize: 11, fontWeight: 700 }}>
                  <Coins size={10} /> {gift.coins}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
