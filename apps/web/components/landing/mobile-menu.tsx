'use client';

import { useState } from 'react';
import Link from 'next/link';

const sectionLinks = [
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#features', label: 'Features' },
  { href: '#doctors', label: 'Doctors' },
  { href: '#stories', label: 'Stories' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex items-center justify-center size-9 rounded-full border border-forest-900/10 text-forest-800 hover:bg-cream transition"
      >
        <span aria-hidden className="text-base leading-none">{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-forest-900/8 bg-cream shadow-soft">
          <nav className="container flex flex-col py-3">
            {sectionLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-ink/85 hover:text-forest-700 transition border-b border-forest-900/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-forest-700 border-b border-forest-900/5"
            >
              Sign in
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-ink/50 hover:text-forest-700 transition"
            >
              Staff sign in →
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
