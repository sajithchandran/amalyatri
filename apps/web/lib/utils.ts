import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx + tailwind-merge. Use everywhere a className is composed
 * conditionally so duplicate / conflicting utilities collapse cleanly.
 *
 *   cn('px-4', isActive && 'bg-forest-600', 'px-6')
 *   // → 'bg-forest-600 px-6'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date as a calm, human-readable string. */
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a date as "3 days ago" / "in 2 weeks". */
export function formatRelative(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '—';
  const diffMs = d.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(diffDays) >= 30) {
    const months = Math.round(diffDays / 30);
    return rtf.format(months, 'month');
  }
  return rtf.format(diffDays, 'day');
}

/** Pluck the initials from a display name (max 2 letters, uppercase). */
export function initials(name?: string | null): string {
  if (!name) return '🌿';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '🌿';
}

/** Tiny sleep helper for graceful demos. */
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
