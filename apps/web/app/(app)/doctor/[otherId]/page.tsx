'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Mic, Image as ImageIcon, FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatRelative, initials } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  kind: 'TEXT' | 'VOICE' | 'IMAGE' | 'DOCUMENT';
  body?: string | null;
  mediaUrl?: string | null;
  createdAt: string;
  readAt?: string | null;
}

interface Thread {
  other: { id: string; role: string; name: string; avatarUrl?: string | null };
  messages: Message[];
}

export default function ThreadPage() {
  const { otherId } = useParams<{ otherId: string }>();
  const { api, user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = React.useState('');

  const threadQ = useQuery({
    queryKey: ['thread', otherId],
    queryFn: () => api.get<Thread>(`/doctor-connect/threads/${otherId}`),
    enabled: !!otherId,
    refetchInterval: 8000,
  });

  const sendM = useMutation({
    mutationFn: (body: string) => api.post<Message>('/doctor-connect/messages', { recipientId: otherId, kind: 'TEXT', body }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['thread', otherId] }); setDraft(''); },
  });

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
        <Link href="/doctor"><ArrowLeft size={14} /> Back to doctor</Link>
      </Button>

      <PageHeader
        eyebrow="Thread"
        title={threadQ.data?.other?.name ?? '…'}
        description="Send a short note. Voice notes, images, and documents are supported."
        actions={threadQ.data?.other?.role !== 'YATRI' ? <Badge variant="forest">Verified</Badge> : undefined}
      />

      <div className="grid gap-4">
        <Card>
          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-y-auto p-5 space-y-4">
              {threadQ.isLoading && <p className="text-sm text-ink/55">Loading thread…</p>}
              {(threadQ.data?.messages ?? []).map((m) => {
                const mine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${mine ? 'bg-forest-700 text-cream' : 'bg-cream border border-forest-900/8 text-ink'}`}>
                      {m.kind === 'VOICE' && (
                        <p className="text-xs italic flex items-center gap-2"><Mic size={14} /> Voice note</p>
                      )}
                      {m.kind === 'IMAGE' && m.mediaUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.mediaUrl} alt="" className="rounded-lg max-h-72 object-cover" />
                      )}
                      {m.kind === 'DOCUMENT' && (
                        <p className="text-xs flex items-center gap-2"><FileText size={14} /> Document</p>
                      )}
                      {m.body && <p className="text-sm leading-relaxed">{m.body}</p>}
                      <p className={`mt-1 text-[10px] ${mine ? 'text-cream/70' : 'text-ink/50'}`}>
                        {formatRelative(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                sendM.mutate(draft.trim());
              }}
              className="border-t border-forest-900/8 p-4 flex items-end gap-2"
            >
              <div className="flex-1">
                <Textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a calm note…"
                  className="resize-none"
                />
                <div className="mt-2 flex items-center gap-2 text-ink/55">
                  <button type="button" aria-label="Voice note" className="hover:text-forest-700"><Mic size={16} /></button>
                  <button type="button" aria-label="Image"       className="hover:text-forest-700"><ImageIcon size={16} /></button>
                  <button type="button" aria-label="Document"    className="hover:text-forest-700"><FileText size={16} /></button>
                  <span className="ml-auto text-[10px] flex items-center gap-1">
                    <AlertTriangle size={11} /> AI-assisted replies enabled
                  </span>
                </div>
              </div>
              <Button type="submit" size="icon" disabled={!draft.trim() || sendM.isPending}>
                <Send size={16} />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
