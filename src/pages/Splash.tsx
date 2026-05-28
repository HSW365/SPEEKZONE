import React from 'react';

export default function Splash() {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#000' }}>
      <div
        style={{
          width: 80, height: 80, borderRadius: 24, marginBottom: 20,
          background: 'linear-gradient(135deg,#1565c0,#2196f3)',
          boxShadow: '0 0 40px rgba(33,150,243,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse-ring 1.5s ease-in-out infinite',
        }}
      >
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 30, color: '#fff' }}>SZ</span>
      </div>
      <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: -0.5 }}>
        Speek<span style={{ color: '#2196f3' }}>Zone</span>
      </h1>
      <p style={{ color: '#555', fontSize: 13, marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Speak Your World
      </p>
    </div>
  );
}
