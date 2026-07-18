'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const search = useSearchParams();
  const next = search.get('next') ?? '/admin/dashboard';
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email.trim().toLowerCase(), password);
      if (user.role === 'YATRI' || user.role === 'THERAPIST') {
        setError('This portal is for doctors and admin staff only. Please use the main login.');
        return;
      }
      router.push(next);
    } catch (err: any) {
      setError(err?.details?.message ?? err?.message ?? 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-emerald-900 text-white grid place-items-center text-lg font-serif">
              A
            </div>
            <div className="text-left">
              <p className="font-serif text-lg text-slate-900 leading-tight">Amal Yatri</p>
              <p className="text-xs text-slate-500 tracking-wider">STAFF PORTAL</p>
            </div>
          </Link>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-slate-900">Staff sign in</h1>
            <p className="text-sm text-slate-500 mt-1.5">
              For doctors, wellness guides, and administrators.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@amaltamara.com"
                className="border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link href="/forgot-password" className="text-xs text-emerald-700 hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/20"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl py-2.5"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              <Link href="/login" className="text-emerald-700 hover:underline">
                ← Back to member sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Amal Tamara Ayurveda. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
