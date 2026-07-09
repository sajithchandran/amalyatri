'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Headphones, Video, Leaf, Salad, Mic, Heart, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn, formatDate } from '@/lib/utils';
import type { KnowledgeItem, ContentKind } from '@/lib/types';

const KIND_LABEL: Record<ContentKind, string> = {
  ARTICLE: 'Article',
  VIDEO: 'Video',
  PODCAST: 'Podcast',
  RECIPE: 'Recipe',
  YOGA_SESSION: 'Yoga',
  MEDITATION_SESSION: 'Meditation',
  FAQ: 'FAQ',
  STORY: 'Story',
  DOCTOR_TALK: 'Doctor talk',
};

const KIND_ICON: Record<ContentKind, React.ComponentType<{ size?: number; className?: string }>> = {
  ARTICLE: BookOpen, VIDEO: Video, PODCAST: Headphones, RECIPE: Salad,
  YOGA_SESSION: Leaf, MEDITATION_SESSION: Heart, FAQ: BookOpen, STORY: BookOpen,
  DOCTOR_TALK: Mic,
};

const FILTERS: Array<{ id: 'ALL' | ContentKind; label: string }> = [
  { id: 'ALL',                label: 'All' },
  { id: 'ARTICLE',            label: 'Articles' },
  { id: 'RECIPE',             label: 'Recipes' },
  { id: 'YOGA_SESSION',       label: 'Yoga' },
  { id: 'MEDITATION_SESSION', label: 'Meditation' },
  { id: 'PODCAST',            label: 'Podcasts' },
  { id: 'DOCTOR_TALK',        label: 'Doctor talks' },
];

export default function KnowledgeListPage() {
  const { api } = useAuth();
  const [kind, setKind] = useState<'ALL' | ContentKind>('ALL');
  const [q, setQ] = useState('');

  const itemsQ = useQuery({
    queryKey: ['knowledge', kind, q],
    queryFn: () => {
      const params = new URLSearchParams();
      if (kind !== 'ALL') params.set('kind', kind);
      if (q) params.set('tag', q); // search-as-tag works as a v0.1 heuristic
      const qs = params.toString();
      return api.get<KnowledgeItem[]>(`/knowledge${qs ? `?${qs}` : ''}`);
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Quiet reading, listening, practising."
        description="Articles, recipes, yoga, meditation, podcasts, and doctor talks — curated by the team at Amal Tamara."
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setKind(f.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm border transition',
              kind === f.id
                ? 'bg-forest-700 text-cream border-forest-700'
                : 'bg-white/60 border-forest-900/10 text-ink/75 hover:bg-forest-700/5',
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by tag…" className="pl-9" />
        </div>
      </div>

      {itemsQ.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} lines={3} />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(itemsQ.data ?? []).map((it) => {
            const Icon = KIND_ICON[it.kind] ?? BookOpen;
            return (
              <Link key={it.id} href={`/knowledge/${it.slug}`}>
                <Card className="h-full hover:shadow-glow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="clay">{KIND_LABEL[it.kind]}</Badge>
                      <div className="size-10 rounded-xl bg-cream border border-forest-900/8 grid place-items-center text-forest-700">
                        <Icon size={16} />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-balance leading-snug">{it.title}</CardTitle>
                    {it.summary && (
                      <CardDescription className="mt-2 line-clamp-3 text-pretty">{it.summary}</CardDescription>
                    )}
                    <div className="mt-4 text-xs text-ink/55 flex justify-between">
                      <span>{it.publishedAt ? formatDate(it.publishedAt) : '—'}</span>
                      {it.durationSec ? <span>{Math.round(it.durationSec / 60)} min</span> : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          {(itemsQ.data ?? []).length === 0 && (
            <p className="col-span-full text-center text-ink/60 py-16">Nothing here yet.</p>
          )}
        </div>
      )}
    </>
  );
}
