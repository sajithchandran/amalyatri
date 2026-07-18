'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, AuthUser } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Role = Pick<AuthUser, 'role'>['role'];

const ROLES: { value: Role; label: string; helper: string }[] = [
  { value: 'YATRI',          label: 'Yatri',          helper: 'You are a guest of Amal Tamara.' },
  { value: 'DOCTOR',         label: 'Doctor',         helper: 'You treat guests at Amal Tamara.' },
  { value: 'WELLNESS_GUIDE', label: 'Wellness Guide', helper: 'You lead yoga, meditation, or breathwork.' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('YATRI');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await register({ email: email.trim().toLowerCase(), password, firstName: firstName.trim(), lastName: lastName.trim(), role });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.details?.message ?? err?.message ?? 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle>Begin the lifelong journey</CardTitle>
        <CardDescription>
          A few details and you're in. Calm, free, always.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
            <p className="text-xs text-ink/55">Use a phrase of three or more words — easy to remember, hard to guess.</p>
          </div>
          <div className="space-y-1.5">
            <Label>I am a</Label>
            <div className="grid gap-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition-colors ${
                    role === r.value
                      ? 'border-forest-700/40 bg-forest-50/50'
                      : 'border-forest-900/10 bg-white/60 hover:border-forest-700/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="mt-1 accent-forest-700"
                  />
                  <div>
                    <div className="font-medium">{r.label}</div>
                    <div className="text-xs text-ink/60">{r.helper}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating your account…' : 'Become a Yatri'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink/70">
          Already a Yatri?{' '}
          <Link href="/login" className="text-forest-700 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
