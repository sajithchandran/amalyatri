'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/landing/logo';
import { PRIMARY_NAV } from './nav';

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-forest-900/8 bg-cream/60 backdrop-blur-md">
      <Link href="/dashboard" className="px-7 h-16 flex items-center gap-3 border-b border-forest-900/5">
        <BrandMark size={32} />
        <span className="font-display text-lg text-ink">
          Amal <em className="not-italic italic text-forest-700">Yatri</em>
        </span>
      </Link>

      <nav className="flex-1 p-5 space-y-1">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.18em] text-forest-900/50 font-medium">
          Your journey
        </p>
        {PRIMARY_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-start gap-3 px-3 py-2.5 rounded-2xl transition-colors',
                active
                  ? 'bg-forest-700/8 text-forest-900'
                  : 'text-ink/75 hover:bg-forest-700/4 hover:text-forest-900',
              )}
            >
              <Icon size={18} className={cn('mt-0.5 shrink-0', active ? 'text-forest-700' : 'text-forest-900/55')} />
              <div>
                <div className="text-sm font-medium leading-none">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-ink/55 mt-1 leading-snug">{item.description}</div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-5 border-t border-forest-900/5">
        <p className="text-xs text-ink/60 leading-relaxed">
          <span aria-hidden>🌿</span> Today is a quiet, good day to begin again.
        </p>
      </div>
    </aside>
  );
}
