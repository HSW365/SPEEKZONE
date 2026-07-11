import { io, Socket } from 'socket.io-client';
import { getToken } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let socket: Socket | null = null;

/** Lazily creates (or returns) a single authenticated socket connection for the session. */
export function getSocket(): Socket {
  if (socket && socket.connected) return socket;

  socket = io(API_URL, {
    auth: { token: getToken() },
    transports: ['websocket'],
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export interface ChatMessageEvent {
  id: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface GiftReceivedEvent {
  senderName: string;
  recipientName: string;
  giftEmoji: string;
  giftName: string;
  coins: number;
}

export interface PkScoreEvent {
  roomId: string;
  scoreSelf: number;
  scoreOpponent: number;
}

/** Joins a room's socket channel (presence + chat) — call once when entering a Room screen. */
export function joinRoomChannel(roomId: string) {
  getSocket().emit('room:join', { roomId });
}

export function leaveRoomChannel(roomId: string) {
  getSocket().emit('room:leave', { roomId });
}

export function sendChatMessage(roomId: string, text: string) {
  getSocket().emit('chat:message', { roomId, text });
}

export function raiseHand(roomId: string) {
  getSocket().emit('stage:raise-hand', { roomId });
}
