import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ChevronLeft, Mic, MicOff, Video, VideoOff, Hand, Share2, LogOut,
  Users, MoreHorizontal, Gift as GiftIcon, Swords, Send,
} from 'lucide-react';
import { avatarColor } from '../utils/rooms';
import { useToast, shareOrCopy } from '../components/Toast';
import { isBlocked } from '../utils/moderation';
import ReportBlockSheet from '../components/ReportBlockSheet';
import GiftSheet from '../components/GiftSheet';
import { useAuth } from '../context/AuthContext';
import { LiveKitService } from '../services/LiveKitService';
import {
  ApiRoom, RtcCreds, joinRoom, inviteGuest, leaveStage, endRoom,
  listRooms, startPkBattle, endPkBattle,
} from '../services/api';
import {
  getSocket, joinRoomChannel, leaveRoomChannel, sendChatMessage, raiseHand,
  ChatMessageEvent, GiftReceivedEvent, PkScoreEvent,
} from '../services/socket';

function VideoTile({
  username, userId, size, isSelf, ring, lk, onClick,
}: {
  username: string;
  userId: string;
  size: number;
  isSelf?: boolean;
  ring?: boolean;
  lk: LiveKitService | null;
  onClick?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!lk || !videoRef.current) return;
    lk.registerVideoElement(userId, videoRef.current);
  });

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
      style={{ width: size + 16, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className="rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 relative"
        style={{
          width: size, height: size,
          background: avatarColor(username),
          border: ring ? '3px solid #3b82f6' : '2px solid rgba(255,255,255,.25)',
          boxShadow: ring ? '0 0 20px rgba(59,130,246,.45)' : 'none',
        }}
      >
        {/* Fallback shown until LiveKit attaches a live track to the video element above it. */}
        <span style={{ color: '#fff', fontWeight: 800, fontSize: size * 0.4, position: 'absolute' }}>
          {username[0]}
        </span>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isSelf}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative' }}
        />
      </div>
      <span className="truncate w-full text-center" style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
        {username}
      </span>
    </button>
  );
}

export default function Room() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation() as { state?: { room?: ApiRoom; rtc?: RtcCreds; role?: string } };
  const toast = useToast();
  const { user } = useAuth();

  const [room, setRoom] = useState<ApiRoom | null>(location.state?.room || null);
  const [rtc, setRtc] = useState<RtcCreds | null>(location.state?.rtc || null);
  const [myRole, setMyRole] = useState<'host' | 'guest' | 'listener'>(
    (location.state?.role as any) || 'listener'
  );
  const [ready, setReady] = useState(false);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState(0);

  const [chatMessages, setChatMessages] = useState<ChatMessageEvent[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [giftToast, setGiftToast] = useState<GiftReceivedEvent | null>(null);

  const [showGiftSheet, setShowGiftSheet] = useState(false);
  const [giftTarget, setGiftTarget] = useState<{ id: string; username: string } | null>(null);

  const [showPkPicker, setShowPkPicker] = useState(false);
  const [otherLiveRooms, setOtherLiveRooms] = useState<ApiRoom[]>([]);
  const [pk, setPk] = useState<{ active: boolean; scoreSelf: number; scoreOpponent: number }>({
    active: room?.pk?.active || false,
    scoreSelf: room?.pk?.scoreSelf || 0,
    scoreOpponent: room?.pk?.scoreOpponent || 0,
  });

  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [showRoomMenu, setShowRoomMenu] = useState(false);

  const lkRef = useRef<LiveKitService | null>(null);
  const isHost = room?.hostId === user?.id;

  // --- Join the room (backend + LiveKit + socket) on mount ---
  useEffect(() => {
    if (!id || !user) return;
    let cancelled = false;

    async function setup() {
      try {
        let activeRoom = room;
        let creds = rtc;
        let role = myRole;

        // Listener path: no room/rtc was handed off via navigation state, so fetch them.
        if (!activeRoom || !creds) {
          const res = await joinRoom(id!, 'listener');
          if (cancelled) return;
          activeRoom = res.room;
          creds = res.rtc;
          role = res.role as any;
          setRoom(activeRoom);
          setRtc(creds);
          setMyRole(role);
        }

        const lk = new LiveKitService({
          onRemoteTrackChanged: () => setRemoteVersion(v => v + 1),
        });
        lkRef.current = lk;

        await lk.join({
          wsUrl: creds.wsUrl,
          token: creds.token,
          role: role === 'listener' ? 'audience' : 'host',
        });

        joinRoomChannel(activeRoom.roomId);
        setReady(true);
      } catch (err: any) {
        toast(err?.message || 'Could not join this room');
        navigate(-1);
      }
    }

    setup();

    return () => {
      cancelled = true;
      lkRef.current?.leave();
      if (id) leaveRoomChannel(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- Socket event subscriptions ---
  useEffect(() => {
    if (!id) return;
    const socket = getSocket();

    const onChat = (msg: ChatMessageEvent) => setChatMessages(prev => [...prev.slice(-49), msg]);
    const onGift = (evt: GiftReceivedEvent) => {
      setGiftToast(evt);
      setTimeout(() => setGiftToast(g => (g === evt ? null : g)), 3200);
    };
    const onGuestsUpdated = (data: { guests: any[]; listenerCount: number }) => {
      setRoom(prev => (prev ? { ...prev, guests: data.guests, listenerCount: data.listenerCount } : prev));
    };
    const onPkStarted = () => setPk({ active: true, scoreSelf: 0, scoreOpponent: 0 });
    const onPkScore = (evt: PkScoreEvent) => setPk({ active: true, scoreSelf: evt.scoreSelf, scoreOpponent: evt.scoreOpponent });
    const onPkEnded = (evt: { winner: string }) => {
      setPk({ active: false, scoreSelf: 0, scoreOpponent: 0 });
      toast(evt.winner === room?.roomId ? 'You won the PK battle! 🏆' : 'PK battle ended');
    };
    const onHandRaised = (evt: { username: string }) => {
      if (isHost) toast(`${evt.username} raised their hand`);
    };

    socket.on('chat:message', onChat);
    socket.on('gift:received', onGift);
    socket.on('room:guests-updated', onGuestsUpdated);
    socket.on('pk:started', onPkStarted);
    socket.on('pk:score-update', onPkScore);
    socket.on('pk:ended', onPkEnded);
    socket.on('stage:hand-raised', onHandRaised);

    return () => {
      socket.off('chat:message', onChat);
      socket.off('gift:received', onGift);
      socket.off('room:guests-updated', onGuestsUpdated);
      socket.off('pk:started', onPkStarted);
      socket.off('pk:score-update', onPkScore);
      socket.off('pk:ended', onPkEnded);
      socket.off('stage:hand-raised', onHandRaised);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isHost, room?.roomId]);

  const handleShare = () => {
    shareOrCopy(
      { title: 'SpeekZone', text: `Join "${room?.name}" live on SpeekZone`, url: 'https://speekzone.com' },
      toast
    );
  };

  const toggleMic = () => {
    const next = !muted;
    setMuted(next);
    lkRef.current?.setMicMuted(next);
  };

  const toggleCamera = () => {
    const next = !cameraOff;
    setCameraOff(next);
    lkRef.current?.setCameraMuted(next);
  };

  const handleRaiseHand = () => {
    if (!id) return;
    raiseHand(id);
    toast('Hand raised — the host will see it');
  };

  const handleLeave = async () => {
    try {
      if (myRole === 'guest' && !isHost && room) await leaveStage(room.roomId);
      if (isHost && room) await endRoom(room.roomId);
    } catch {}
    navigate(-1);
  };

  const openPkPicker = useCallback(async () => {
    try {
      const { rooms } = await listRooms();
      setOtherLiveRooms(rooms.filter(r => r.roomId !== room?.roomId));
      setShowPkPicker(true);
    } catch {
      toast('Could not load live rooms');
    }
  }, [room?.roomId]);

  const startBattle = async (opponentRoomId: string) => {
    if (!room) return;
    try {
      await startPkBattle(room.roomId, opponentRoomId);
      setShowPkPicker(false);
      toast('PK battle started — gifts sent during the battle count as score!');
    } catch (err: any) {
      toast(err?.message || 'Could not start PK battle');
    }
  };

  const endBattle = async () => {
    if (!room) return;
    try {
      await endPkBattle(room.roomId);
    } catch (err: any) {
      toast(err?.message || 'Could not end PK battle');
    }
  };

  const sendChat = () => {
    if (!id || !chatInput.trim()) return;
    sendChatMessage(id, chatInput.trim());
    setChatInput('');
  };

  if (!room || !ready) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg,#0a1430 0%,#0d1f4a 100%)' }}
      >
        <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>Joining live room…</span>
      </div>
    );
  }

  const visibleGuests = room.guests.filter(g => !isBlocked(g.username));
  const host = visibleGuests.find(g => g.role === 'host');
  const guests = visibleGuests.filter(g => g.role !== 'host');

  const controls = [
    {
      key: 'mic',
      label: muted ? 'Unmute' : 'Mute',
      icon: muted ? MicOff : Mic,
      show: myRole !== 'listener',
      onClick: toggleMic,
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'camera',
      label: cameraOff ? 'Camera On' : 'Camera Off',
      icon: cameraOff ? VideoOff : Video,
      show: myRole !== 'listener' && room.mode === 'video',
      onClick: toggleCamera,
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'hand',
      label: 'Raise Hand',
      icon: Hand,
      show: myRole === 'listener',
      onClick: handleRaiseHand,
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'gift',
      label: 'Gift',
      icon: GiftIcon,
      show: !!host && host.userId !== user?.id,
      onClick: () => {
        if (!host) return;
        setGiftTarget({ id: host.userId, username: host.username });
        setShowGiftSheet(true);
      },
      bg: 'rgba(255,215,0,.18)',
    },
    {
      key: 'pk',
      label: pk.active ? 'End PK' : 'PK Battle',
      icon: Swords,
      show: isHost && room.mode === 'video',
      onClick: pk.active ? endBattle : openPkPicker,
      bg: pk.active ? '#e0447a' : 'rgba(255,255,255,.12)',
    },
    {
      key: 'share',
      label: 'Share',
      icon: Share2,
      show: true,
      onClick: handleShare,
      bg: 'rgba(255,255,255,.12)',
    },
    {
      key: 'leave',
      label: 'Leave',
      icon: LogOut,
      show: true,
      onClick: handleLeave,
      bg: '#ff2d3d',
    },
  ].filter(c => c.show);

  return (
    <div
      className="h-full flex flex-col relative"
      style={{ background: 'linear-gradient(180deg,#0a1430 0%,#0d1f4a 100%)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 8px)', paddingBottom: 12 }}
      >
        <button
          onClick={handleLeave}
          className="rounded-full flex items-center justify-center"
          style={{ width: 38, height: 38, background: 'rgba(255,255,255,.1)', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
        <div className="flex-1 text-center">
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{room.name}</div>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="rounded-full px-2 py-0.5" style={{ background: '#ff2d3d', color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 0.5 }}>
              LIVE
            </span>
            <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,.6)', fontSize: 12 }}>
              <Users size={12} /> {room.listenerCount + room.guests.length}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowRoomMenu(true)}
          className="rounded-full flex items-center justify-center"
          style={{ width: 38, height: 38, background: 'rgba(255,255,255,.1)', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <MoreHorizontal size={20} color="#fff" />
        </button>
      </div>

      {/* PK score bar */}
      {pk.active && (
        <div className="px-5 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.15)' }}>
              <div
                className="h-full"
                style={{
                  width: `${(pk.scoreSelf / Math.max(pk.scoreSelf + pk.scoreOpponent, 1)) * 100}%`,
                  background: '#1e6ff2',
                }}
              />
            </div>
            <Swords size={14} color="#fff" />
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.15)' }}>
              <div
                className="h-full ml-auto"
                style={{
                  width: `${(pk.scoreOpponent / Math.max(pk.scoreSelf + pk.scoreOpponent, 1)) * 100}%`,
                  background: '#e0447a',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stage — video grid, up to 1 host + 8 guests, matching Bigo's multi-guest cap */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex justify-center gap-8 mt-4">
          {host && (
            <VideoTile
              username={host.username}
              userId={host.userId}
              size={76}
              ring
              isSelf={host.userId === user?.id}
              lk={lkRef.current}
              onClick={() => setReportTarget(host.username)}
            />
          )}
        </div>

        {guests.length > 0 && (
          <>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 800, marginTop: 28, marginBottom: 12 }}>
              On Stage ({guests.length}/{room.maxGuests})
            </div>
            <div className="flex flex-wrap gap-4">
              {guests.map(g => (
                <VideoTile
                  key={g.userId}
                  username={g.username}
                  userId={g.userId}
                  size={64}
                  isSelf={g.userId === user?.id}
                  lk={lkRef.current}
                  onClick={() => setReportTarget(g.username)}
                />
              ))}
            </div>
          </>
        )}

        {isHost && guests.length < room.maxGuests && (
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 14 }}>
            {room.maxGuests - guests.length} open guest slot{room.maxGuests - guests.length === 1 ? '' : 's'} — invite
            listeners who raise their hand.
          </p>
        )}

        {/* Live chat */}
        <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 800, marginTop: 28, marginBottom: 8 }}>
          Chat
        </div>
        <div className="flex flex-col gap-1.5 mb-2">
          {chatMessages.map(m => (
            <div key={m.id} style={{ fontSize: 13 }}>
              <span style={{ color: avatarColor(m.senderName), fontWeight: 800 }}>{m.senderName}</span>{' '}
              <span style={{ color: 'rgba(255,255,255,.85)' }}>{m.text}</span>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>No messages yet — say hi 👋</span>
          )}
        </div>
      </div>

      {/* Floating gift toast */}
      {giftToast && (
        <div
          className="absolute left-1/2 flex items-center gap-2 rounded-full px-4 py-2"
          style={{
            top: 90, transform: 'translateX(-50%)', background: 'rgba(0,0,0,.7)',
            backdropFilter: 'blur(8px)', animation: 'fadeIn .2s ease',
          }}
        >
          <span style={{ fontSize: 20 }}>{giftToast.giftEmoji}</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {giftToast.senderName} sent {giftToast.giftName} to {giftToast.recipientName}
          </span>
        </div>
      )}

      {/* Chat input */}
      <div className="flex items-center gap-2 px-5" style={{ paddingBottom: 8 }}>
        <input
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendChat()}
          placeholder="Say something…"
          className="flex-1 rounded-full px-4"
          style={{ height: 38, background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <button
          onClick={sendChat}
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 38, height: 38, background: '#1e6ff2', touchAction: 'manipulation' }}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>

      {/* Bottom controls */}
      <div className="flex justify-around px-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 10px)', paddingTop: 6 }}>
        {controls.map(({ key, label, icon: Icon, onClick, bg }) => (
          <button
            key={key}
            onClick={onClick}
            className="flex flex-col items-center gap-1.5"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="rounded-2xl flex items-center justify-center" style={{ width: 50, height: 50, background: bg, backdropFilter: 'blur(10px)' }}>
              <Icon size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* PK opponent picker */}
      {showPkPicker && (
        <div
          className="flex items-end justify-center"
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)' }}
          onClick={() => setShowPkPicker(false)}
        >
          <div
            className="w-full rounded-t-3xl px-5 pt-4"
            style={{ background: '#111', paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 20px)', maxWidth: 480, maxHeight: '60vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Challenge a live room</span>
            <div className="flex flex-col gap-2 mt-4">
              {otherLiveRooms.length === 0 && (
                <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>No other rooms are live right now.</span>
              )}
              {otherLiveRooms.map(r => (
                <button
                  key={r.roomId}
                  onClick={() => startBattle(r.roomId)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{ background: '#1a1a1a', touchAction: 'manipulation' }}
                >
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                  <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>{r.hostName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showGiftSheet && giftTarget && (
        <GiftSheet
          open
          username={giftTarget.username}
          recipientId={giftTarget.id}
          roomId={room.roomId}
          onClose={() => setShowGiftSheet(false)}
        />
      )}

      {reportTarget && (
        <ReportBlockSheet
          open
          username={reportTarget}
          targetType="user"
          targetId={reportTarget}
          onClose={() => setReportTarget(null)}
          onBlocked={() => {}}
        />
      )}

      {showRoomMenu && (
        <ReportBlockSheet
          open
          username={room.hostName}
          targetType="room"
          targetId={room.roomId}
          onClose={() => setShowRoomMenu(false)}
          onBlocked={() => {}}
        />
      )}
    </div>
  );
}
