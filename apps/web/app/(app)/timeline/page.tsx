'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, Award, Calendar as CalendarIcon, Heart, Leaf, Sparkles, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Retreat, TimelineEvent, WellnessGoal } from '@/lib/types';

const KIND_META: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; tone: string; label: string }> = {
  RETREAT:            { icon: CalendarIcon, tone: 'bg-clay-100 text-clay-800',    label: 'Retreat' },
  PANCHAKARMA_STAGE:  { icon: Leaf,         tone: 'bg-forest-100 text-forest-800', label: 'Panchakarma' },
  ASSESSMENT:         { icon: Stethoscope,  tone: 'bg-sun-100 text-sun-800',      label: 'Assessment' },
  GOAL:               { icon: Sparkles,     tone: 'bg-sun-100 text-sun-800',      label: 'Goal' },
  YOGA_SESSION:       { icon: Activity,     tone: 'bg-forest-100 text-forest-800', label: 'Yoga' },
  MEDITATION_SESSION: { icon: Sparkles,     tone: 'bg-forest-100 text-forest-800', label: 'Meditation' },
  MEAL:               { icon: Leaf,         tone: 'bg-clay-100 text-clay-800',    label: 'Meal' },
  MEDICINE:           { icon: Heart,        tone: 'bg-rose-100 text-rose-700',    label: 'Medicine' },
  DOCTOR_NOTE:        { icon: Stethoscope,  tone: 'bg-sun-100 text-sun-800',      label: 'Doctor' },
  ACHIEVEMENT:        { icon: Award,        tone: 'bg-clay-100 text-clay-800',    label: 'Milestone' },
  WEIGHT:             { icon: Activity,     tone: 'bg-forest-100 text-forest-800', label: 'Progress' },
};

function EventIcon({ type }: { type?: string }) {
  const meta = KIND_META[type ?? ''] ?? { icon: Sparkles, tone: 'bg-cream text-forest-800', label: 'Note' };
  const Icon = meta.icon;
  return (
    <div className={`size-10 shrink-0 rounded-xl grid place-items-center ${meta.tone}`}>
      <Icon size={16} />
    </div>
  );
}

function groupByYear(items: Array<{ occurredAt: string } & Record<string, unknown>>) {
  const m = new Map<number, typeof items>();
  for (const it of items) {
    const y = new Date(it.occurredAt).getFullYear();
    if (!m.has(y)) m.set(y, []);
    m.get(y)!.push(it);
  }
  return Array.from(m.entries()).sort((a, b) => b[0] - a[0]);
}

export default function TimelinePage() {
  const { api } = useAuth();
  const timelineQ = useQuery({
    queryKey: ['timeline','all'],
    queryFn:  () => api.get<TimelineEvent[]>('/wellness-timeline?limit=200'),
  });
  const retreatsQ = useQuery({
    queryKey: ['retreats'],
    queryFn:  () => api.get<Retreat[]>('/wellness-timeline/retreats'),
  });
  const goalsQ = useQuery({
    queryKey: ['goals'],
    queryFn:  () => api.get<WellnessGoal[]>('/wellness-timeline/goals'),
  });

  const events = timelineQ.data ?? [];
  const goals  = goalsQ.data ?? [];

  const activeGoals   = goals.filter((g) => g.status === 'ACTIVE');
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED');
  const groups = groupByYear(events as any);

  return (
    <>
      <PageHeader
        eyebrow="Your wellness path"
        title="The story so far."
        description="Every retreat, every small milestone, every quiet day. Kept for you, gently, for life."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/assistant">Ask the AI to summarise</Link>
          </Button>
        }
      />

      {/* Goals summary */}
      <section className="mb-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-widest">Active goals</CardDescription>
            <CardTitle className="text-3xl">{activeGoals.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ink/65">
            {activeGoals.length === 0 ? 'No active goals — a clear runway.' : activeGoals.slice(0, 2).map((g) => (
              <div key={g.id} className="truncate">{g.title}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-widest">Completed</CardDescription>
            <CardTitle className="text-3xl">{completedGoals.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ink/65">
            Small wins, gathered.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-widest">Retreats</CardDescription>
            <CardTitle className="text-3xl">{retreatsQ.data?.length ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ink/65">
            Kerala + the world beyond.
          </CardContent>
        </Card>
      </section>

      {/* Active goals */}
      {activeGoals.length > 0 && (
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Active goals</CardTitle>
              <CardDescription>What you’re tending right now.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeGoals.map((g) => {
                const pct = g.targetValue && g.currentValue
                  ? Math.min(100, Math.round(((g.currentValue ?? 0) / g.targetValue) * 100))
                  : null;
                return (
                  <div key={g.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-ink">{g.title}</p>
                      <p className="text-xs text-ink/55">
                        {g.currentValue ?? 0}{g.unit ? ` ${g.unit}` : ''} / {g.targetValue ?? '—'}{g.unit ? ` ${g.unit}` : ''}
                      </p>
                    </div>
                    {pct !== null && (
                      <div className="mt-2 h-1.5 rounded-full bg-forest-900/8 overflow-hidden">
                        <div className="h-full bg-forest-700 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Year-grouped timeline */}
      <section>
        {timelineQ.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} lines={1} />)}
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-ink/60">
              Your timeline will begin after your first retreat.
            </CardContent>
          </Card>
        ) : (
          groups.map(([year, items]) => (
            <div key={year} className="mb-10">
              <h3 className="text-xs uppercase tracking-[0.2em] text-forest-900/55 mb-3">{year}</h3>
              <ol className="space-y-3 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-forest-900/10">
                {items.map((e: any, i) => {
                  const meta = KIND_META[e.type ?? ''] ?? { label: 'Note' };
                  return (
                    <li key={i} className="flex items-start gap-4 pl-1">
                      <EventIcon type={e.type} />
                      <Card className="flex-1">
                        <CardContent className="py-5">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="font-display text-lg text-forest-900 text-balance">{e.title}</p>
                            <Badge variant="ghost" className="shrink-0">{meta.label}</Badge>
                          </div>
                          {e.description && (
                            <p className="mt-1 text-sm text-ink/70 text-pretty">{e.description}</p>
                          )}
                          <div className="mt-2 flex items-center gap-3 text-xs text-ink/55">
                            <span>{formatDate(e.occurredAt)}</span>
                            {e.metricName && e.metricValue != null && (
                              <span>
                                {e.metricName}: <b className="text-forest-900">{e.metricValue}{e.metricUnit ? ` ${e.metricUnit}` : ''}</b>
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))
        )}
      </section>
    </>
  );
}
