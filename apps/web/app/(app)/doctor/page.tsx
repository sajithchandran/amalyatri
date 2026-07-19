'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, MessageCircle, Stethoscope, Award, Clock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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

  const doctors = doctorsQ.data ?? [];
  const conversations = convsQ.data ?? [];

  const list = doctors.filter((d) =>
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

      {/* Recent conversations — moved to top */}
      {conversations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-forest-700" />
            <h2 className="text-sm font-medium text-ink">Recent conversations</h2>
            <span className="text-xs text-ink/50">({conversations.length})</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-thin">
            {conversations.slice(0, 5).map((c) => (
              <Link
                key={c.otherId}
                href={`/doctor/${c.otherId}`}
                className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 border border-forest-900/8 hover:border-forest-700/30 hover:bg-forest-700/4 transition min-w-[200px]"
              >
                <Avatar className="size-10">
                  <AvatarFallback className="bg-forest-100 text-forest-800 text-xs">
                    {initials(c.otherName ?? 'Dr')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.otherName ?? 'Doctor'}</p>
                  {c.lastMessage && (
                    <p className="text-xs text-ink/55 truncate">{c.lastMessage.body ?? 'Voice note'}</p>
                  )}
                  <p className="text-[10px] text-ink/40 mt-0.5">
                    {c.lastMessage ? formatRelative(c.lastMessage.createdAt) : ''}
                  </p>
                </div>
                {c.unread > 0 && (
                  <Badge variant="solid" className="shrink-0">{c.unread}</Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, speciality, qualification…"
          className="pl-10"
        />
      </div>

      {/* Doctor directory — bigger cards */}
      {doctorsQ.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={5} />)}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((d) => (
            <Card key={d.id} className="overflow-hidden hover:shadow-glow transition-shadow group">
              {/* Photo area */}
              <div className="aspect-[16/9] bg-gradient-to-br from-forest-50 to-cream overflow-hidden">
                {d.avatarUrl ? (
                  <img
                    src={d.avatarUrl}
                    alt={`Dr. ${d.firstName} ${d.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="size-20 ring-4 ring-white/60">
                      <AvatarFallback className="text-2xl bg-forest-100 text-forest-800">
                        {initials(`${d.firstName} ${d.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              {/* Info area */}
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl text-forest-900 leading-tight">
                      Dr. {d.firstName} {d.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ink/55 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Award size={12} /> {d.yearsOfPractice}+ years
                      </span>
                      <span className="text-ink/30">·</span>
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="shrink-0" /> {d.email || d.user?.email || ''}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" className="shrink-0">
                    <Link href={`/doctor/${d.userId}`}>
                      <MessageCircle size={14} /> Message
                    </Link>
                  </Button>
                </div>

                <p className="text-sm text-ink/80 mt-3 leading-relaxed">
                  {d.qualifications}
                </p>

                {d.specialties && d.specialties.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-1.5">
                      {d.specialties.map((s) => (
                        <Badge key={s} variant="clay" className="text-[11px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                {d.bio && (
                  <p className="mt-3 text-xs text-ink/60 leading-relaxed line-clamp-2">
                    {d.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {list.length === 0 && !doctorsQ.isLoading && (
        <div className="text-center py-16">
          <Stethoscope size={40} className="mx-auto text-ink/20" />
          <p className="mt-4 text-sm text-ink/60">No doctors match "{q}".</p>
        </div>
      )}
    </>
  );
}

// Silence unused-export warning while keeping the type available for nested routes.
export type { Doctor };
