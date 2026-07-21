'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Mail, Clock, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { CardSkeleton } from '@/components/app/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatRelative, initials } from '@/lib/utils';

export default function MessagesPage() {
  const { api, user } = useAuth();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const convsQ = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get<any[]>('/doctor-connect/conversations'),
    refetchInterval: 5000,
  });

  const threadQ = useQuery({
    queryKey: ['thread', selectedId],
    queryFn: () => api.get<{ other: { id: string; role: string; name: string; avatarUrl?: string | null }; messages: any[] }>(`/doctor-connect/threads/${selectedId}`),
    enabled: !!selectedId,
    refetchInterval: 3000,
  });

  async function sendMessage(body: string) {
    if (!selectedId || !body.trim()) return;
    await api.post('/doctor-connect/messages', { recipientId: selectedId, kind: 'TEXT', body });
    setDraft('');
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threadQ.data?.messages]);

  const conversations = convsQ.data ?? [];
  const messages = threadQ.data?.messages ?? [];
  const otherName = threadQ.data?.other?.name ?? '';
  const isDoctor = threadQ.data?.other?.role !== 'YATRI';

  return (
    <div className="h-[calc(100vh-8rem)] -mx-5 md:-mx-10 flex gap-0">
      {/* Left pane: conversation list */}
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 shrink-0 border-r border-forest-900/8`}>
        <div className="p-4 border-b border-forest-900/5">
          <h1 className="font-display text-xl text-forest-900">Messages</h1>
          <p className="text-xs text-ink/55 mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convsQ.isLoading && <CardSkeleton lines={4} />}
          {conversations.length === 0 && !convsQ.isLoading && (
            <div className="p-8 text-center">
              <Mail size={32} className="mx-auto text-ink/20" />
              <p className="text-sm text-ink/55 mt-3">No conversations yet</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="/doctor">Browse doctors</Link>
              </Button>
            </div>
          )}
          {conversations.map((c: any) => {
            const active = selectedId === c.otherId;
            return (
              <button
                key={c.otherId}
                onClick={() => setSelectedId(c.otherId)}
                className={`w-full text-left px-4 py-4 flex items-center gap-3 transition-colors border-b border-forest-900/5 ${
                  active ? 'bg-forest-700/8 border-l-4 border-l-forest-700' : 'hover:bg-forest-700/4 border-l-4 border-l-transparent'
                }`}
              >
                <Avatar className="size-11 shrink-0">
                  <AvatarFallback className="bg-forest-100 text-forest-800 text-sm">
                    {initials(c.otherName ?? '?')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium text-ink truncate">{c.otherName ?? 'Doctor'}</h3>
                    {c.lastMessage && (
                      <span className="text-[10px] text-ink/40 shrink-0">{formatRelative(c.lastMessage.createdAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm text-ink/60 truncate flex-1">{c.lastMessage?.body ?? 'No messages yet'}</p>
                    {c.unread > 0 && (
                      <Badge variant="solid" className="bg-forest-700 shrink-0 min-w-[20px] h-5 text-[10px] grid place-items-center">
                        {c.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right pane: message thread */}
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedId ? (
          <>
            <div className="px-5 py-4 border-b border-forest-900/5 flex items-center gap-3 shrink-0 bg-cream/80">
              <button onClick={() => setSelectedId(null)} className="md:hidden text-ink/50 hover:text-ink">
                <ArrowLeft size={20} />
              </button>
              <Avatar className="size-10 shrink-0">
                <AvatarFallback className="bg-forest-100 text-forest-800 text-sm">
                  {otherName[0] ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-ink">{otherName}</p>
                <p className="text-xs text-forest-700">{isDoctor ? 'Doctor' : 'Patient'} · Amal Tamara</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {threadQ.isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin size-6 rounded-full border-2 border-forest-700 border-t-transparent" />
                </div>
              )}
              {!threadQ.isLoading && messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-sm text-ink/55">
                  No messages yet. Send a note to your doctor.
                </div>
              )}
              {messages.map((m: any) => {
                const mine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!mine && (
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="bg-forest-100 text-forest-800 text-[10px]">
                          {otherName[0] ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      mine
                        ? 'bg-forest-700 text-cream rounded-br-md'
                        : 'bg-white border border-forest-900/8 text-ink rounded-bl-md'
                    }`}>
                      {m.body && <p className="text-sm leading-relaxed">{m.body}</p>}
                      <p className={`mt-1 text-[10px] flex items-center gap-2 ${mine ? 'text-cream/60' : 'text-ink/45'}`}>
                        <span>{formatRelative(m.createdAt)}</span>
                        {mine && <span>· You</span>}
                        {!mine && isDoctor && <Badge variant="ghost" className="text-[8px]">Doctor</Badge>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(draft); }}
              className="border-t border-forest-900/5 p-4 flex items-end gap-2 shrink-0 bg-cream/50"
            >
              <div className="flex-1">
                <Textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a calm note…"
                  className="resize-none border-forest-900/10 focus:border-forest-700 focus:ring-forest-700/20 bg-white"
                />
              </div>
              <Button type="submit" size="icon" className="bg-forest-700 hover:bg-forest-800" disabled={!draft.trim()}>
                <ArrowUpRight size={16} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto text-ink/15" />
              <h2 className="mt-4 text-lg font-display text-forest-900">Your messages</h2>
              <p className="text-sm text-ink/55 mt-1">Select a conversation to view your thread</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
