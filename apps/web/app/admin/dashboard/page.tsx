'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Stethoscope, MessageCircle, CalendarDays, Activity,
  TrendingUp, ArrowUpRight, Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelative } from '@/lib/utils';

function StatCard({
  label, value, icon: Icon, sub, trend,
}: {
  label: string; value: string | number; icon: any; sub?: string; trend?: 'up' | 'down';
}) {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{value}</p>
            {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
          </div>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center">
            <Icon size={20} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-3 text-xs">
            <TrendingUp size={12} className={trend === 'up' ? 'text-emerald-600' : 'text-rose-500'} />
            <span className={trend === 'up' ? 'text-emerald-600' : 'text-rose-500'}>
              {trend === 'up' ? '+12%' : '-3%'} from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { api, user } = useAuth();

  const kpisQ = useQuery({
    queryKey: ['admin', 'kpis'],
    queryFn: () => api.get<{ totalPatients: number; activeConsultations: number; pendingMessages: number; upcomingEvents: number }>('/admin/kpis'),
  });

  const consultationsQ = useQuery({
    queryKey: ['admin', 'consultations'],
    queryFn: () => api.get<any[]>('/doctor-connect/consultations'),
  });

  const conversationsQ = useQuery({
    queryKey: ['doctor', 'conversations'],
    queryFn: () => api.get<any[]>('/doctor-connect/conversations'),
  });

  const kpis = kpisQ.data;
  const consultations = consultationsQ.data ?? [];
  const conversations = conversationsQ.data ?? [];

  const name = user?.firstName ?? 'Staff';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-wider text-emerald-700 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 mt-1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {name}.
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s your practice at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total patients"
          value={kpis?.totalPatients ?? '—'}
          icon={Users}
          trend="up"
        />
        <StatCard
          label="Active consultations"
          value={kpis?.activeConsultations ?? '—'}
          icon={Stethoscope}
          sub="Requires attention"
        />
        <StatCard
          label="Unread messages"
          value={kpis?.pendingMessages ?? '—'}
          icon={MessageCircle}
          trend="up"
        />
        <StatCard
          label="Upcoming events"
          value={kpis?.upcomingEvents ?? '—'}
          icon={CalendarDays}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent consultations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent consultations</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">Latest patient interactions</p>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/consultations">View all <ArrowUpRight size={14} /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <div className="text-center py-8">
                <Activity size={32} className="mx-auto text-slate-300" />
                <p className="text-sm text-slate-500 mt-2">No consultations yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {consultations.slice(0, 5).map((c: any) => (
                  <div key={c.id} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition">
                    <div className="size-9 rounded-full bg-slate-100 text-slate-600 grid place-items-center text-sm font-medium">
                      {(c.patientName ?? '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{c.patientName ?? 'Unknown patient'}</p>
                      <p className="text-xs text-slate-500">{c.mode?.replaceAll('_', ' ')} · {c.scheduledFor ? formatRelative(c.scheduledFor) : 'Follow-up'}</p>
                    </div>
                    <Badge variant={c.status === 'COMPLETED' ? 'forest' : c.status === 'IN_PROGRESS' ? 'solid' : 'ghost'}>
                      {c.status?.replaceAll('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent messages</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">From your patients</p>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/doctor">Open inbox <ArrowUpRight size={14} /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={32} className="mx-auto text-slate-300" />
                <p className="text-sm text-slate-500 mt-2">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 5).map((c: any) => (
                  <div key={c.otherId} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition">
                    <div className="size-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-sm font-medium">
                      {(c.otherName ?? '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{c.otherName ?? 'Unknown'}</p>
                      <p className="text-xs text-slate-500 truncate">{c.lastMessage?.body ?? 'Voice note'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">{c.lastMessage ? formatRelative(c.lastMessage.createdAt) : ''}</p>
                      {c.unread > 0 && (
                        <Badge variant="solid" className="mt-1">{c.unread} new</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <CardContent className="py-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-medium">Quick actions</h3>
            <p className="text-sm text-emerald-200/80 mt-0.5">Common tasks at your fingertips</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary" size="sm" className="bg-white/15 hover:bg-white/25 text-white border-0">
              <Link href="/doctor"><MessageCircle size={14} /> New message</Link>
            </Button>
            <Button asChild variant="secondary" size="sm" className="bg-white/15 hover:bg-white/25 text-white border-0">
              <Link href="/admin/consultations"><Stethoscope size={14} /> Add consultation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
