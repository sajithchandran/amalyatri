'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MessageCircle, Sparkles, Wind, BookOpen, ArrowUpRight, Heart, Activity, Bell, ChefHat, Stethoscope, Yoga } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelative } from '@/lib/utils';
import type { Community, Conversation, EventItem, KnowledgeItem, Notification, TimelineEvent } from '@/lib/types';

// ─── Sub-components (kept inline so the dashboard stays one cohesive page) ──

function DailyYoga({ items }: { items: any[] }) {
  if (items.length === 0) return null;
  const latest = items[0];
  return (
    <Card className="overflow-hidden group">
      {latest.imageUrl && (
        <div className="aspect-[16/9] bg-forest-50 overflow-hidden">
          <img src={latest.imageUrl} alt={latest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-forest-700/70 font-medium">Today&apos;s yoga</p>
            <h3 className="font-display text-xl text-forest-900 mt-1">{latest.title}</h3>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-cream rounded-full px-2.5 py-1 text-xs text-forest-700">
            <Yoga size={14} /> {latest.durationMin} min
          </div>
        </div>
        {latest.description && (
          <p className="mt-2 text-sm text-ink/70">{latest.description}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs text-ink/55">
          <span>Recommended by Dr. {latest.doctor?.firstName} {latest.doctor?.lastName}</span>
          {latest.difficulty && (
            <>
              <span className="text-ink/30">·</span>
              <span className="capitalize">{latest.difficulty}</span>
            </>
          )}
        </div>
        {latest.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {latest.tags.map((t: string) => (
              <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full bg-cream border border-forest-900/8 text-forest-700">{t}</span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CareTeam({ doctors }: { doctors: any[] }) {
  if (doctors.length === 0) return null;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your care team</CardTitle>
          <CardDescription>The doctors guiding your wellness.</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/doctor">View all <ArrowUpRight size={14} /></Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {doctors.map((d: any) => (
          <Link
            key={d.id}
            href={`/doctor/${d.userId}`}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-forest-900/8 hover:border-forest-700/30 hover:bg-forest-700/4 transition"
          >
            <div className="size-12 rounded-full overflow-hidden bg-forest-100 shrink-0 ring-2 ring-forest-700/10">
              {d.avatarUrl ? (
                <img src={d.avatarUrl} alt={d.firstName} className="size-full object-cover" />
              ) : (
                <div className="size-full grid place-items-center text-forest-700 text-sm font-medium">
                  {d.firstName?.[0]}{d.lastName?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">Dr. {d.firstName} {d.lastName}</p>
              <p className="text-xs text-ink/55 mt-0.5">{d.qualifications?.split(',')[0] || d.specialties?.slice(0,2).join(', ')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Stethoscope size={12} className="text-forest-700" />
                <span className="text-xs text-forest-700">{d.yearsOfPractice}+ years</span>
              </div>
            </div>
            <ArrowUpRight size={14} className="text-ink/30 shrink-0" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function Greeting({ name }: { name: string }) {
  const h = new Date().getHours();
  const time = h < 5 ? 'Late evening' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Quiet night';
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <h1 className="font-display text-display-md md:text-display-lg text-forest-900">
        {time}, {name}.
      </h1>
      <span className="text-sm text-ink/55">
        {h < 12 ? 'A calm start.' : h < 17 ? 'A gentle pace.' : 'A still evening.'}
      </span>
    </div>
  );
}

function WellnessScore({ score }: { score: number }) {
  return (
    <Card>
      <CardContent className="py-8 flex items-center gap-6">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="rgba(31,44,37,0.08)" strokeWidth="10" fill="none" />
            <circle
              cx="50" cy="50" r="42"
              stroke="#3f5b46" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 264} 264`}
              fill="none"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-forest-900">
            {score}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-forest-900/55">Wellness score</p>
          <h3 className="mt-1 font-display text-2xl text-forest-900">A gentle, sustained reset.</h3>
          <p className="text-sm text-ink/65 mt-1">Driven by sleep, daily yoga, and your doctor’s last note.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TodayPlan() {
  // Placeholder today's plan — server wires real reminders in v0.2
  const items = [
    { icon: Wind,   label: '4-7-8 breath — 6 rounds', when: '06:30' },
    { icon: Activity, label: 'Hatha sequence — 25 min', when: '07:00' },
    { icon: ChefHat, label: 'Warm lemon water + kitchari base', when: '12:30' },
    { icon: Sparkles, label: 'Sit. Watch the breath. 10 min', when: '21:00' },
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today, gently</CardTitle>
          <Badge variant="forest">4 nudges</Badge>
        </div>
        <CardDescription>A small, doable rhythm.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-cream/60 border border-forest-900/5">
              <div className="size-9 rounded-xl bg-white border border-forest-900/8 grid place-items-center text-forest-700">
                <Icon size={16} />
              </div>
              <p className="flex-1 text-sm text-ink/85">{it.label}</p>
              <span className="text-xs text-forest-900/55 tabular-nums">{it.when}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function DailyInspiration() {
  const quotes = [
    '“The breath is the bridge between the body and the mind.”',
    '“Slow is smooth. Smooth is fast.”',
    '“You do not have to deserve the rest.”',
    '“Tend to the small things. The big things follow.”',
  ];
  const q = quotes[new Date().getDate() % quotes.length];
  return (
    <Card className="bg-gradient-to-br from-clay-100/60 to-forest-50">
      <CardContent className="py-8">
        <p className="text-xs uppercase tracking-[0.18em] text-forest-900/55">Daily inspiration</p>
        <blockquote className="mt-3 font-display text-2xl text-forest-900 text-balance leading-snug">{q}</blockquote>
      </CardContent>
    </Card>
  );
}

function UpcomingEvents({ events }: { events: EventItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming</CardTitle>
          <CardDescription>The next things gently on your calendar.</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/events">View all <ArrowUpRight size={14} /></Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.length === 0 && <p className="text-sm text-ink/55">Nothing scheduled. A still week, often a kind one.</p>}
        {events.slice(0, 3).map((ev) => (
          <Link
            key={ev.id}
            href={`/events`}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-forest-900/8 hover:border-forest-700/30 hover:bg-forest-700/4 transition"
          >
            <div className="size-11 rounded-xl bg-cream border border-forest-900/8 grid place-items-center text-forest-700 shrink-0">
              <Calendar size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{ev.title}</p>
              <p className="text-xs text-ink/55 mt-0.5">
                {formatRelative(ev.startsAt)} · {ev.hostName ?? 'Amal Tamara'}
              </p>
            </div>
            <Badge variant="ghost" className="shrink-0">{ev.kind.replaceAll('_', ' ')}</Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function MessagesPreview({ conversations }: { conversations: Conversation[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Quiet lines from your doctor and team.</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/doctor">Open <ArrowUpRight size={14} /></Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {conversations.length === 0 && (
          <p className="text-sm text-ink/55">No messages yet. When something arises, we’re a tap away.</p>
        )}
        {conversations.slice(0, 3).map((c) => (
          <div key={c.otherId} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-forest-700/4">
            <div className="size-9 rounded-full bg-forest-100 text-forest-800 grid place-items-center">
              <MessageCircle size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink truncate">{c.lastMessage.body ?? 'Voice note'}</p>
              <p className="text-xs text-ink/55">{formatRelative(c.lastMessage.createdAt)}</p>
            </div>
            {c.unread > 0 && (
              <Badge variant="solid" className="shrink-0">{c.unread} new</Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CommunityChips({ communities }: { communities: Community[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your circles</CardTitle>
          <CardDescription>Calm, moderated places to belong.</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/community">All <ArrowUpRight size={14} /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {communities.length === 0 && <p className="text-sm text-ink/55">No circles yet — gentle ones are waiting in the Community tab.</p>}
          {communities.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/community/${c.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-cream border border-forest-900/10 px-3 py-1.5 text-xs text-ink/85 hover:border-forest-700/30 hover:bg-forest-700/4 transition"
            >
              <Heart size={12} className="text-clay-500" /> {c.name}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LibraryPick({ items }: { items: KnowledgeItem[] }) {
  const pick = items[0];
  if (!pick) return null;
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>From the library</CardTitle>
          <Button asChild size="sm" variant="ghost">
            <Link href="/knowledge">Browse <ArrowUpRight size={14} /></Link>
          </Button>
        </div>
        <CardDescription>A quiet read for the moment.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-clay-100 text-clay-800 grid place-items-center">
          <BookOpen size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm uppercase tracking-widest text-forest-900/55">{pick.kind.replaceAll('_', ' ')}</p>
          <p className="font-display text-xl text-forest-900 mt-0.5 leading-snug text-balance">{pick.title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recently on your path</CardTitle>
          <CardDescription>A few quiet milestones.</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/timeline">Open path <ArrowUpRight size={14} /></Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 && <p className="text-sm text-ink/55">Your story will begin to gather here after your first retreat.</p>}
        {events.slice(0, 4).map((e, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-2 mt-2 rounded-full bg-forest-700" />
            <div className="flex-1">
              <p className="text-sm text-ink">{e.title}</p>
              <p className="text-xs text-ink/55">{formatRelative(e.occurredAt)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── The page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { api, user } = useAuth();

  // Live queries — each section degrades gracefully to a skeleton if offline.
  const meQ            = useQuery({ queryKey: ['users','me'],  queryFn: () => api.get<{ id: string; role: string; profile: { firstName?: string; lastName?: string; wellnessScore?: number } | null }>('/users/me') });
  const timelineQ      = useQuery({ queryKey: ['timeline'],     queryFn: () => api.get<TimelineEvent[]>('/wellness-timeline?limit=6') });
  const eventsQ        = useQuery({ queryKey: ['events','upcoming'], queryFn: () => api.get<EventItem[]>('/events?upcoming=true') });
  const messagesQ      = useQuery({ queryKey: ['doctor','conversations'], queryFn: () => api.get<Conversation[]>('/doctor-connect/conversations') });
  const myDoctorsQ     = useQuery({ queryKey: ['doctor','my-doctors'], queryFn: () => api.get<any[]>('/doctor-connect/my-doctors') });
  const myYogaQ        = useQuery({ queryKey: ['my-yoga'], queryFn: () => api.get<any[]>('/doctor-connect/my-yoga') });
  const communitiesQ   = useQuery({ queryKey: ['communities','mine'], queryFn: () => api.get<Community[]>('/communities/mine') });
  const knowledgeQ     = useQuery({ queryKey: ['knowledge','featured'], queryFn: () => api.get<KnowledgeItem[]>('/knowledge/featured') });
  const notificationsQ = useQuery({ queryKey: ['notifications','unread'], queryFn: () => api.get<Notification[]>('/notifications?onlyUnread=true') });

  const name = meQ.data?.profile?.firstName ?? user?.firstName ?? 'Yatri';
  const score = meQ.data?.profile?.wellnessScore ?? 72;

  return (
    <>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <Greeting name={name} />
        <Button asChild variant="ghost" size="sm">
          <Link href="/timeline">View your path <ArrowUpRight size={14} /></Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 min-w-0">
          {meQ.isLoading ? <CardSkeleton /> : <WellnessScore score={score} />}
          <TodayPlan />
          {timelineQ.isLoading ? (
            <CardSkeleton lines={5} />
          ) : (
            <RecentTimeline events={timelineQ.data ?? []} />
          )}
          {eventsQ.isLoading ? (
            <CardSkeleton lines={4} />
          ) : (
            <UpcomingEvents events={eventsQ.data ?? []} />
          )}
        </div>

        <div className="space-y-6 min-w-0">
          <DailyInspiration />
          {myYogaQ.isLoading ? (
            <CardSkeleton lines={3} />
          ) : (
            <DailyYoga items={myYogaQ.data ?? []} />
          )}
          {myDoctorsQ.isLoading ? (
            <CardSkeleton lines={3} />
          ) : (
            <CareTeam doctors={myDoctorsQ.data ?? []} />
          )}
          {messagesQ.isLoading ? (
            <CardSkeleton lines={3} />
          ) : (
            <MessagesPreview conversations={messagesQ.data ?? []} />
          )}
          {communitiesQ.isLoading ? (
            <CardSkeleton lines={2} />
          ) : (
            <CommunityChips communities={communitiesQ.data ?? []} />
          )}
          {knowledgeQ.isLoading ? (
            <CardSkeleton lines={2} />
          ) : (
            <LibraryPick items={knowledgeQ.data ?? []} />
          )}
          {!!(notificationsQ.data && notificationsQ.data.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Quiet reminders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notificationsQ.data.slice(0, 3).map((n) => (
                  <div key={n.id} className="flex items-center gap-3 text-sm">
                    <Bell size={14} className="text-forest-700" />
                    <span>{n.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
