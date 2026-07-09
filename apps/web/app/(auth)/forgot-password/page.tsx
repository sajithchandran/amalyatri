'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
    } catch {/* intentionally silent */}
    setSent(true);
  }

  return (
    <Card className="border-none shadow-none bg-transparent p-0">
      <CardHeader className="px-0">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>If your email is in our system, we’ll send you a quiet link.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {sent ? (
          <p className="text-sm text-ink/75">Check your inbox. The link works for one hour.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button type="submit" size="lg" className="w-full">Send reset link</Button>
          </form>
        )}
        <p className="mt-6 text-sm text-ink/70">
          Remembered it?{' '}
          <Link href="/login" className="text-forest-700 hover:underline font-medium">Back to sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
