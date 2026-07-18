'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';

export function Topbar({ onOpenDrawer }: { onOpenDrawer?: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(ev: MouseEvent) {
      if (!menuRef.current?.contains(ev.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const displayName = user ? `${user.firstName ?? 'Yatri'} ${user.lastName ?? ''}`.trim() : 'Yatri';

  return (
    <header className="sticky top-0 z-30 h-16 px-5 md:px-8 flex items-center justify-between gap-3 border-b border-forest-900/8 bg-cream/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={onOpenDrawer}>
          <Menu size={18} />
        </Button>
        <p className="text-xs uppercase tracking-[0.18em] text-forest-900/55 hidden sm:block">
          {timeOfDayGreeting()}, {user?.firstName ?? 'Yatri'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Link href="/notifications">
            <Bell size={18} />
            <Badge variant="rose" className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
              2
            </Badge>
          </Link>
        </Button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-forest-700/4 transition"
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-forest-100 text-forest-800 text-sm">
                {initials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm text-ink/85">{displayName}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-glow border border-forest-900/8 p-2 animate-fade-in">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-ink/85 hover:bg-forest-700/5"
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon size={16} /> My profile
              </Link>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Late evening';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Quiet night';
}
