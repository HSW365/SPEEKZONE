import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../utils/data';
import { initPurchases } from '../utils/purchases';
import { apiLogin, apiRegister, ApiUser, setToken } from '../services/api';

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

function apiUserToLocal(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.username,
    username: apiUser.username,
    email: apiUser.email,
    avatar: apiUser.avatar,
    bio: apiUser.bio,
    verified: apiUser.verified,
    followers: apiUser.followers,
    following: apiUser.following,
    totalLikes: 0,
    coins: apiUser.coins,
    diamonds: apiUser.diamonds,
    plan: apiUser.plan === 'pro' || apiUser.plan === 'creator' ? 'verified' : 'free',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        initPurchases(parsed.id);
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

  const login = async (email: string, password: string) => {
    const { token, user: apiUser } = await apiLogin(email, password);
    setToken(token);
    const loggedInUser = apiUserToLocal(apiUser);
    persist(loggedInUser);
    await initPurchases(loggedInUser.id);
  };

  const register = async (name: string, email: string, password: string) => {
    const username = name.toLowerCase().replace(/\s+/g, '');
    const { token, user: apiUser } = await apiRegister(username, email, password);
    setToken(token);
    const newUser = apiUserToLocal(apiUser);
    persist(newUser);
    await initPurchases(newUser.id);
  };

  const logout = () => {
    setToken(null);
    persist(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      persist({ ...user, ...updates });
    }
  };

  const deleteAccount = async () => {
    // TODO(Phase 2): call DELETE /api/auth/account on the server once account
    // deletion is wired server-side (Guideline 5.1.1(v) requires it to actually
    // remove the user's data, not just clear local state).
    await new Promise(resolve => setTimeout(resolve, 800));
    setToken(null);
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
