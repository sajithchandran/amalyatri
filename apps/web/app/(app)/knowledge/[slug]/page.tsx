'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Tag, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { KnowledgeItem } from '@/lib/types';

export default function KnowledgeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { api } = useAuth();
  const itemQ = useQuery({
    queryKey: ['knowledge', slug],
    queryFn: () => api.get<KnowledgeItem>(`/knowledge/${slug}`),
    enabled: !!slug,
  });

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
        <Link href="/knowledge"><ArrowLeft size={14} /> Back to library</Link>
      </Button>

      {itemQ.isLoading || !itemQ.data ? (
        <CardSkeleton lines={6} />
      ) : (
        <>
          <PageHeader
            eyebrow={itemQ.data.kind.replaceAll('_', ' ')}
            title={itemQ.data.title}
            description={itemQ.data.summary}
            actions={<Badge variant="forest" className="self-end inline-flex items-center gap-1"><Eye size={12} /> {itemQ.data.viewCount} reads</Badge>}
          />

          {itemQ.data.mediaUrl && (itemQ.data.kind === 'YOGA_SESSION' || itemQ.data.kind === 'MEDITATION_SESSION' || itemQ.data.kind === 'VIDEO') && (
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video rounded-3xl bg-gradient-to-br from-forest-700 to-clay-700 grid place-items-center">
                  <p className="text-cream/80 text-sm">▶  {itemQ.data.kind === 'PODCAST' || itemQ.data.kind === 'MEDITATION_SESSION' ? 'Listen' : 'Play'} · {Math.round((itemQ.data.durationSec ?? 0) / 60)} min</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="prose prose-stone max-w-none py-8">
              {itemQ.data.bodyMarkdown?.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h2 key={i} className="font-display text-3xl text-forest-900 mt-0">{line.slice(2)}</h2>;
                if (line.startsWith('## ')) return <h3 key={i} className="font-display text-2xl text-forest-900 mt-8">{line.slice(3)}</h3>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-ink/85 leading-relaxed">{line}</p>;
              })}
              {!itemQ.data.bodyMarkdown && (
                <p className="text-ink/60 italic">This piece is on its way — a quiet read will appear here soon.</p>
              )}
            </CardContent>
          </Card>

          {(itemQ.data.tags ?? []).length > 0 && (
            <div className="mt-6 flex items-center gap-2 text-sm text-ink/55">
              <Tag size={14} /> {itemQ.data.tags.map((t) => (
                <span key={t} className="inline-flex items-center rounded-full bg-cream border border-forest-900/10 px-3 py-1 text-xs">{t}</span>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
