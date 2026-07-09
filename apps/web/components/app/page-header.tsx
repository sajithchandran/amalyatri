import * as React from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10', className)}>
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-forest-900/55 mb-2">{eyebrow}</p>
        )}
        <h1 className="font-display text-display-md md:text-display-lg text-balance">{title}</h1>
        {description && (
          <p className="mt-3 text-ink/70 max-w-2xl leading-relaxed text-pretty">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
