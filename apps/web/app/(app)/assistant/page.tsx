'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Plus, AlertTriangle, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Conv {
  id: string;
  title: string;
  topic?: string | null;
  startedAt: string;
  lastMsgAt: string;
}

interface Msg {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

export default function AssistantPage() {
  const { api } = useAuth();
  const qc = useQueryClient();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState('');
  const scroller = React.useRef<HTMLDivElement>(null);

  const convsQ = useQuery({
    queryKey: ['ai','conversations'],
    queryFn: () => api.get<Conv[]>('/ai-assistant/conversations'),
  });

  const detailQ = useQuery({
    queryKey: ['ai','conversation', activeId],
    queryFn: () => api.get<Conv & { messages: Msg[] }>(`/ai-assistant/conversations/${activeId}`),
    enabled: !!activeId,
  });

  const createM = useMutation({
    mutationFn: (title?: string) => api.post<Conv>('/ai-assistant/conversations', { title, topic: 'wellness' }),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ['ai','conversations'] });
      setActiveId(c.id);
    },
  });

  const sendM = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      api.post<{ content: string }>(`/ai-assistant/conversations/${id}/messages`, { message }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ai','conversation', activeId] });
      setDraft('');
    },
  });

  // Auto-scroll on new messages
  React.useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [detailQ.data?.messages?.length]);

  function send() {
    if (!activeId || !draft.trim()) return;
    sendM.mutate({ id: activeId, message: draft.trim() });
  }

  return (
    <>
      <PageHeader
        eyebrow="AI companion"
        title="A calm, honest voice."
        description="For everyday wellness questions. For diagnosis, prescriptions, or anything urgent — your doctor is the right person. We'll always tell you when that is."
        actions={
          <Button onClick={() => createM.mutate('New conversation')} variant="outline" size="sm">
            <Plus size={14} /> New conversation
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Conversations list */}
        <aside>
          <Card>
            <CardContent className="p-2">
              {convsQ.isLoading && <p className="text-sm text-ink/55 px-3 py-2">Loading…</p>}
              {(convsQ.data ?? []).length === 0 && !convsQ.isLoading && (
                <p className="text-sm text-ink/55 px-3 py-3">Start your first gentle conversation.</p>
              )}
              {(convsQ.data ?? []).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    'w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition',
                    activeId === c.id ? 'bg-forest-700/8 text-forest-900' : 'hover:bg-forest-700/4',
                  )}
                >
                  <MessageSquare size={16} className="mt-0.5 text-forest-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-xs text-ink/55 truncate">{new Date(c.lastMsgAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Conversation */}
        <section>
          <Card className="min-h-[60vh] flex flex-col">
            {!activeId ? (
              <CardContent className="flex-1 grid place-items-center text-center p-12">
                <div>
                  <div className="size-16 rounded-2xl brand-gradient grid place-items-center text-cream mx-auto animate-breathe">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="mt-5 font-display text-2xl text-forest-900">Namaste.</h2>
                  <p className="mt-2 text-ink/70 max-w-sm">Start a gentle conversation — sleep, breath, food, movement, or just how today feels.</p>
                  <Button className="mt-6" onClick={() => createM.mutate('New conversation')}>Begin</Button>
                </div>
              </CardContent>
            ) : (
              <>
                <div ref={scroller} className="flex-1 overflow-y-auto p-5 space-y-4">
                  {(detailQ.data?.messages ?? []).map((m) => {
                    const mine = m.role === 'USER';
                    return (
                      <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                        {!mine && (
                          <Avatar className="size-8 mr-2 mt-1"><AvatarFallback className="bg-forest-100 text-forest-800">🌿</AvatarFallback></Avatar>
                        )}
                        <div className={cn('max-w-[78%] rounded-2xl px-4 py-2.5',
                          mine ? 'bg-forest-700 text-cream' : 'bg-cream border border-forest-900/8 text-ink')}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  {detailQ.isLoading && <p className="text-sm text-ink/55">…</p>}
                </div>
                <div className="border-t border-forest-900/8 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-ink/55">
                    <AlertTriangle size={12} />
                    <span>This companion never diagnoses. When something matters, it will point you to your doctor.</span>
                  </div>
                  <form
                    onSubmit={(e) => { e.preventDefault(); send(); }}
                    className="flex items-end gap-2"
                  >
                    <Textarea
                      rows={2}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a gentle question…"
                      className="resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                    />
                    <Button type="submit" size="icon" disabled={!draft.trim() || sendM.isPending}>
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </section>
      </div>
    </>
  );
}
