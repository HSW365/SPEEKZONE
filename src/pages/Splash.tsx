import React from 'react';

export default function Splash() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(21,101,192,0.35) 0%, #0a1628 70%)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-2xl mb-6"
        style={{
          width: 80, height: 80,
          background: 'linear-gradient(135deg, #1565c0, #2196f3)',
          boxShadow: '0 0 40px rgba(33,150,243,0.4)',
          animation: 'pulse-ring 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 28, color: '#fff' }}>
          SZ
        </span>
      </div>
      <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 32, letterSpacing: -0.5 }}>
        Speek<span style={{ color: '#2196f3' }}>Zone</span>
      </h1>
      <p style={{ color: '#5a6478', fontSize: 13, marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        A Global Voice Community
      </p>
    </div>
  );
}