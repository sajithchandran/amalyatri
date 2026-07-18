'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MessageCircle, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelative } from '@/lib/utils';

export default function AdminMessagesPage() {
  const { api, user } = useAuth();

  const conversationsQ = useQuery({
    queryKey: ['doctor', 'conversations'],
    queryFn: () => api.get<any[]>('/doctor-connect/conversations'),
  });

  const conversations = conversationsQ.data ?? [];

  if (conversationsQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin size-8 rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const name = user?.firstName ?? 'Doctor';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">
          Conversations with your patients
        </p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Mail size={40} className="mx-auto text-slate-300" />
            <h2 className="mt-4 text-lg font-medium text-slate-900">No messages yet</h2>
            <p className="text-sm text-slate-500 mt-1">When patients reach out, their messages will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((c: any) => (
            <Link
              key={c.otherId}
              href={`/doctor/${c.otherId}`}
              className="block"
            >
              <Card className="hover:shadow-sm hover:border-slate-200 transition-all">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-base font-medium shrink-0">
                      {(c.otherName ?? '?')[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-medium text-slate-900 truncate">
                          {c.otherName ?? 'Unknown patient'}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {c.unread > 0 && (
                            <Badge variant="solid" className="bg-emerald-600">
                              {c.unread} new
                            </Badge>
                          )}
                          <ArrowUpRight size={14} className="text-slate-300" />
                        </div>
                      </div>

                      {c.lastMessage && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-500 truncate flex-1">
                            {c.lastMessage.body ?? 'Voice note'}
                          </p>
                          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                            <Clock size={10} />
                            {formatRelative(c.lastMessage.createdAt)}
                          </span>
                        </div>
                      )}

                      {c.lastMessage?.kind && c.lastMessage.kind !== 'TEXT' && (
                        <Badge variant="ghost" className="mt-1 text-[10px]">
                          {c.lastMessage.kind}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <CardContent className="py-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MessageCircle size={20} className="text-emerald-300" />
            <div>
              <p className="text-sm font-medium">{conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}</p>
              <p className="text-xs text-emerald-200/80">
                {conversations.reduce((sum: number, c: any) => sum + (c.unread ?? 0), 0)} unread messages
              </p>
            </div>
          </div>
          <Button asChild variant="secondary" size="sm" className="bg-white/15 hover:bg-white/25 text-white border-0">
            <Link href="/doctor">View all threads</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
