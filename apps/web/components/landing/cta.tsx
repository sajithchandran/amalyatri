import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="relative rounded-[2rem] overflow-hidden brand-gradient text-cream p-10 md:p-16 glow-leaf">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{ background: 'radial-gradient(circle at 20% 0%, #f6ead0, transparent 60%), radial-gradient(circle at 80% 100%, #d8b89e, transparent 60%)' }}
          />
          <div className="relative max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-cream/80">A new chapter</p>
            <h2 className="mt-4 font-display text-display-lg md:text-display-xl text-balance">
              Become an Amal Yatri today.
            </h2>
            <p className="mt-5 text-lg text-cream/85 leading-relaxed text-pretty">
              Free to join. Calm to use. Close to your doctor. The lifelong
              wellness journey begins here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-cream text-forest-900 hover:bg-clay-100">
                <Link href="/register">Become a Yatri</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-cream hover:bg-cream/10">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
