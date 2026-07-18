import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandMark, Wordmark } from './logo';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/70 border-b border-forest-900/5">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <BrandMark size={32} />
          <Wordmark className="text-lg" />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink/80">
          <Link href="#philosophy" className="hover:text-forest-700 transition">Philosophy</Link>
          <Link href="#features"  className="hover:text-forest-700 transition">Features</Link>
          <Link href="#doctors"   className="hover:text-forest-700 transition">Doctors</Link>
          <Link href="#stories"   className="hover:text-forest-700 transition">Stories</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="text-xs text-ink/50 hover:text-forest-700">
            <Link href="/admin/login">Staff</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Become a Yatri</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
