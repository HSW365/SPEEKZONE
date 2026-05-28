import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../utils/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const KEY = 'speekzone_v2_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setUser(JSON.parse(s));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login = async (email: string, _pw: string) => {
    await new Promise(r => setTimeout(r, 700));
    persist({
      id: '1', name: 'HOODSTAR365', username: 'hoodstar365', email,
      bio: 'Founder · HSW365Media LLC 🌍', verified: true,
      followers: 124000, following: 340, totalLikes: 2400000,
      coins: 5000, plan: 'pro',
    });
  };

  const register = async (name: string, email: string, _pw: string) => {
    await new Promise(r => setTimeout(r, 700));
    persist({
      id: Date.now().toString(), name,
      username: name.toLowerCase().replace(/\s+/g, ''),
      email, followers: 0, following: 0, totalLikes: 0, coins: 100, plan: 'free',
    });
  };

  const logout = () => persist(null);
  const updateUser = (u: Partial<User>) => { if (user) persist({ ...user, ...u }); };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
