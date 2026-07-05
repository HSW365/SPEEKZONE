export interface Room {
  id: string;
  name: string;
  topic: string;
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
    live: false,
    listeners: 0,
    host: 'Yuki',
    speakers: ['Omar'],
    color: '#e0447a',
  },
];

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
