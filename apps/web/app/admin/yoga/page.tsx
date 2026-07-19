'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sun, Plus, Clock, Trash2, CheckCircle2, X, Image, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatRelative } from '@/lib/utils';

export default function YogaPage() {
  const { api } = useAuth();
  const queryClient = useQueryClient();

  // Tabs: catalog | recommend
  const [tab, setTab] = React.useState<'catalog' | 'recommend'>('catalog');

  // Master catalog state
  const [showPoseForm, setShowPoseForm] = React.useState(false);
  const [poseForm, setPoseForm] = React.useState({ title: '', imageUrl: '', description: '', durationMin: 15, difficulty: 'beginner', tags: '' });

  // Recommendation state
  const [showRecForm, setShowRecForm] = React.useState(false);
  const [recForm, setRecForm] = React.useState({ patientUserId: '', poseIds: [] as string[], note: '' });

  // Queries
  const posesQ = useQuery({ queryKey: ['yoga-poses'], queryFn: () => api.get<any[]>('/doctor-connect/yoga-poses') });
  const patientsQ = useQuery({ queryKey: ['doctor', 'patients'], queryFn: () => api.get<any[]>('/doctor-connect/patients') });
  const recsQ = useQuery({ queryKey: ['doctor', 'yoga-recommendations'], queryFn: () => api.get<any[]>('/doctor-connect/yoga-recommendations') });

  // Mutations
  const createPose = useMutation({
    mutationFn: (data: typeof poseForm) => api.post('/doctor-connect/yoga-poses', { ...data, tags: data.tags.split(',').map(t => t.trim()).filter(Boolean) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['yoga-poses'] }); setShowPoseForm(false); setPoseForm({ title: '', imageUrl: '', description: '', durationMin: 15, difficulty: 'beginner', tags: '' }); },
  });

  const deletePose = useMutation({
    mutationFn: (id: string) => api.del(`/doctor-connect/yoga-poses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['yoga-poses'] }),
  });

  const createRec = useMutation({
    mutationFn: (data: typeof recForm) => api.post('/doctor-connect/yoga-recommendations', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['doctor', 'yoga-recommendations'] }); setShowRecForm(false); setRecForm({ patientUserId: '', poseIds: [], note: '' }); },
  });

  const poses = posesQ.data ?? [];
  const patients = patientsQ.data ?? [];
  const recs = recsQ.data ?? [];

  const togglePose = (id: string) => {
    setRecForm((prev) => ({
      ...prev,
      poseIds: prev.poseIds.includes(id) ? prev.poseIds.filter((p) => p !== id) : [...prev.poseIds, id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Yoga</h1>
          <p className="text-sm text-slate-500 mt-1">Master catalog & patient recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant={tab === 'catalog' ? 'primary' : 'outline'} onClick={() => setTab('catalog')} className={tab === 'catalog' ? 'bg-emerald-900' : ''}>
            <BookOpen size={16} /> Catalog
          </Button>
          <Button variant={tab === 'recommend' ? 'primary' : 'outline'} onClick={() => setTab('recommend')} className={tab === 'recommend' ? 'bg-emerald-900' : ''}>
            <Sun size={16} /> Recommend
          </Button>
        </div>
      </div>

      {/* ═══════════════════ CATALOG TAB ═══════════════════ */}
      {tab === 'catalog' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{poses.length} pose{poses.length !== 1 ? 's' : ''} in catalog</p>
            <Button onClick={() => setShowPoseForm(!showPoseForm)} size="sm" variant="outline">
              <Plus size={14} /> {showPoseForm ? 'Cancel' : 'Add pose'}
            </Button>
          </div>

          {showPoseForm && (
            <Card className="border-emerald-200">
              <CardHeader><CardTitle className="text-lg">Add yoga pose to catalog</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); createPose.mutate(poseForm); }} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Title *</Label>
                      <Input value={poseForm.title} onChange={(e) => setPoseForm({ ...poseForm, title: e.target.value })} required placeholder="e.g. Sun Salutation" />
                    </div>
                    <div>
                      <Label>Image URL *</Label>
                      <Input value={poseForm.imageUrl} onChange={(e) => setPoseForm({ ...poseForm, imageUrl: e.target.value })} required placeholder="https://example.com/pose.jpg" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Duration (min)</Label>
                      <Input type="number" value={poseForm.durationMin} onChange={(e) => setPoseForm({ ...poseForm, durationMin: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <select value={poseForm.difficulty} onChange={(e) => setPoseForm({ ...poseForm, difficulty: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Input value={poseForm.tags} onChange={(e) => setPoseForm({ ...poseForm, tags: e.target.value })} placeholder="morning, back, gentle" />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={poseForm.description} onChange={(e) => setPoseForm({ ...poseForm, description: e.target.value })} rows={2} />
                  </div>
                  {poseForm.imageUrl && (
                    <div className="aspect-[16/9] max-h-40 rounded-xl overflow-hidden bg-slate-100">
                      <img src={poseForm.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                  <div className="flex gap-3 justify-end">
                    <Button type="submit" disabled={createPose.isPending} className="bg-emerald-900 hover:bg-emerald-800">
                      {createPose.isPending ? 'Adding…' : 'Add to catalog'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Catalog grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {poses.map((p: any) => (
              <Card key={p.id} className="overflow-hidden group hover:shadow-sm transition-shadow">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <button
                    onClick={() => deletePose.mutate(p.id)}
                    className="absolute top-2 right-2 size-8 rounded-full bg-white/80 text-slate-500 hover:bg-rose-50 hover:text-rose-600 grid place-items-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-slate-900">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <Clock size={12} /> {p.durationMin} min
                    <Badge variant="ghost" className="text-[10px]">{p.difficulty}</Badge>
                  </div>
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.map((t: string) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {poses.length === 0 && !showPoseForm && (
            <Card><CardContent className="py-16 text-center">
              <Image size={40} className="mx-auto text-slate-300" />
              <h2 className="mt-4 text-lg font-medium text-slate-900">No poses yet</h2>
              <p className="text-sm text-slate-500 mt-1">Add yoga poses to the master catalog first.</p>
              <Button onClick={() => setShowPoseForm(true)} className="mt-4 bg-emerald-900"><Plus size={16} /> Add pose</Button>
            </CardContent></Card>
          )}
        </>
      )}

      {/* ═══════════════════ RECOMMEND TAB ═══════════════════ */}
      {tab === 'recommend' && (
        <>
          <Button onClick={() => setShowRecForm(!showRecForm)}>
            <Plus size={16} /> {showRecForm ? 'Cancel' : 'New recommendation'}
          </Button>

          {showRecForm && (
            <Card className="border-emerald-200">
              <CardHeader><CardTitle className="text-lg">Recommend yoga to a patient</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); createRec.mutate(recForm); }} className="space-y-4">
                  <div>
                    <Label>Patient</Label>
                    <select value={recForm.patientUserId} onChange={(e) => setRecForm({ ...recForm, patientUserId: e.target.value })} required
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white">
                      <option value="">Select patient…</option>
                      {patients.map((p: any) => (<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>))}
                    </select>
                  </div>

                  <div>
                    <Label>Select poses (from catalog — {poses.length} available)</Label>
                    {poses.length === 0 ? (
                      <p className="text-sm text-amber-600 mt-1">No poses in catalog. Add some in the Catalog tab first.</p>
                    ) : (
                      <div className="mt-2 grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto">
                        {poses.map((p: any) => {
                          const selected = recForm.poseIds.includes(p.id);
                          return (
                            <button
                              type="button"
                              key={p.id}
                              onClick={() => togglePose(p.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                                selected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="size-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                <img src={p.imageUrl} alt={p.title} className="size-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">{p.title}</p>
                                <p className="text-xs text-slate-500">{p.durationMin} min · {p.difficulty}</p>
                              </div>
                              <div className={`size-6 rounded-full border-2 grid place-items-center shrink-0 ${
                                selected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                              }`}>
                                {selected && <CheckCircle2 size={14} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {recForm.poseIds.length > 0 && (
                      <p className="text-xs text-emerald-700 mt-2">{recForm.poseIds.length} pose{recForm.poseIds.length !== 1 ? 's' : ''} selected</p>
                    )}
                  </div>

                  <div>
                    <Label>Note (optional)</Label>
                    <Textarea value={recForm.note} onChange={(e) => setRecForm({ ...recForm, note: e.target.value })} rows={2} placeholder="e.g. Focus on slow breathing with each movement" />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowRecForm(false)}>Cancel</Button>
                    <Button type="submit" disabled={createRec.isPending || recForm.poseIds.length === 0} className="bg-emerald-900 hover:bg-emerald-800">
                      {createRec.isPending ? 'Saving…' : `Recommend ${recForm.poseIds.length} pose${recForm.poseIds.length !== 1 ? 's' : ''}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Past recommendations */}
          <div className="space-y-4 mt-6">
            {recs.map((r: any) => (
              <Card key={r.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        For {r.patient?.yatriProfile?.firstName} {r.patient?.yatriProfile?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{formatRelative(r.date)} · {r.poses?.length || 0} poses</p>
                    </div>
                    {r.completedAt && <Badge variant="solid" className="bg-emerald-600">Completed</Badge>}
                  </div>

                  {r.note && <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 mb-3">{r.note}</p>}

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(r.poses || []).map((rp: any) => (
                      <div key={rp.poseId} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                        <div className="size-12 rounded-lg overflow-hidden bg-white shrink-0">
                          <img src={rp.pose?.imageUrl} alt={rp.pose?.title} className="size-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{rp.pose?.title}</p>
                          <p className="text-xs text-slate-500">{rp.pose?.durationMin} min · {rp.pose?.difficulty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {recs.length === 0 && !showRecForm && (
              <Card><CardContent className="py-16 text-center">
                <Sun size={40} className="mx-auto text-slate-300" />
                <h2 className="mt-4 text-lg font-medium text-slate-900">No recommendations yet</h2>
                <p className="text-sm text-slate-500 mt-1">Add poses to the catalog, then recommend them to patients.</p>
              </CardContent></Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
