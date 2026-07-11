import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Gift as GiftIcon, Music, Play, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CLIPS, Clip, Gift } from '../utils/data';
import { getUserClips } from '../utils/userClips';
import { getMediaObjectUrl } from '../utils/mediaStorage';
import { useToast, shareOrCopy } from '../components/Toast';
import { isBlocked } from '../utils/moderation';
import { isFollowing, followUser, unfollowUser } from '../utils/follows';
import ReportBlockSheet from '../components/ReportBlockSheet';
import CommentSheet from '../components/CommentSheet';
import GiftSheet from '../components/GiftSheet';

function ClipCard({ clip, onBlocked, onFollowChanged }: { clip: Clip; onBlocked: () => void; onFollowChanged: () => void }) {
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [showGiftSheet, setShowGiftSheet] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(clip.likes);
  const [gifts, setGifts] = useState(clip.gifts);
  const [commentCount, setCommentCount] = useState(clip.comments);
  const [resolvedMediaUrl, setResolvedMediaUrl] = useState<string | null>(null);
  const following = isFollowing(clip.username);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (clip.mediaType && clip.videoUrl) {
      getMediaObjectUrl(clip.videoUrl).then(url => {
        objectUrl = url;
        setResolvedMediaUrl(url);
      });
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [clip.id]);
  const toast = useToast();

  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` :
    String(n);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCommentSheet(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareOrCopy({ title: 'SpeekZone', text: `Check out @${clip.username} on SpeekZone`, url: 'https://speekzone.com' }, toast);
  };

  const handleGift = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGiftSheet(true);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (following) {
      unfollowUser(clip.username);
      toast(`Unfollowed @${clip.username}`);
    } else {
      followUser(clip.username);
      toast(`Following @${clip.username}`);
    }
    onFollowChanged();
  };

  return (
    <section className="relative w-full h-full flex-shrink-0 overflow-hidden bg-black">
      {clip.mediaType === 'video' && resolvedMediaUrl ? (
        <video
          src={resolvedMediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : clip.mediaType === 'image' && resolvedMediaUrl ? (
        <img
          src={resolvedMediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          alt={clip.caption}
        />
      ) : clip.mediaType ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <span style={{ color: '#444', fontSize: 13 }}>Loading...</span>
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              clip.id === '1'
                ? 'linear-gradient(160deg,#050505 0%,#19002e 45%,#ff0055 140%)'
                : clip.id === '2'
                ? 'linear-gradient(160deg,#020202 0%,#001d28 45%,#00eaff 140%)'
                : clip.id === '3'
                ? 'linear-gradient(160deg,#040404 0%,#221000 45%,#ffb000 140%)'
                : clip.id === '4'
                ? 'linear-gradient(160deg,#020202 0%,#041e12 45%,#00ff88 140%)'
                : 'linear-gradient(160deg,#050505 0%,#2c0000 45%,#ff3030 140%)',
          }}
        >
          <div className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(circle at 25% 20%, rgba(255,255,255,.35), transparent 20%), radial-gradient(circle at 80% 65%, rgba(255,255,255,.2), transparent 25%)',
            }}
          />
          <div
            className="absolute left-0 right-0 flex flex-col items-center justify-center px-8 text-center"
            style={{ top: 0, bottom: 220 }}
          >
            <div
              className="mb-5 rounded-full flex items-center justify-center"
              style={{
                width: 116,
                height: 116,
                background: 'rgba(255,255,255,.12)',
                border: '2px solid rgba(255,255,255,.35)',
                boxShadow: '0 0 40px rgba(255,255,255,.18)',
                backdropFilter: 'blur(12px)',
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {clip.username[0]}
            </div>

            <h1
              style={{
                fontFamily: 'Barlow Condensed',
                fontSize: 52,
                lineHeight: .9,
                fontWeight: 900,
                letterSpacing: -1,
                textShadow: '0 8px 35px rgba(0,0,0,.7)',
              }}
            >
              SPEEKZONE
            </h1>

            <p className="mt-3 text-sm text-white/80 max-w-xs">
              Audio &amp; video creator network. Record, share, go viral.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-full px-5 py-3"
              style={{
                background: 'rgba(0,0,0,.45)',
                border: '1px solid rgba(255,255,255,.15)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <Play size={18} fill="#fff" />
              <span className="text-sm font-bold">Tap. Watch. Create.</span>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,.55), transparent 25%, transparent 55%, rgba(0,0,0,.9))',
        }}
      />

      {/* Right action buttons */}
      <div className="absolute right-4 flex flex-col items-center gap-6 z-30" style={{ bottom: 150 }}>
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <Heart size={31} color={liked ? '#ff2d55' : '#fff'} fill={liked ? '#ff2d55' : 'none'} />
          </div>
          <span className="text-xs font-black">{fmt(likes)}</span>
        </button>

        <button
          onClick={handleComment}
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <MessageCircle size={31} color="#fff" />
          </div>
          <span className="text-xs font-black">{fmt(commentCount)}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <Share2 size={30} color="#fff" />
          </div>
          <span className="text-xs font-black">{fmt(clip.shares)}</span>
        </button>

        <button
          onClick={handleGift}
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <GiftIcon size={30} color="#ffd700" />
          </div>
          <span className="text-xs font-black">{fmt(gifts)}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setShowReportSheet(true); }}
          className="flex flex-col items-center gap-1"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 44, height: 44, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(12px)' }}>
            <MoreHorizontal size={24} color="#fff" />
          </div>
        </button>

        <div className="rounded-full flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg,#00eaff,#ff0055)',
            border: '2px solid #fff',
            animation: 'spin 4s linear infinite',
            fontWeight: 900,
          }}>
          {clip.username[0]}
        </div>
      </div>

      <div className="absolute left-4 right-24 z-20" style={{ bottom: 138 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-black text-lg">@{clip.username}</span>
          {clip.userVerified && (
            <span className="rounded-full bg-blue-500 text-white text-xs px-1.5">✓</span>
          )}
          <button
            onClick={handleFollow}
            className="ml-2 px-3 py-1 rounded-full text-xs font-black border"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              borderColor: following ? 'rgba(255,255,255,.35)' : '#fff',
              background: following ? 'rgba(255,255,255,.12)' : 'transparent',
              color: '#fff',
            }}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        <p className="text-sm leading-snug text-white mb-2">{clip.caption}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {clip.tags.map(t => (
            <span key={t} className="text-sm font-bold text-cyan-300">#{t}</span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-white/85">
          <Music size={15} />
          <span className="truncate">Original Sound - SpeekZone Creators</span>
        </div>
      </div>

      <ReportBlockSheet
        open={showReportSheet}
        username={clip.username}
        targetType="clip"
        targetId={clip.id}
        onClose={() => setShowReportSheet(false)}
        onBlocked={onBlocked}
      />
      <CommentSheet
        open={showCommentSheet}
        clipId={clip.id}
        onClose={() => setShowCommentSheet(false)}
        onPosted={() => setCommentCount(c => c + 1)}
      />
      <GiftSheet
        open={showGiftSheet}
        username={clip.username}
        onClose={() => setShowGiftSheet(false)}
        onSent={(gift: Gift) => setGifts(g => g + 1)}
      />
    </section>
  );
}

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blockVersion, setBlockVersion] = useState(0);
  const [followVersion, setFollowVersion] = useState(0);
  const [feedTab, setFeedTab] = useState<'following' | 'foryou' | 'live'>('foryou');
  const startY = useRef(0);
  const startX = useRef(0);
  const navigate = useNavigate();

  const allClips = [...getUserClips(), ...MOCK_CLIPS].filter(c => !isBlocked(c.username));
  const clips = feedTab === 'following'
    ? allClips.filter(c => isFollowing(c.username))
    : allClips;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setCurrentIndex(0); }, [feedTab, followVersion]);

  const selectTab = (t: 'following' | 'foryou' | 'live') => {
    if (t === 'live') {
      navigate('/discover');
      return;
    }
    setFeedTab(t);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    startY.current = e.clientY;
    startX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const diffY = startY.current - e.clientY;
    const diffX = Math.abs(startX.current - e.clientX);

    if (Math.abs(diffY) > 60 && Math.abs(diffY) > diffX * 1.5) {
      if (diffY > 0 && currentIndex < clips.length - 1) {
        setCurrentIndex(i => i + 1);
      }
      if (diffY < 0 && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Top tab bar - single instance for the whole feed, not per-clip */}
      <div
        className="absolute top-0 left-0 right-0 z-40 pointer-events-none"
        style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}
      >
        <div className="flex justify-center gap-7 py-4 pointer-events-auto">
          {(['following', 'foryou', 'live'] as const).map((t) => {
            const label = t === 'foryou' ? 'For You' : t === 'following' ? 'Following' : 'Live';
            const active = feedTab === t && t !== 'live';
            return (
              <button
                key={t}
                onClick={() => selectTab(t)}
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,.55)',
                  fontWeight: active ? 900 : 700,
                  borderBottom: active ? '2px solid #fff' : '2px solid transparent',
                  paddingBottom: 4,
                  fontSize: 15,
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  cursor: 'pointer',
                  minWidth: 60,
                  textAlign: 'center',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {clips.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full px-8 text-center">
          <span style={{ fontSize: 40 }}>👀</span>
          <h2 style={{ color: '#fff', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 22, marginTop: 12 }}>
            Nothing here yet
          </h2>
          <p style={{ color: '#888', fontSize: 14, marginTop: 6 }}>
            Follow creators from the For You feed and their clips will show up here.
          </p>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(-${currentIndex * 100}%)`,
            transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
          }}
        >
          {clips.map((clip, i) => (
            <div key={clip.id} style={{ position: 'absolute', top: `${i * 100}%`, left: 0, width: '100%', height: '100%' }}>
              <ClipCard
                clip={clip}
                onBlocked={() => setBlockVersion(v => v + 1)}
                onFollowChanged={() => setFollowVersion(v => v + 1)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
