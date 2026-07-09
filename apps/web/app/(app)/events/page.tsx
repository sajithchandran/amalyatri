'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Users, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { EventItem } from '@/lib/types';

export default function EventsPage() {
  const { api } = useAuth();
  const qc = useQueryClient();

  const upcomingQ = useQuery({
    queryKey: ['events','upcoming'],
    queryFn: () => api.get<EventItem[]>('/events?upcoming=true'),
  });

  const regM = useMutation({
    mutationFn: (id: string) => api.post(`/events/${id}/register`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events','upcoming'] }),
  });
  const cancelM = useMutation({
    mutationFn: (id: string) => api.post(`/events/${id}/cancel`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events','upcoming'] }),
  });

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Live sessions, workshops, retreats."
        description="Quiet opportunities to learn, breathe, and gather — most free for Yatris."
        actions={<Badge variant="forest" className="self-end">{(upcomingQ.data ?? []).length} upcoming</Badge>}
      />

      {upcomingQ.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={3} />)}
        </div>
      ) : (upcomingQ.data ?? []).length === 0 ? (
        <p className="text-center text-ink/55 py-12">No upcoming events. The calendar rests.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingQ.data!.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="clay">{e.kind.replaceAll('_', ' ')}</Badge>
                  {e.capacity && (
                    <span className="text-xs text-ink/55 inline-flex items-center gap-1"><Users size={12} /> cap {e.capacity}</span>
                  )}
                </div>
                <CardTitle className="text-xl text-balance leading-snug">{e.title}</CardTitle>
                {e.description && (
                  <CardDescription className="mt-2">{e.description}</CardDescription>
                )}
                <div className="mt-4 flex items-center gap-2 text-sm text-ink/65">
                  <Calendar size={14} className="text-forest-700" />
                  <span>{formatDate(e.startsAt)} {e.hostName ? ` · ${e.hostName}` : ''}</span>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={() => regM.mutate(e.id)} disabled={regM.isPending}>
                    <CheckCircle2 size={14} /> Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
