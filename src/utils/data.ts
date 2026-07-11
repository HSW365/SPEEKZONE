export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  followers: number;
  following: number;
  totalLikes: number;
  coins: number;
  diamonds?: number; // gift payout balance earned while live — separate from spendable coins
  plan: 'free' | 'verified';
}

export interface Clip {
  id: string;
  userId: string;
  username: string;
  userVerified?: boolean;
  caption: string;
  audioUrl?: string;
  videoUrl?: string;
  mediaType?: 'video' | 'image';
  waveform: number[];
  duration: number;
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  tags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  likes: number;
  createdAt: string;
}

export interface Gift {
  id: string;
  emoji: string;
  name: string;
  coins: number;
}

export const GIFTS: Gift[] = [
  { id: '1', emoji: '🎤', name: 'Mic',     coins: 10 },
  { id: '2', emoji: '🔥', name: 'Fire',    coins: 50 },
  { id: '3', emoji: '💎', name: 'Diamond', coins: 200 },
  { id: '4', emoji: '👑', name: 'Crown',   coins: 500 },
  { id: '5', emoji: '🚀', name: 'Rocket',  coins: 1000 },
  { id: '6', emoji: '💰', name: 'Bag',     coins: 2000 },
];

export const MOCK_CLIPS: Clip[] = [
  {
    id: '1', userId: '2', username: 'CreatorKing', userVerified: true,
    caption: 'This beat go crazy 🔥 drop a fire if you feel this #music #vibes #speekzone',
    waveform: [0.3,0.7,0.5,0.9,0.4,0.8,0.6,0.3,0.7,0.5,0.9,0.4,0.8,0.6,0.3,0.7,0.5,0.9,0.4,0.8],
    duration: 42, likes: 48200, comments: 1240, shares: 892, gifts: 340,
    tags: ['music','vibes','speekzone'], createdAt: '2026-05-27',
  },
  {
    id: '2', userId: '3', username: 'EntrepreneurTV', userVerified: true,
    caption: 'How I made $10k this month from my phone alone 💰 #business #money #grind',
    waveform: [0.5,0.4,0.8,0.3,0.9,0.6,0.4,0.7,0.5,0.8,0.3,0.9,0.6,0.4,0.7,0.5,0.8,0.3,0.9,0.6],
    duration: 58, likes: 91200, comments: 4320, shares: 2100, gifts: 1240,
    tags: ['business','money','grind'], createdAt: '2026-05-26',
  },
  {
    id: '3', userId: '4', username: 'AliTorres', userVerified: false,
    caption: 'Real talk — stop playing small with your dreams 💯 #motivation #reallife',
    waveform: [0.6,0.8,0.4,0.7,0.5,0.9,0.3,0.8,0.6,0.4,0.7,0.5,0.9,0.3,0.8,0.6,0.4,0.7,0.5,0.9],
    duration: 33, likes: 14300, comments: 560, shares: 340, gifts: 89,
    tags: ['motivation','reallife'], createdAt: '2026-05-25',
  },
  {
    id: '4', userId: '5', username: 'DevKing', userVerified: false,
    caption: 'Built a full app in 24 hours — here\'s how 🛠️ #tech #coding #build',
    waveform: [0.4,0.6,0.9,0.3,0.7,0.5,0.8,0.4,0.6,0.9,0.3,0.7,0.5,0.8,0.4,0.6,0.9,0.3,0.7,0.5],
    duration: 55, likes: 23400, comments: 890, shares: 560, gifts: 210,
    tags: ['tech','coding','build'], createdAt: '2026-05-24',
  },
  {
    id: '5', userId: '1', username: 'HOODSTAR365', userVerified: true,
    caption: 'SpeekZone is live 🌍 we global now — speak your world #speekzone #launch',
    waveform: [0.9,0.4,0.7,0.5,0.8,0.3,0.6,0.9,0.4,0.7,0.5,0.8,0.3,0.6,0.9,0.4,0.7,0.5,0.8,0.3],
    duration: 28, likes: 124000, comments: 8900, shares: 5400, gifts: 3200,
    tags: ['speekzone','launch'], createdAt: '2026-05-23',
  },
];

export const MOCK_COMMENTS: Comment[] = [
  { id: '1', userId: '2', username: 'CreatorKing',    text: 'This is hard 🔥🔥🔥',          likes: 234, createdAt: '2m' },
  { id: '2', userId: '3', username: 'EntrepreneurTV', text: 'Bro said SPEAK YOUR WORLD 💯',  likes: 189, createdAt: '5m' },
  { id: '3', userId: '4', username: 'AliTorres',      text: 'We needed this app fr',          likes: 145, createdAt: '12m' },
  { id: '4', userId: '5', username: 'DevKing',        text: 'The waveform animation clean 👌', likes: 98,  createdAt: '18m' },
  { id: '5', userId: '6', username: 'WellnessCoach',  text: 'Following immediately 🙌',       likes: 76,  createdAt: '25m' },
];

export const TRENDING_TAGS = ['#speekzone','#music','#business','#motivation','#tech','#viral','#grind','#newapp'];

export const PLANS = [
  {
    id: 'verified', name: 'VERIFIED', price: 9.99,
    appleProductId: 'com.speekzone.app.verified_monthly',
    color: '#16a34a',
    features: ['Red/black/green verified checkmark','Creator analytics dashboard','Priority placement in Discover feed','Custom profile banner','Revenue share eligibility on gifts'],
  },
];
