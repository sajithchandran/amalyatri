import Link from 'next/link';
import { BrandMark, Wordmark } from './logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-forest-900/10 mt-32 bg-cream/40">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 max-w-md">
            <div className="inline-flex items-center gap-2.5">
              <BrandMark size={28} />
              <Wordmark className="text-xl" />
            </div>
            <p className="mt-4 text-sm text-ink/70 leading-relaxed">
              The lifelong digital companion for every guest of Amal Tamara
              Ayurveda — so the wellness journey continues, gently, long after
              you return home.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-forest-900/60 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-ink/80">
              <li><Link href="#philosophy" className="hover:text-forest-700">Philosophy</Link></li>
              <li><Link href="#features"  className="hover:text-forest-700">Features</Link></li>
              <li><Link href="#doctors"   className="hover:text-forest-700">Our doctors</Link></li>
              <li><Link href="#stories"   className="hover:text-forest-700">Stories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-forest-900/60 mb-3">For Yatris</h4>
            <ul className="space-y-2 text-sm text-ink/80">
              <li><Link href="/login"     className="hover:text-forest-700">Sign in</Link></li>
              <li><Link href="/register"  className="hover:text-forest-700">Become a Yatri</Link></li>
              <li><Link href="/dashboard" className="hover:text-forest-700">Open dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="soft-divider my-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-ink/60">
          <p>© 2026 Amal Tamara Ayurveda · Crafted in Kerala</p>
          <p>Made with care for the lifelong journey.</p>
        </div>
      </div>
    </footer>
  );
}
