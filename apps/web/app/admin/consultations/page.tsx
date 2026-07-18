'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stethoscope, Plus, CalendarDays, Video, Phone, MessageCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatRelative } from '@/lib/utils';

const MODE_ICONS: Record<string, any> = {
  VIDEO: Video,
  PHONE: Phone,
  CHAT: MessageCircle,
  IN_PERSON: CalendarDays,
};

const MODE_LABELS: Record<string, string> = {
  VIDEO: 'Video call',
  PHONE: 'Phone call',
  CHAT: 'Chat',
  IN_PERSON: 'In person',
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
  REQUESTED: 'bg-purple-100 text-purple-700',
};

export default function ConsultationsPage() {
  const { api } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    patientUserId: '',
    mode: 'VIDEO' as string,
    scheduledFor: '',
    patientNote: '',
    doctorNote: '',
  });

  // Fetch consultations
  const consultationsQ = useQuery({
    queryKey: ['doctor', 'consultations'],
    queryFn: () => api.get<any[]>('/doctor-connect/doctor-consultations'),
  });

  // Fetch patients for the dropdown
  const patientsQ = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: () => api.get<any[]>('/doctor-connect/patients'),
  });

  // Create consultation mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      api.post('/doctor-connect/doctor-consultations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'consultations'] });
      setShowForm(false);
      setFormData({ patientUserId: '', mode: 'VIDEO', scheduledFor: '', patientNote: '', doctorNote: '' });
    },
  });

  const consultations = consultationsQ.data ?? [];
  const patients = patientsQ.data ?? [];

  if (consultationsQ.isLoading || patientsQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin size-8 rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  // Split into upcoming and past
  const now = new Date();
  const upcoming = consultations.filter((c: any) =>
    c.status === 'SCHEDULED' || c.status === 'REQUESTED' || c.status === 'IN_PROGRESS'
  );
  const past = consultations.filter((c: any) =>
    c.status === 'COMPLETED' || c.status === 'CANCELLED'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Consultations</h1>
          <p className="text-sm text-slate-500 mt-1">
            {upcoming.length} upcoming · {past.length} completed
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-900 hover:bg-emerald-800">
          <Plus size={16} /> New consultation
        </Button>
      </div>

      {/* New consultation form */}
      {showForm && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg">Schedule a consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div>
                <Label>Patient</Label>
                <select
                  value={formData.patientUserId}
                  onChange={(e) => setFormData({ ...formData, patientUserId: e.target.value })}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-600 focus:ring-emerald-600/20 bg-white"
                >
                  <option value="">Select a patient…</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.city || 'Unknown'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Mode</Label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-600 focus:ring-emerald-600/20 bg-white"
                  >
                    <option value="VIDEO">Video call</option>
                    <option value="PHONE">Phone call</option>
                    <option value="CHAT">Chat</option>
                    <option value="IN_PERSON">In person</option>
                  </select>
                </div>
                <div>
                  <Label>Scheduled for</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Patient note (reason for consultation)</Label>
                <Textarea
                  value={formData.patientNote}
                  onChange={(e) => setFormData({ ...formData, patientNote: e.target.value })}
                  placeholder="e.g. Follow-up on sleep issues"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Doctor note (internal)</Label>
                <Textarea
                  value={formData.doctorNote}
                  onChange={(e) => setFormData({ ...formData, doctorNote: e.target.value })}
                  placeholder="Your private notes for this consultation"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} className="bg-emerald-900 hover:bg-emerald-800">
                  {createMutation.isPending ? 'Scheduling…' : 'Schedule consultation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming consultations */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Clock size={16} /> Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-2">
            {upcoming.map((c: any) => {
              const ModeIcon = MODE_ICONS[c.mode] || MessageCircle;
              return (
                <Card key={c.id} className="border-l-4 border-l-emerald-500">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-slate-100 text-slate-600 grid place-items-center text-sm font-medium shrink-0">
                        {(c.patient?.yatriProfile?.firstName ?? '?')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {c.patient?.yatriProfile?.firstName ?? 'Unknown'} {c.patient?.yatriProfile?.lastName ?? ''}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><ModeIcon size={12} /> {MODE_LABELS[c.mode] || c.mode}</span>
                          {c.scheduledFor && (
                            <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatRelative(c.scheduledFor)}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[c.status] || ''}>
                        {c.status?.replaceAll('_', ' ')}
                      </Badge>
                    </div>
                    {c.patientNote && (
                      <p className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                        {c.patientNote}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past consultations */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} /> Past ({past.length})
          </h2>
          <div className="space-y-2">
            {past.map((c: any) => {
              const ModeIcon = MODE_ICONS[c.mode] || MessageCircle;
              const isComplete = c.status === 'COMPLETED';
              return (
                <Card key={c.id} className={`border-l-4 ${isComplete ? 'border-l-emerald-500' : 'border-l-slate-300'}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-slate-100 text-slate-600 grid place-items-center text-sm font-medium shrink-0">
                        {(c.patient?.yatriProfile?.firstName ?? '?')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {c.patient?.yatriProfile?.firstName ?? 'Unknown'} {c.patient?.yatriProfile?.lastName ?? ''}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><ModeIcon size={12} /> {MODE_LABELS[c.mode] || c.mode}</span>
                          {c.scheduledFor && (
                            <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatRelative(c.scheduledFor)}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[c.status] || ''}>
                        {isComplete ? <><CheckCircle2 size={12} /> Completed</> : <><XCircle size={12} /> {c.status}</>}
                      </Badge>
                    </div>
                    {c.doctorNote && (
                      <p className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-slate-600">Notes: </span>{c.doctorNote}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {consultations.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-16 text-center">
            <Stethoscope size={40} className="mx-auto text-slate-300" />
            <h2 className="mt-4 text-lg font-medium text-slate-900">No consultations yet</h2>
            <p className="text-sm text-slate-500 mt-1">Schedule your first consultation with a patient.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4 bg-emerald-900 hover:bg-emerald-800">
              <Plus size={16} /> New consultation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
