'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email.trim().toLowerCase(), password);
      // Route based on role
      if (user.role === 'DOCTOR' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'WELLNESS_GUIDE') {
        router.push('/admin/dashboard');
      } else {
        router.push(next);
      }
    } catch (err: any) {
      setError(err?.details?.message ?? err?.message ?? 'Could not sign you in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your lifelong wellness companion.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-forest-700 hover:underline">Forgot?</Link>
            </div>
            <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink/70">
          Not yet a Yatri?{' '}
          <Link href="/register" className="text-forest-700 hover:underline font-medium">
            Begin the journey
          </Link>
        </p>
        <div className="mt-6 pt-5 border-t border-forest-900/8">
          <Link href="/admin/login" className="text-xs text-ink/50 hover:text-forest-700 transition">
            Staff sign in →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
