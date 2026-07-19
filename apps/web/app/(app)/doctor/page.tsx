'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mic, Image as ImageIcon, FileText, Send, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { initials, formatRelative } from '@/lib/utils';
import type { Conversation, Doctor } from '@/lib/types';

export default function DoctorListPage() {
  const { api } = useAuth();
  const [q, setQ] = useState('');

  const doctorsQ = useQuery({
    queryKey: ['doctors'],
    queryFn: () => api.get<Array<Doctor & { user: { email: string } }>>('/doctor-connect/doctors'),
  });
  const convsQ = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get<Conversation[]>('/doctor-connect/conversations'),
  });

  const list = (doctorsQ.data ?? []).filter((d) =>
    [d.firstName, d.lastName, d.qualifications, ...(d.specialties ?? [])].join(' ').toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        eyebrow="Doctor"
        title="Stay close to your care."
        description="Send a message, a voice note, an image. When something matters, request a follow-up consultation."
        actions={
          <Badge variant="forest" className="self-end">{list.length} on duty</Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Recent conversations */}
        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent</CardTitle>
              <CardDescription>Threads with your team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 px-2">
              {convsQ.isLoading && <CardSkeleton lines={2} />}
              {(convsQ.data ?? []).length === 0 && !convsQ.isLoading && (
                <p className="text-sm text-ink/55 px-2 py-3">No conversations yet.</p>
              )}
              {(convsQ.data ?? []).map((c) => (
                <Link
                  key={c.otherId}
                  href={`/doctor/${c.otherId}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest-700/4"
                >
                  <Avatar className="size-9"><AvatarFallback>{initials('Dr')}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">Dr.</p>
                    <p className="text-xs text-ink/55 truncate">{c.lastMessage.body ?? 'Voice note'}</p>
                  </div>
                  {c.unread > 0 && <Badge variant="solid">{c.unread}</Badge>}
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Doctor directory */}
        <section>
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, speciality…"
              className="pl-10"
            />
          </div>

          {doctorsQ.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={3} />)}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((d) => (
                <Card key={d.id} className="hover:shadow-glow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Avatar className="size-14 ring-2 ring-forest-700/10">
                      {d.avatarUrl ? (
                        <img src={d.avatarUrl} alt={d.firstName} className="size-full object-cover rounded-full" />
                      ) : (
                        <AvatarFallback className="text-base">{initials(`${d.firstName} ${d.lastName}`)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xl text-forest-900">Dr. {d.firstName} {d.lastName}</p>
                      <p className="text-xs text-ink/55">{d.yearsOfPractice}+ years · {d.qualifications}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {d.specialties.slice(0, 3).map((s) => (
                          <Badge key={s} variant="clay">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/doctor/${d.userId}`}>Message</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {list.length === 0 && !doctorsQ.isLoading && (
            <p className="text-sm text-ink/60 mt-8">No doctors match “{q}”.</p>
          )}
        </section>
      </div>
    </>
  );
}

// Silence unused-export warning while keeping the type available for nested routes.
export type { Doctor };
