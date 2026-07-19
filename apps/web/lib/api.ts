'use client';

/**
 * Centralised REST client for the Amal Yatri NestJS API.
 *
 * Reads the auth token from localStorage (kept simple for the v0.1 cut);
 * later this is replaced with HttpOnly cookie + refresh-token rotation.
 *
 *   const api = useApi();
 *   const me = await api.get('/users/me');
 */

/**
 * Resolves the API base URL.
 *
 * Browser: defaults to `window.location.origin` so calls go to the same
 * host/port the page was served from. The web dev server then proxies
 * `/api/v1/*` to the API, OR — for cross-origin dev — `NEXT_PUBLIC_API_URL`
 * is honored if explicitly set.
 *
 * Server: only used during SSR requests. If `NEXT_PUBLIC_API_URL` is set,
 * uses that (server-to-server). Otherwise falls back to localhost.
 */
function resolveApiBase(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL;
  if (explicit) return explicit;
  if (typeof window !== 'undefined') {
    // Browser-side: talk to whichever origin the page is loaded from.
    // For docker / remote dev, the API lives at port 3001 by default.
    const port = window.location.port;
    if (port === '3050' || port === '3000') {
      // same-origin or relative: assume API is on the same host, port 3001
      return `${window.location.protocol}//${window.location.hostname}:3001/api/v1`;
    }
    return 'http://localhost:3001/api/v1';
  }
  // SSR
  return 'http://localhost:3001/api/v1';
}

const API_BASE = resolveApiBase();

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

const TOKEN_KEY = 'amalyatri:access';
const REFRESH_KEY = 'amalyatri:refresh';

/**
 * Uses sessionStorage (per-tab) instead of localStorage (shared across tabs)
 * so a Yatri tab and a Doctor tab can stay logged in simultaneously.
 */
function storage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function getAccessToken(): string | null {
  const s = storage(); if (!s) return null;
  return s.getItem(TOKEN_KEY);
}
export function setAccessToken(token: string | null) {
  const s = storage(); if (!s) return;
  if (token === null) s.removeItem(TOKEN_KEY);
  else s.setItem(TOKEN_KEY, token);
}
export function getRefreshToken(): string | null {
  const s = storage(); if (!s) return null;
  return s.getItem(REFRESH_KEY);
}
export function setRefreshToken(token: string | null) {
  const s = storage(); if (!s) return;
  if (token === null) s.removeItem(REFRESH_KEY);
  else s.setItem(REFRESH_KEY, token);
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export interface ApiClient {
  get<T = unknown>(path: string, init?: RequestInit): Promise<T>;
  post<T = unknown>(path: string, body?: Json): Promise<T>;
  put<T = unknown>(path: string, body?: Json): Promise<T>;
  patch<T = unknown>(path: string, body?: Json): Promise<T>;
  del<T = unknown>(path: string): Promise<T>;
}

async function rawCall(method: Method, path: string, body?: Json, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload: BodyInit | undefined;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  return fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: payload,
    ...init,
  });
}

export async function apiCall<T>(
  method: Method,
  path: string,
  body?: Json,
  init?: RequestInit,
): Promise<T> {
  const res = await rawCall(method, path, body, init);

  if (res.status === 401) {
    // Try once to refresh the access token.
    const ok = await tryRefresh();
    if (ok) {
      const retry = await rawCall(method, path, body, init);
      return parse<T>(retry);
    }
    setAccessToken(null);
    setRefreshToken(null);
  }
  return parse<T>(res);
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let detail: unknown = text;
    try { detail = JSON.parse(text); } catch { /* keep string */ }
    const err: ApiError = {
      status: res.status,
      message: res.statusText || `HTTP ${res.status}`,
      details: detail,
    };
    throw err;
  }
  if (!text) return undefined as T;
  try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const body = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setAccessToken(body.accessToken);
    setRefreshToken(body.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export function makeApi(): ApiClient {
  return {
    get:  <T,>(p: string, init?: RequestInit) => apiCall<T>('GET',    p, undefined, init),
    post: <T,>(p: string, b?: Json)             => apiCall<T>('POST',   p, b),
    put:  <T,>(p: string, b?: Json)             => apiCall<T>('PUT',    p, b),
    patch:<T,>(p: string, b?: Json)             => apiCall<T>('PATCH',  p, b),
    del:  <T,>(p: string)                       => apiCall<T>('DELETE', p),
  };
}
