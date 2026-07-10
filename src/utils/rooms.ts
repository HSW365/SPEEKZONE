export interface Room {
  id: string;
  name: string;
  topic: string;
  category: 'Talk' | 'Music' | 'Business' | 'Stories';
  live: boolean;
  listeners: number;
  host: string;
  coHost?: string;
  speakers: string[];
  color: string;
}

export const ROOMS: Room[] = [
  {
    id: 'open-talk',
    name: 'Open Talk',
    topic: "Let's talk about anything!",
    category: 'Talk',
    live: true,
    listeners: 134,
    host: 'Aisha',
    coHost: 'Rahul',
    speakers: ['Zara', 'John', 'Mei'],
    color: '#1e6ff2',
  },
  {
    id: 'music-vibes',
    name: 'Music Vibes',
    topic: 'Share your favorite tunes',
    category: 'Music',
    live: true,
    listeners: 86,
    host: 'Marcus',
    coHost: 'Nina',
    speakers: ['Leo', 'Sofia'],
    color: '#7c3aed',
  },
  {
    id: 'hustle-hour',
    name: 'Hustle Hour',
    topic: 'Business, side hustles & the grind',
    category: 'Business',
    live: true,
    listeners: 212,
    host: 'Devon',
    speakers: ['Priya', 'Carlos', 'Amara'],
    color: '#0ea5a4',
  },
  {
    id: 'late-night',
    name: 'Late Night Stories',
    topic: 'Real stories from around the world',
    category: 'Stories',
    live: false,
    listeners: 0,
    host: 'Yuki',
    speakers: ['Omar'],
    color: '#e0447a',
  },
];

const USER_ROOMS_KEY = 'speekzone_user_rooms';

function readUserRooms(): Room[] {
  try {
    const raw = localStorage.getItem(USER_ROOMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUserRooms(rooms: Room[]) {
  try {
    localStorage.setItem(USER_ROOMS_KEY, JSON.stringify(rooms));
  } catch {}
}

/** All rooms visible in the app: the seeded demo rooms plus any the user has actually created. */
export function getAllRooms(): Room[] {
  return [...readUserRooms(), ...ROOMS];
}

export function findRoom(id: string): Room | undefined {
  return getAllRooms().find(r => r.id === id);
}

export function createRoom(params: {
  name: string;
  topic: string;
  category: Room['category'];
  host: string;
  everyoneCanSpeak: boolean;
}): Room {
  const id = `${params.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
  const room: Room = {
    id,
    name: params.name.trim(),
    topic: params.topic.trim() || "Let's talk about anything!",
    category: params.category,
    live: true,
    listeners: 1,
    host: params.host,
    speakers: params.everyoneCanSpeak ? [] : [params.host],
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
  writeUserRooms([room, ...readUserRooms()]);
  return room;
}

export interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  team?: boolean;
}

export const CHATS: ChatItem[] = [
  { id: '1', name: 'Rahul', message: 'That was an amazing discussion!', time: '9:41 AM', unread: 2, online: true },
  { id: '2', name: 'Zara', message: "Can't wait for the next room!", time: '9:20 AM', unread: 1, online: true },
  { id: '3', name: 'Aisha', message: "Let's connect again soon.", time: '8:45 AM', unread: 0, online: true },
  { id: '4', name: 'John', message: 'Shared a room invite', time: 'Yesterday', unread: 0, online: false },
  { id: '5', name: 'Mei', message: 'Thanks for the chat!', time: 'Yesterday', unread: 0, online: false },
  { id: '6', name: 'SpeekZone Team', message: 'Welcome to SpeekZone!', time: 'Mon', unread: 0, online: true, team: true },
];

export const AVATAR_COLORS = ['#1e6ff2', '#7c3aed', '#0ea5a4', '#e0447a', '#f59e0b', '#10b981'];

export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
