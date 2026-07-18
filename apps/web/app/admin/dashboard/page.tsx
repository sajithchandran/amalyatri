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

  // For doctors: get assigned patients. For admins: get all via admin endpoint.
  const patientsQ = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: () => api.get<any[]>('/doctor-connect/patients'),
  });

  const consultationsQ = useQuery({
    queryKey: ['doctor', 'consultations'],
    queryFn: () => api.get<any[]>('/doctor-connect/consultations'),
  });

  const conversationsQ = useQuery({
    queryKey: ['doctor', 'conversations'],
    queryFn: () => api.get<any[]>('/doctor-connect/conversations'),
  });

  const patients = patientsQ.data ?? [];
  const consultations = consultationsQ.data ?? [];
  const conversations = conversationsQ.data ?? [];
  const totalPatients = patients.length;
  const activeConsultations = consultations.filter((c: any) => c.status === 'SCHEDULED' || c.status === 'IN_PROGRESS').length;
  const pendingMessages = conversations.reduce((sum: number, c: any) => sum + (c.unread ?? 0), 0);

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
          label="My patients"
          value={totalPatients}
          icon={Users}
          sub={totalPatients > 0 ? 'Assigned to you' : 'No patients yet'}
        />
        <StatCard
          label="Active consultations"
          value={activeConsultations}
          icon={Stethoscope}
          sub={activeConsultations > 0 ? 'Requires attention' : 'None scheduled'}
        />
        <StatCard
          label="Unread messages"
          value={pendingMessages}
          icon={MessageCircle}
          sub={pendingMessages > 0 ? 'From your patients' : 'All caught up'}
        />
        <StatCard
          label="Conversations"
          value={conversations.length}
          icon={MessageCircle}
          sub="Active threads"
        />
      </div>

      {/* My Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My patients</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">{totalPatients} patient{totalPatients !== 1 ? 's' : ''} assigned to you</p>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/patients">View all <ArrowUpRight size={14} /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto text-slate-300" />
              <p className="text-sm text-slate-500 mt-2">No patients assigned yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {patients.map((p: any) => (
                <div key={p.id} className="flex items-center gap-4 px-4 py-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition">
                  <div className="size-11 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-sm font-medium shrink-0">
                    {p.firstName?.[0]}{p.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{p.firstName} {p.lastName}</p>
                    {p.city && <p className="text-xs text-slate-500">{p.city}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium">{p.wellnessScore}</span>
                        <span className="text-slate-400">score</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{p.consultationCount} consult{p.consultationCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
