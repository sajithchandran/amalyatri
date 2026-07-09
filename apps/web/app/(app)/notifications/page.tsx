'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelative, cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const { api } = useAuth();
  const qc = useQueryClient();

  const listQ = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<Notification[]>('/notifications'),
  });

  const readOneM = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const readAllM = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = (listQ.data ?? []).filter((n) => !n.readAt).length;

  return (
    <>
      <PageHeader
        eyebrow="Notifications"
        title="Quiet reminders and gentle news."
        description="Reminders for yoga, meditation, medicine, follow-ups, and community updates."
        actions={unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={() => readAllM.mutate()}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        ) : undefined}
      />

      {listQ.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={2} />)}
        </div>
      ) : (listQ.data ?? []).length === 0 ? (
        <p className="text-center text-ink/55 py-16">Inbox zero. A rare stillness.</p>
      ) : (
        <div className="space-y-3">
          {listQ.data!.map((n) => (
            <Card key={n.id} className={cn(!n.readAt && 'border-forest-700/30 bg-forest-50/40')}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-xl bg-cream border border-forest-900/8 grid place-items-center text-forest-700 shrink-0">
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium text-ink">{n.title}</p>
                    {!n.readAt && <Badge variant="forest">New</Badge>}
                  </div>
                  {n.body && <p className="text-sm text-ink/70 mt-1">{n.body}</p>}
                  <div className="mt-2 flex items-center justify-between text-xs text-ink/55">
                    <span>{formatRelative(n.createdAt)}</span>
                    {!n.readAt && (
                      <button onClick={() => readOneM.mutate(n.id)} className="inline-flex items-center gap-1 text-forest-700 hover:underline">
                        <Check size={12} /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
