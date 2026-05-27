import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  plan: 'free' | 'basic' | 'pro' | 'elite';
  bio?: string;
  verified?: boolean;
  followers?: number;
  following?: number;
  totalPlays?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'speekzone_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const u: User = {
      id: '1',
      name: 'HOODSTAR365',
      username: 'hoodstar365',
      email,
      plan: 'pro',
      bio: 'Founder · HSW365Media LLC',
      verified: true,
      followers: 12400,
      following: 340,
      totalPlays: 48200,
    };
    persist(u);
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const u: User = {
      id: Date.now().toString(),
      name,
      username: name.toLowerCase().replace(/\s+/g, ''),
      email,
      plan: 'free',
      followers: 0,
      following: 0,
      totalPlays: 0,
    };
    persist(u);
  };

  const logout = () => persist(null);

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    persist({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}