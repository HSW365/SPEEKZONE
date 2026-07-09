import React, { useState } from 'react';
import { Flag, UserX, X } from 'lucide-react';
import { REPORT_REASONS, ReportReason, blockUser, submitReport } from '../utils/moderation';
import { useToast } from './Toast';

interface Props {
  open: boolean;
  onClose: () => void;
  /** The username being reported/blocked - always required, this is who the report/block applies to. */
  username: string;
  /** What's being reported: a specific clip or room, or just the user in general. */
  targetType: 'user' | 'clip' | 'room';
  targetId: string;
  onBlocked?: () => void;
}

export default function ReportBlockSheet({ open, onClose, username, targetType, targetId, onBlocked }: Props) {
  const [showReasons, setShowReasons] = useState(false);
  const toast = useToast();

  if (!open) return null;

  const handleReport = (reason: ReportReason) => {
    submitReport(targetType, targetId, reason);
    toast('Report submitted — thanks for helping keep SpeekZone safe');
    setShowReasons(false);
    onClose();
  };

  const handleBlock = () => {
    blockUser(username);
    toast(`@${username} blocked`);
    onBlocked?.();
    onClose();
  };

  return (
    <div
      className="flex items-end justify-center"
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl px-5 pt-4"
        style={{
          background: '#111', paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)',
          maxWidth: 480,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>
            {showReasons ? 'Why are you reporting this?' : `@${username}`}
          </span>
          <button onClick={onClose} style={{ touchAction: 'manipulation' }}>
            <X size={22} color="#888" />
          </button>
        </div>

        {!showReasons ? (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setShowReasons(true)}
              className="flex items-center gap-3 py-3.5"
              style={{ color: '#fff', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              <Flag size={19} color="#ef4444" />
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                Report {targetType === 'room' ? 'this room' : targetType === 'clip' ? 'this clip' : 'user'}
              </span>
            </button>
            <button
              onClick={handleBlock}
              className="flex items-center gap-3 py-3.5"
              style={{
                color: '#fff', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                borderTop: '1px solid #222',
              }}
            >
              <UserX size={19} color="#ef4444" />
              <span style={{ fontSize: 15, fontWeight: 700 }}>Block @{username}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {REPORT_REASONS.map(reason => (
              <button
                key={reason}
                onClick={() => handleReport(reason)}
                className="text-left py-3.5"
                style={{
                  color: '#ddd', fontSize: 14.5, fontWeight: 600,
                  borderTop: '1px solid #222',
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                }}
              >
                {reason}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
