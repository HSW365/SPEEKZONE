import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Globe, Sparkles, Lock, LucideIcon } from 'lucide-react';
import { useToast } from '../components/Toast';

function Segmented<T extends string>({
  options, value, onChange,
}: {
  options: { key: T; label: string; icon: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-3">
      {options.map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3"
            style={{
              background: active ? '#1e6ff2' : '#fff',
              color: active ? '#fff' : '#475569',
              border: active ? '1.5px solid #1e6ff2' : '1.5px solid #e2e8f0',
              fontWeight: 800,
              fontSize: 14,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Icon size={16} color={active ? '#fff' : '#64748b'} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function Record() {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [roomType, setRoomType] = useState<'open' | 'social'>('open');
  const [whoSpeaks, setWhoSpeaks] = useState<'everyone' | 'invited'>('everyone');

  const handleCreate = () => {
    if (!name.trim()) {
      toast('Give your room a name first');
      return;
    }
    toast(`"${name.trim()}" is live!`);
    navigate('/room/open-talk');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 16,
    padding: '13px 16px',
    fontSize: 14,
    color: '#0e1726',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 800, color: '#334155', marginBottom: 8, display: 'block',
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#f4f6fb' }}>
      {/* Header */}
      <div
        className="flex items-center px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 8px)', paddingBottom: 10 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 38, height: 38, background: '#fff',
            touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={22} color="#0e1726" />
        </button>
        <h1 className="flex-1 text-center" style={{ fontSize: 18, fontWeight: 900, color: '#0e1726' }}>
          Create Room
        </h1>
        <div style={{ width: 38 }} />
      </div>

      <div className="px-5 pb-8">
        {/* Icon */}
        <div className="flex justify-center my-5">
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 84, height: 84,
              background: 'linear-gradient(135deg,#3b82f6,#1d63e8)',
              boxShadow: '0 8px 24px rgba(29,99,232,.35)',
            }}
          >
            <Users size={38} color="#fff" />
          </div>
        </div>

        {/* Room name */}
        <label style={labelStyle}>Room Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter room name"
          style={inputStyle}
        />

        {/* Topic */}
        <label style={{ ...labelStyle, marginTop: 18 }}>Topic</label>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="What's your room about?"
          style={inputStyle}
        />

        {/* Room type */}
        <label style={{ ...labelStyle, marginTop: 18 }}>Room Type</label>
        <Segmented
          options={[
            { key: 'open', label: 'Open', icon: Globe },
            { key: 'social', label: 'Social', icon: Sparkles },
          ]}
          value={roomType}
          onChange={setRoomType}
        />

        {/* Who can speak */}
        <label style={{ ...labelStyle, marginTop: 18 }}>Who can speak?</label>
        <Segmented
          options={[
            { key: 'everyone', label: 'Everyone', icon: Users },
            { key: 'invited', label: 'Only Invited', icon: Lock },
          ]}
          value={whoSpeaks}
          onChange={setWhoSpeaks}
        />

        {/* Create button */}
        <button
          onClick={handleCreate}
          className="w-full rounded-2xl mt-8"
          style={{
            background: '#1e6ff2',
            color: '#fff',
            fontWeight: 900,
            fontSize: 16,
            padding: '15px 0',
            boxShadow: '0 8px 20px rgba(30,111,242,.35)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
