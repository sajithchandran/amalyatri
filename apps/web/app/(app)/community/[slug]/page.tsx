'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Heart, MessageCircle, Pin, Send, Stethoscope } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials, formatRelative } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Community } from '@/lib/types';

interface Post {
  id: string;
  title?: string | null;
  body: string;
  expertAnswered: boolean;
  pinned: boolean;
  createdAt: string;
  author: { id: string; doctorProfile?: { firstName: string; lastName: string } | null; yatriProfile?: { firstName: string; lastName: string } | null };
  _count: { comments: number; likes: number };
}

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { api, user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

  const postsQ = useQuery({
    queryKey: ['community', slug, 'posts'],
    queryFn: () => api.get<Post[]>(`/communities/${slug}/posts`),
    enabled: !!slug,
  });

  const createM = useMutation({
    mutationFn: () => api.post(`/communities/${slug}/posts`, { title: title || undefined, body }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['community', slug, 'posts'] }); setBody(''); setTitle(''); },
  });

  const likeM = useMutation({
    mutationFn: (postId: string) => api.post(`/communities/posts/${postId}/like`),
    onSuccess: (_d, postId) => { qc.invalidateQueries({ queryKey: ['community', slug, 'posts'] }); void postId; },
  });

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
        <Link href="/community"><ArrowLeft size={14} /> All circles</Link>
      </Button>

      <PageHeader
        eyebrow="Circle"
        title={(slug ?? '').replace(/-/g, ' ')}
        description="A calm, moderated space to share, ask, and listen."
        actions={<Badge variant="forest">{(postsQ.data ?? []).length} discussions</Badge>}
      />

      {/* New post */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A small, gentle title (optional)"
            className="w-full bg-transparent text-lg font-display text-forest-900 placeholder:text-forest-900/40 focus:outline-none mb-3"
          />
          <Textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What’s on your mind today, Yatri?"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={() => createM.mutate()} disabled={!body.trim() || createM.isPending}>
              <Send size={14} /> Share gently
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      {postsQ.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} lines={4} />)}
        </div>
      ) : (postsQ.data ?? []).length === 0 ? (
        <p className="text-center text-ink/55 py-12">This circle is quiet for now. Be the first.</p>
      ) : (
        <div className="space-y-4">
          {postsQ.data!.map((p) => {
            const authorName = p.author.doctorProfile
              ? `Dr. ${p.author.doctorProfile.firstName} ${p.author.doctorProfile.lastName}`
              : p.author.yatriProfile
              ? `${p.author.yatriProfile.firstName} ${p.author.yatriProfile.lastName}`
              : 'A Yatri';
            return (
              <Card key={p.id} className={cn(p.pinned && 'border-clay-300 bg-clay-50/40')}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="size-9"><AvatarFallback>{initials(authorName)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-forest-900">{authorName}</p>
                      <p className="text-xs text-ink/55">{formatRelative(p.createdAt)}</p>
                    </div>
                    {p.pinned && <Badge variant="clay"><Pin size={12} /> Pinned</Badge>}
                    {p.expertAnswered && (
                      <Badge variant="forest" className="inline-flex items-center gap-1"><Stethoscope size={12} /> Expert</Badge>
                    )}
                  </div>
                  {p.title && <h3 className="font-display text-xl text-forest-900 text-balance mb-1">{p.title}</h3>}
                  <p className="text-sm text-ink/85 leading-relaxed text-pretty">{p.body}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink/55">
                    <button onClick={() => likeM.mutate(p.id)} className="inline-flex items-center gap-1.5 hover:text-rose-600">
                      <Heart size={14} /> {p._count.likes}
                    </button>
                    <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} /> {p._count.comments}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
