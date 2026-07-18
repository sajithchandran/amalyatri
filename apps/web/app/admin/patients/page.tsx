'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Users, Mail, MapPin, MessageCircle, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelative } from '@/lib/utils';

export default function PatientsPage() {
  const { api, user } = useAuth();

  const patientsQ = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: () => api.get<any[]>('/doctor-connect/patients'),
  });

  const patients = patientsQ.data ?? [];
  const loading = patientsQ.isLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin size-8 rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My patients</h1>
        <p className="text-sm text-slate-500 mt-1">
          {patients.length} patient{patients.length !== 1 ? 's' : ''} assigned to you
        </p>
      </div>

      {patients.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users size={40} className="mx-auto text-slate-300" />
            <h2 className="mt-4 text-lg font-medium text-slate-900">No patients yet</h2>
            <p className="text-sm text-slate-500 mt-1">Patients will appear here once assigned to you.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {patients.map((p: any) => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-5">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="size-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xl font-medium shrink-0">
                    {p.firstName?.[0]}{p.lastName?.[0]}
                  </div>

                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="text-base font-medium text-slate-900">
                          {p.firstName} {p.lastName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                          {p.city && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {p.city}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {p.email}
                          </span>
                        </div>
                      </div>

                      {/* Wellness score */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Wellness</p>
                          <p className="text-lg font-semibold text-emerald-700">{p.wellnessScore}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MessageCircle size={14} className="text-slate-400" />
                        {p.consultationCount} consultation{p.consultationCount !== 1 ? 's' : ''}
                      </div>

                      {p.lastMessage && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Activity size={14} className="text-slate-400" />
                          Last message {formatRelative(p.lastMessage.createdAt)}
                        </div>
                      )}

                      {p.notes && (
                        <Badge variant="ghost" className="text-[10px]">
                          {p.notes}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/doctor/${p.id}`}>
                        <MessageCircle size={14} /> Message
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary card */}
      <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <CardContent className="py-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-300" />
            <div>
              <p className="text-sm font-medium">Patient summary</p>
              <p className="text-xs text-emerald-200/80">
                {patients.reduce((sum: number, p: any) => sum + p.wellnessScore, 0) > 0
                  ? `Average wellness score: ${Math.round(patients.reduce((sum: number, p: any) => sum + p.wellnessScore, 0) / patients.length)}`
                  : 'No wellness data yet'}
              </p>
            </div>
          </div>
          <Badge variant="solid" className="bg-white/15 text-white">
            {patients.length} total
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
