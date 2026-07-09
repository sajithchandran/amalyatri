'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { PRIMARY_NAV } from './nav';
import { BrandMark } from '@/components/landing/logo';
import { Button } from '@/components/ui/button';

export function MobileDrawer({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  React.useEffect(() => { if (open) onClose(); /* close on nav */ /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'lg:hidden fixed inset-0 z-50 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-forest-900/30 transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'absolute inset-y-0 left-0 w-80 max-w-[85%] bg-cream shadow-glow border-r border-forest-900/8',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-forest-900/5">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
            <BrandMark size={32} />
            <span className="font-display text-lg">Amal <em className="not-italic italic text-forest-700">Yatri</em></span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </Button>
        </div>
        <nav className="p-5 space-y-1">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-start gap-3 px-3 py-2.5 rounded-2xl transition-colors',
                  active
                    ? 'bg-forest-700/8 text-forest-900'
                    : 'text-ink/75 hover:bg-forest-700/4 hover:text-forest-900',
                )}
              >
                <Icon size={18} className={cn('mt-0.5 shrink-0', active ? 'text-forest-700' : 'text-forest-900/55')} />
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-ink/55 mt-0.5">{item.description}</div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
