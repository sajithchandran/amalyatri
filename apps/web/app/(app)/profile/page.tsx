'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';

interface Me {
  id: string;
  email: string;
  role: string;
  profile: { firstName?: string; lastName?: string; city?: string; country?: string; bio?: string; avatarUrl?: string; wellnessScore?: number } | null;
}

export default function ProfilePage() {
  const { api } = useAuth();
  const meQ = useQuery({ queryKey: ['users','me'], queryFn: () => api.get<Me>('/users/me') });

  const data = meQ.data;
  const name = data?.profile?.firstName ? `${data.profile.firstName} ${data.profile.lastName ?? ''}` : 'Yatri';

  return (
    <>
      <PageHeader eyebrow="Profile" title="A little about you." description="This is how you appear to your doctors and the community." />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 ring-2 ring-forest-700/10">
              <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{name || 'Yatri'}</CardTitle>
              <CardDescription>{data?.email}</CardDescription>
              <Badge variant="forest" className="mt-2">{data?.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-ink/75">{data?.profile?.bio ?? 'No bio yet — share a quiet line about your wellness practice.'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <Field label="City" value={data?.profile?.city} />
            <Field label="Country" value={data?.profile?.country} />
            <Field label="Wellness score" value={String(data?.profile?.wellnessScore ?? '—')} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-forest-900/55">{label}</p>
      <p className="mt-1 text-ink/85">{value ?? '—'}</p>
    </div>
  );
}
