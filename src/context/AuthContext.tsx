import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../utils/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const KEY = 'speekzone_v2_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {}

    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);

    if (u) {
      localStorage.setItem(KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(KEY);
    }
  };

  const login = async (email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    persist({
      id: '1',
      name: 'HOODSTAR365',
      username: 'hoodstar365',
      email,
      bio: 'Founder of SpeekZone · AI Creator Network · HSW365Media',
      verified: true,
      followers: 124000,
      following: 340,
      totalLikes: 2400000,
      coins: 5000,
      plan: 'pro',
    });
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    persist({
      id: Date.now().toString(),
      name,
      username: name.toLowerCase().replace(/\s+/g, ''),
      email,
      bio: 'New creator on SpeekZone',
      verified: false,
      followers: 0,
      following: 0,
      totalLikes: 0,
      coins: 100,
      plan: 'free',
    });
  };

  const logout = () => {
    persist(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      persist({ ...user, ...updates });
    }
  };

  const deleteAccount = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Clear all user data from storage
    localStorage.removeItem(KEY);
    localStorage.removeItem('speekzone_posts');
    localStorage.removeItem('speekzone_likes');
    localStorage.removeItem('speekzone_follows');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
