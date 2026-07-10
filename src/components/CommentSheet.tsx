import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCommentsForClip, postComment } from '../utils/comments';
import { avatarColor } from '../utils/rooms';

interface Props {
  open: boolean;
  onClose: () => void;
  clipId: string;
  onPosted?: () => void;
}

export default function CommentSheet({ open, onClose, clipId, onPosted }: Props) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [comments, setComments] = useState(() => getCommentsForClip(clipId));

  if (!open) return null;

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    postComment(clipId, user.id, user.username, trimmed);
    setComments(getCommentsForClip(clipId));
    setText('');
    onPosted?.();
  };

  return (
    <div
      className="flex items-end justify-center"
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl flex flex-col"
        style={{ background: '#111', maxWidth: 480, height: '70vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: '1px solid #222' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{comments.length} comments</span>
          <button onClick={onClose} style={{ touchAction: 'manipulation' }}>
            <X size={22} color="#888" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-3 py-2.5">
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 34, height: 34, background: avatarColor(c.username), color: '#fff', fontWeight: 800, fontSize: 13 }}
              >
                {c.username[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>@{c.username}</span>
                  <span style={{ color: '#555', fontSize: 11 }}>{c.createdAt}</span>
                </div>
                <p style={{ color: '#ccc', fontSize: 14, marginTop: 2 }}>{c.text}</p>
              </div>
              <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                <Heart size={15} color="#666" />
                <span style={{ color: '#666', fontSize: 10 }}>{c.likes}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: '1px solid #222', paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 12px)' }}
        >
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePost()}
            placeholder="Add a comment..."
            className="flex-1 rounded-full px-4 py-2.5 bg-transparent outline-none"
            style={{ background: '#1c1c1c', color: '#fff', fontSize: 14 }}
          />
          <button
            onClick={handlePost}
            disabled={!text.trim()}
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 40, height: 40, background: text.trim() ? '#2196f3' : '#222', touchAction: 'manipulation' }}
          >
            <Send size={17} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
