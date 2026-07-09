'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  makeApi,
  ApiClient,
} from './api';

export interface AuthUser {
  id: string;
  email: string;
  role: 'YATRI' | 'DOCTOR' | 'WELLNESS_GUIDE' | 'THERAPIST' | 'ADMIN' | 'CONTENT_MODERATOR' | 'SUPER_ADMIN';
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  api: ApiClient;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: AuthUser['role'];
    displayName?: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const api = React.useMemo(() => makeApi(), []);

  // On mount: if a token exists, try to fetch /users/me. If it fails, clear.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!getAccessToken()) { setLoading(false); return; }
        const me = await api.get<{ id: string; email: string; role: AuthUser['role']; profile?: { firstName?: string; lastName?: string } | null }>('/users/me');
        if (cancelled) return;
        setUser({
          id: me.id,
          email: me.email,
          role: me.role,
          firstName: me.profile?.firstName,
          lastName: me.profile?.lastName,
        });
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [api]);

  const value: AuthState = React.useMemo(() => ({
    user, loading, api,
    async login(email, password) {
      const res = await api.post<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', { email, password });
      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      setUser(res.user);
      return res.user;
    },
    async register(input) {
      const res = await api.post<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', input);
      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      setUser(res.user);
      return res.user;
    },
    async logout() {
      try {
        const r = getRefreshToken();
        if (r) await api.post('/auth/logout', { refreshToken: r });
      } catch { /* ignore */ }
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      router.push('/');
    },
    async refresh() {
      const r = getRefreshToken();
      if (!r) return;
      const res = await api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken: r });
      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
    },
  }), [user, loading, api, router]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
