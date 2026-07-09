'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/app/sidebar';
import { Topbar } from '@/components/app/topbar';
import { MobileDrawer } from '@/components/app/drawer';

/**
 * Protected app shell.
 *  - Shows a calm loading screen until auth resolves
 *  - Redirects to /login when there is no authenticated user
 *  - Renders the sidebar (desktop) + topbar + mobile drawer around children
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="inline-block size-12 rounded-full brand-gradient animate-breathe" />
          <p className="mt-5 text-sm text-ink/55 tracking-widest uppercase">Amal Yatri</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 md:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
