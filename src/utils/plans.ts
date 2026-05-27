export const CATEGORIES = [
  'Music',
  'Business',
  'Society & Culture',
  'Technology',
  'Health & Fitness',
  'Comedy',
  'News',
  'Sports',
  'True Crime',
  'Education',
  'Arts',
  'Religion & Spirituality',
];

export interface Plan {
  id: string;
  name: string;
  price: number;
  popular: boolean;
  appleProductId: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'BASIC',
    price: 8,
    popular: false,
    appleProductId: 'com.speekzone.app.basic_monthly',
    features: [
      'Host up to 3 podcast shows',
      'Unlimited episodes',
      'Distribution to 10+ platforms',
      'Basic analytics',
      'SpeekZone listener badge',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 18,
    popular: true,
    appleProductId: 'com.speekzone.app.pro_monthly',
    features: [
      'Unlimited podcast shows',
      'Monetization & listener support',
      'Advanced analytics dashboard',
      'Verified creator badge',
      'Priority distribution',
      'Custom RSS feed',
    ],
  },
  {
    id: 'elite',
    name: 'ELITE',
    price: 38,
    popular: false,
    appleProductId: 'com.speekzone.app.elite_monthly',
    features: [
      'Everything in Pro',
      'White-label RSS feed',
      'Dedicated account manager',
      'Early access to new features',
      'Co-host collaboration tools',
      'Revenue share program',
    ],
  },
];