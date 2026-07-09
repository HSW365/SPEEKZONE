import React from 'react';

/**
 * SpeekZone's verification checkmark — a tri-color (red/black/green) badge
 * deliberately distinct from the generic blue checks used elsewhere, tied to
 * the HOODSTAR/SpeekZone brand identity rather than a stock "verified" look.
 */
export default function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="szVerifiedGradient" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e11d2e" />
          <stop offset="50%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <path
        d="M12 1.5l2.6 1.7 3.05-.3 1 2.9 2.85 1.3-.55 3.05 1.7 2.6-1.7 2.6.55 3.05-2.85 1.3-1 2.9-3.05-.3L12 24l-2.6-1.7-3.05.3-1-2.9-2.85-1.3.55-3.05L1.35 12l1.7-2.6-.55-3.05 2.85-1.3 1-2.9 3.05.3L12 1.5z"
        fill="url(#szVerifiedGradient)"
      />
      <path
        d="M8.2 12.3l2.3 2.3 5.1-5.4"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
