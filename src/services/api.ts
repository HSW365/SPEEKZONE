/**
 * Thin fetch wrapper for the SpeekZone live backend (server/ in this repo).
 *
 * Set VITE_API_URL in a .env file before building, e.g.:
 *   VITE_API_URL=https://speekzone-api.onrender.com
 *
 * Falls back to localhost for local dev against `npm run dev` in /server.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'speekzone_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// --- Auth ---

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  plan: 'free' | 'creator' | 'pro';
  coins: number;
  diamonds: number;
  followers: number;
  following: number;
}

export function apiRegister(username: string, email: string, password: string) {
  return request<{ token: string; user: ApiUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export function apiLogin(email: string, password: string) {
  return request<{ token: string; user: ApiUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// --- Live rooms ---

export interface ApiGuest {
  userId: string;
  username: string;
  role: 'host' | 'guest' | 'listener';
}

export interface ApiRoom {
  roomId: string;
  name: string;
  topic: string;
  category: string;
  mode: 'audio' | 'video';
  hostId: string;
  hostName: string;
  isLive: boolean;
  maxGuests: number;
  guests: ApiGuest[];
  listenerCount: number;
  pk: {
    active: boolean;
    opponentRoomId: string | null;
    scoreSelf: number;
    scoreOpponent: number;
    endsAt: string | null;
  };
}

export interface RtcCreds {
  token: string;
  wsUrl: string;
}

export function listRooms() {
  return request<{ rooms: ApiRoom[] }>('/api/rooms');
}

export function createRoom(params: { name: string; topic?: string; category?: string; mode?: 'audio' | 'video'; maxGuests?: number }) {
  return request<{ room: ApiRoom; rtc: RtcCreds }>('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function joinRoom(roomId: string, asRole: 'guest' | 'listener' = 'listener') {
  return request<{ room: ApiRoom; rtc: RtcCreds; role: string }>(`/api/rooms/${roomId}/join`, {
    method: 'POST',
    body: JSON.stringify({ asRole }),
  });
}

export function inviteGuest(roomId: string, targetUserId: string) {
  return request<{ room: ApiRoom }>(`/api/rooms/${roomId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ targetUserId }),
  });
}

export function leaveStage(roomId: string) {
  return request<{ room: ApiRoom }>(`/api/rooms/${roomId}/leave-stage`, { method: 'POST' });
}

export function endRoom(roomId: string) {
  return request<{ room: ApiRoom }>(`/api/rooms/${roomId}/end`, { method: 'POST' });
}

export function startPkBattle(roomId: string, opponentRoomId: string, durationSeconds = 180) {
  return request<{ room: ApiRoom; opponent: ApiRoom }>(`/api/rooms/${roomId}/pk/start`, {
    method: 'POST',
    body: JSON.stringify({ opponentRoomId, durationSeconds }),
  });
}

export function endPkBattle(roomId: string) {
  return request<{ winner: string }>(`/api/rooms/${roomId}/pk/end`, { method: 'POST' });
}

// --- Gifts ---

export function sendGift(giftId: string, recipientId: string, roomId?: string) {
  return request<{ transaction: any; senderCoins: number; recipientDiamonds: number }>('/api/gifts/send', {
    method: 'POST',
    body: JSON.stringify({ giftId, recipientId, roomId }),
  });
}

export function getRoomLeaderboard(roomId: string) {
  return request<{ topSenders: { _id: string; totalCoins: number }[] }>(`/api/gifts/leaderboard/${roomId}`);
}
