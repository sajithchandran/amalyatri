'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sun, Plus, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatRelative } from '@/lib/utils';

export default function YogaRecommendPage() {
  const { api } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    patientUserId: '',
    title: '',
    description: '',
    imageUrl: '',
    durationMin: 15,
    difficulty: 'beginner',
    tags: '',
  });

  const patientsQ = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: () => api.get<any[]>('/doctor-connect/patients'),
  });

  const recsQ = useQuery({
    queryKey: ['doctor', 'yoga-recommendations'],
    queryFn: () => api.get<any[]>('/doctor-connect/yoga-recommendations'),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api.post('/doctor-connect/yoga-recommendations', {
        ...data,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'yoga-recommendations'] });
      setShowForm(false);
      setForm({ patientUserId: '', title: '', description: '', imageUrl: '', durationMin: 15, difficulty: 'beginner', tags: '' });
    },
  });

  const patients = patientsQ.data ?? [];
  const recs = recsQ.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Yoga recommendations</h1>
          <p className="text-sm text-slate-500 mt-1">Recommend daily yoga sessions to your patients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-900 hover:bg-emerald-800">
          <Plus size={16} /> New recommendation
        </Button>
      </div>

      {showForm && (
        <Card className="border-emerald-200">
          <CardHeader><CardTitle className="text-lg">Recommend a yoga session</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
              <div>
                <Label>Patient</Label>
                <select value={form.patientUserId} onChange={(e) => setForm({ ...form, patientUserId: e.target.value })} required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white">
                  <option value="">Select patient…</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Sun Salutation Flow" />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://example.com/yoga-pose.jpg" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Duration (min)</Label>
                  <Input type="number" value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="back pain, morning, gentle" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief instructions or notes…" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending} className="bg-emerald-900 hover:bg-emerald-800">
                  {createMutation.isPending ? 'Saving…' : 'Recommend yoga'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Previous recommendations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recs.map((r: any) => (
          <Card key={r.id} className="overflow-hidden hover:shadow-sm transition-shadow">
            <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
              {r.imageUrl ? (
                <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-slate-300"><Sun size={40} /></div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{r.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {r.patient?.yatriProfile?.firstName} {r.patient?.yatriProfile?.lastName}
                  </p>
                </div>
                <Badge variant="ghost" className="shrink-0">{r.difficulty}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <Clock size={12} /> {r.durationMin} min
                <span className="text-slate-300">·</span>
                <span>{formatRelative(r.date)}</span>
              </div>
              {r.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.tags.map((t: string) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>
                  ))}
                </div>
              )}
              {r.completedAt && (
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                  <CheckCircle2 size={12} /> Completed
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {recs.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-16 text-center">
            <Sun size={40} className="mx-auto text-slate-300" />
            <h2 className="mt-4 text-lg font-medium text-slate-900">No recommendations yet</h2>
            <p className="text-sm text-slate-500 mt-1">Recommend yoga sessions to help your patients stay consistent.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4 bg-emerald-900 hover:bg-emerald-800">
              <Plus size={16} /> New recommendation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
