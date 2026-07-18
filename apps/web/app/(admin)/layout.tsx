'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, Stethoscope, MessageCircle, CalendarDays, Users,
  Settings, LogOut, Bell, Menu, User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials } from '@/lib/utils';

const ADMIN_NAV = [
  { href: '/admin/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/patients',     label: 'Patients',      icon: Users },
  { href: '/admin/consultations',label: 'Consultations',  icon: Stethoscope },
  { href: '/doctor',             label: 'Messages',      icon: MessageCircle },
  { href: '/admin/schedule',     label: 'Schedule',      icon: CalendarDays },
  { href: '/admin/settings',     label: 'Settings',      icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [loading, user, router]);

  React.useEffect(() => {
    if (!loading && user && (user.role === 'YATRI' || user.role === 'THERAPIST')) {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin size-8 rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const roleLabel = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'Administrator'
    : user.role === 'DOCTOR' ? 'Doctor'
    : user.role === 'WELLNESS_GUIDE' ? 'Wellness Guide'
    : 'Staff';

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200">
        <Link href="/admin/dashboard" className="px-6 h-16 flex items-center gap-3 border-b border-slate-100">
          <div className="size-8 rounded-lg bg-emerald-900 text-white grid place-items-center text-sm font-serif">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 leading-tight">Amal Yatri</p>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase">Staff Portal</p>
          </div>
        </Link>

        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="size-9">
              <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
              <p className="text-xs text-emerald-700">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                  active
                    ? 'bg-emerald-50 text-emerald-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <Icon size={18} className={active ? 'text-emerald-700' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-6">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emerald-900 text-white grid place-items-center text-sm font-serif">A</div>
                <span className="text-sm font-medium text-slate-900">Staff Portal</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
            <hr className="my-4" />
            <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 w-full">
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={18} />
            </Button>
            <h2 className="text-sm font-medium text-slate-700 hidden sm:block">
              {pathname === '/admin/dashboard' ? 'Overview' : pathname.split('/').pop()?.replace(/-/g, ' ') ?? ''}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications"><Bell size={18} /></Link>
            </Button>
            <Link href="/profile" className="text-sm text-slate-600 hover:text-slate-900">
              <UserIcon size={18} />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
