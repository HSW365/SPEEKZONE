import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users } from 'lucide-react';

export default function CreateChoice() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col" style={{ background: '#f4f6fb' }}>
      <div
        className="px-5"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 10px)', paddingBottom: 8 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0e1726' }}>Create</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
          Post a clip to your feed, or start a live room.
        </p>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-4 justify-center pb-20">
        <button
          onClick={() => navigate('/create/clip')}
          className="rounded-2xl flex items-center gap-4 p-5"
          style={{ background: '#fff', boxShadow: '0 2px 12px rgba(15,40,105,.06)', touchAction: 'manipulation' }}
        >
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: 56, height: 56, background: 'rgba(0,230,118,0.12)' }}>
            <Video size={26} color="#00c853" />
          </div>
          <div className="text-left">
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0e1726' }}>Post a Clip</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Share a video or photo to your feed</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/create/room')}
          className="rounded-2xl flex items-center gap-4 p-5"
          style={{ background: '#fff', boxShadow: '0 2px 12px rgba(15,40,105,.06)', touchAction: 'manipulation' }}
        >
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: 56, height: 56, background: 'rgba(30,111,242,0.12)' }}>
            <Users size={26} color="#1e6ff2" />
          </div>
          <div className="text-left">
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0e1726' }}>Start a Room</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Host a live voice conversation</div>
          </div>
        </button>
      </div>
    </div>
  );
}
