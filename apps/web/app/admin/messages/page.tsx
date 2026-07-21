'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Mail, Clock, ArrowLeft, Mic, Image as ImageIcon, FileText, AlertTriangle, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatRelative, initials } from '@/lib/utils';

export default function AdminMessagesPage() {
  const { api, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Conversations list
  const convsQ = useQuery({
    queryKey: ['doctor', 'conversations'],
    queryFn: () => api.get<any[]>('/doctor-connect/conversations'),
    refetchInterval: 5000,
  });

  // Selected thread
  const threadQ = useQuery({
    queryKey: ['thread', selectedId],
    queryFn: () => api.get<{ other: { id: string; role: string; name: string; avatarUrl?: string | null }; messages: any[] }>(`/doctor-connect/threads/${selectedId}`),
    enabled: !!selectedId,
    refetchInterval: 3000,
  });

  const sendM = useMutation({
    mutationFn: (body: string) => api.post('/doctor-connect/messages', { recipientId: selectedId, kind: 'TEXT', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'conversations'] });
      setDraft('');
    },
  });

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threadQ.data?.messages]);

  const conversations = convsQ.data ?? [];
  const messages = threadQ.data?.messages ?? [];
  const otherName = threadQ.data?.other?.name ?? '';

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-0 -m-6">
      {/* ── Left pane: conversation list ── */}
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 shrink-0 border-r border-slate-200 bg-white`}>
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
          <p className="text-xs text-slate-500 mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <div className="p-8 text-center">
              <Mail size={32} className="mx-auto text-slate-300" />
              <p className="text-sm text-slate-500 mt-3">No conversations yet</p>
            </div>
          )}

          {conversations.map((c: any) => {
            const active = selectedId === c.otherId;
            return (
              <button
                key={c.otherId}
                onClick={() => setSelectedId(c.otherId)}
                className={`w-full text-left px-4 py-4 flex items-center gap-3 transition-colors border-b border-slate-50 ${
                  active ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-base font-medium shrink-0">
                  {(c.otherName ?? '?')[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium text-slate-900 truncate">{c.otherName ?? 'Patient'}</h3>
                    {c.lastMessage && (
                      <span className="text-[10px] text-slate-400 shrink-0">{formatRelative(c.lastMessage.createdAt)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm text-slate-500 truncate flex-1">{c.lastMessage?.body ?? 'No messages yet'}</p>
                    {c.unread > 0 && (
                      <Badge variant="solid" className="bg-emerald-600 shrink-0 min-w-[20px] h-5 text-[10px] grid place-items-center">
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

      {/* ── Right pane: message thread ── */}
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
        {selectedId ? (
          <>
            {/* Thread header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
              <button onClick={() => setSelectedId(null)} className="md:hidden text-slate-500 hover:text-slate-700">
                <ArrowLeft size={20} />
              </button>
              <div className="size-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-sm font-medium">
                {otherName[0] ?? '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{otherName}</p>
                <p className="text-xs text-emerald-600">Online</p>
              </div>
              <div className="ml-auto text-xs text-slate-400">
                {threadQ.data?.other?.role !== 'YATRI' ? 'Doctor' : 'Patient'}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {threadQ.isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin size-6 rounded-full border-2 border-emerald-600 border-t-transparent" />
                </div>
              )}
              {!threadQ.isLoading && messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">
                  No messages yet. Send a note to start the conversation.
                </div>
              )}
              {messages.map((m: any) => {
                const mine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!mine && (
                      <div className="size-7 rounded-full bg-slate-100 text-slate-500 grid place-items-center text-[10px] font-medium shrink-0">
                        {otherName[0] ?? '?'}
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      mine
                        ? 'bg-emerald-900 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-900 rounded-bl-md'
                    }`}>
                      {m.kind === 'VOICE' && <p className="text-xs italic flex items-center gap-2"><Mic size={14} /> Voice note</p>}
                      {m.kind === 'IMAGE' && m.mediaUrl && (
                        <img src={m.mediaUrl} alt="" className="rounded-lg max-h-60 object-cover" />
                      )}
                      {m.kind === 'DOCUMENT' && <p className="text-xs flex items-center gap-2"><FileText size={14} /> Document</p>}
                      {m.body && <p className="text-sm leading-relaxed">{m.body}</p>}
                      <p className={`mt-1 text-[10px] ${mine ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {formatRelative(m.createdAt)}
                        {mine && ' · You'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply input */}
            <form
              onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; sendM.mutate(draft.trim()); }}
              className="border-t border-slate-100 p-4 flex items-end gap-2 shrink-0"
            >
              <div className="flex-1">
                <Textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="resize-none border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20"
                />
                <div className="mt-2 flex items-center gap-2 text-slate-400">
                  <button type="button" aria-label="Voice note" className="hover:text-emerald-700"><Mic size={16} /></button>
                  <button type="button" aria-label="Image"       className="hover:text-emerald-700"><ImageIcon size={16} /></button>
                  <button type="button" aria-label="Document"    className="hover:text-emerald-700"><FileText size={16} /></button>
                  <span className="ml-auto text-[10px] flex items-center gap-1 text-slate-400">
                    <AlertTriangle size={11} /> AI-assisted replies enabled
                  </span>
                </div>
              </div>
              <Button type="submit" size="icon" className="bg-emerald-900 hover:bg-emerald-800" disabled={!draft.trim() || sendM.isPending}>
                <Send size={16} />
              </Button>
            </form>
          </>
        ) : (
          /* Empty state when no conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto text-slate-200" />
              <h2 className="mt-4 text-lg font-medium text-slate-700">Select a conversation</h2>
              <p className="text-sm text-slate-400 mt-1">Choose a patient from the left to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
