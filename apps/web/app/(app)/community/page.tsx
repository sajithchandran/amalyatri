'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Lock, ArrowUpRight, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Community } from '@/lib/types';

export default function CommunityListPage() {
  const { api } = useAuth();
  const qc = useQueryClient();

  const allQ = useQuery({ queryKey: ['communities','all'],  queryFn: () => api.get<Community[]>('/communities') });
  const mineQ = useQuery({ queryKey: ['communities','mine'], queryFn: () => api.get<Array<Community & { myRole: string }>>('/communities/mine') });

  const joinM = useMutation({
    mutationFn: (slug: string) => api.post(`/communities/${slug}/join`),
    onSuccess: (_d, slug) => {
      qc.invalidateQueries({ queryKey: ['communities'] });
      void slug;
    },
  });
  const leaveM = useMutation({
    mutationFn: (slug: string) => api.post(`/communities/${slug}/leave`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['communities'] }),
  });

  const all   = allQ.data ?? [];
  const mine  = mineQ.data ?? [];
  const mineSlugs = new Set(mine.map((c) => c.slug));

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Calm, moderated circles."
        description="Twelve gentle places to belong, run by the Amal Tamara team and your fellow Yatris."
        actions={<Badge variant="forest">{mine.length} joined</Badge>}
      />

      {/* Joined */}
      {mine.length > 0 && (
        <section className="mb-10">
          <h3 className="text-xs uppercase tracking-[0.2em] text-forest-900/55 mb-3">Your circles</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((c) => <CommunityCard key={c.id} c={c} joined onLeave={() => leaveM.mutate(c.slug)} />)}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xs uppercase tracking-[0.2em] text-forest-900/55 mb-3">Discover</h3>
        {allQ.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} lines={2} />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((c) => (
              <CommunityCard
                key={c.id}
                c={c}
                joined={mineSlugs.has(c.slug)}
                onJoin={  () => joinM.mutate(c.slug)}
                onLeave={ () => leaveM.mutate(c.slug)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CommunityCard({
  c, joined, onJoin, onLeave,
}: {
  c: Community;
  joined: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="clay">{c.category}</Badge>
          {c.isPrivate && <Lock size={14} className="text-ink/55" />}
        </div>
        <CardTitle className="text-xl">{c.name}</CardTitle>
        <CardDescription>{c.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0 flex items-center justify-between">
        <span className="text-xs text-ink/55 inline-flex items-center gap-1.5"><Users size={12} /> {c.memberCount} yatris</span>
        {joined ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLeave}>Leave</Button>
            <Button asChild size="sm"><Link href={`/community/${c.slug}`}>Open <ArrowUpRight size={14} /></Link></Button>
          </div>
        ) : (
          <Button size="sm" variant={c.isPrivate ? 'ghost' : 'primary'} onClick={onJoin} disabled={c.isPrivate}>
            <Plus size={14} /> {c.isPrivate ? 'Invite-only' : 'Join'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
