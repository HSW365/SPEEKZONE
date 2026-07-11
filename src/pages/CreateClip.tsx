import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Video, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postClip } from '../utils/userClips';
import { useToast } from '../components/Toast';

export default function CreateClip() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);

  const handleFile = (f: File | undefined, type: 'video' | 'image') => {
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setMediaType(type);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setMediaType(null);
  };

  const handlePost = async () => {
    if (!file || !mediaType || !user) return;
    setPosting(true);
    try {
      await postClip({
        userId: user.id,
        username: user.username,
        userVerified: user.plan === 'verified',
        caption: caption.trim() || 'New clip on SpeekZone',
        tags: caption.match(/#\w+/g)?.map(t => t.slice(1)) || [],
        mediaBlob: file,
        mediaType,
      });
      toast('Posted!');
      navigate('/');
    } catch (err) {
      toast('Could not post - please try again');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#000' }}>
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 10px)', paddingBottom: 12 }}
      >
        <button onClick={() => navigate(-1)} className="active:opacity-60">
          <ChevronLeft size={24} color="#fff" />
        </button>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 18, fontFamily: 'Barlow Condensed' }}>
          Post a Clip
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {!file ? (
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => videoInputRef.current?.click()}
              className="rounded-2xl flex flex-col items-center justify-center gap-2 py-10"
              style={{
                background: '#111', border: '1px solid #222',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Video size={34} color="#00e676" />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Record a video</span>
              <span style={{ color: '#666', fontSize: 12 }}>Opens your camera</span>
            </button>

            <button
              onClick={() => photoInputRef.current?.click()}
              className="rounded-2xl flex flex-col items-center justify-center gap-2 py-10"
              style={{
                background: '#111', border: '1px solid #222',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <ImageIcon size={34} color="#2196f3" />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Take or choose a photo</span>
              <span style={{ color: '#666', fontSize: 12 }}>Camera or photo library</span>
            </button>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0], 'video')}
            />
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0], 'image')}
            />
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative rounded-2xl overflow-hidden" style={{ background: '#111', aspectRatio: '9/16', maxHeight: '55vh' }}>
              {mediaType === 'video' ? (
                <video src={previewUrl!} className="w-full h-full object-cover" controls playsInline />
              ) : (
                <img src={previewUrl!} className="w-full h-full object-cover" alt="Preview" />
              )}
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                style={{ width: 34, height: 34, background: 'rgba(0,0,0,.6)' }}
              >
                <X size={18} color="#fff" />
              </button>
            </div>

            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write a caption... #use #hashtags"
              rows={3}
              className="w-full rounded-2xl px-4 py-3 mt-4 outline-none resize-none"
              style={{ background: '#111', color: '#fff', fontSize: 14, border: '1px solid #222' }}
            />

            <button
              onClick={handlePost}
              disabled={posting}
              className="w-full py-3.5 rounded-xl font-bold text-white mt-4"
              style={{
                fontFamily: 'Barlow Condensed', fontSize: 17, letterSpacing: '0.06em',
                background: 'linear-gradient(135deg,#1e6ff2cc,#1e6ff2)',
                opacity: posting ? 0.6 : 1,
                touchAction: 'manipulation',
              }}
            >
              {posting ? 'Posting...' : 'Post to SpeekZone'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
