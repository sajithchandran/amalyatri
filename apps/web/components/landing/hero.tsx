import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { KeralaMist } from './kerala-mist';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-bg absolute inset-0 -z-10" aria-hidden />
      <div className="container pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-cream/70 px-4 py-1.5 text-xs uppercase tracking-widest text-forest-800 animate-fade-in">
              <span aria-hidden>🌿</span> A digital home for life
            </span>

            <h1 className="mt-6 font-display text-display-xl md:text-display-2xl text-balance text-ink animate-fade-in">
              The wellness journey
              <br className="hidden md:block" />
              <em className="not-italic text-forest-700">continues</em>, gently,
              <br className="hidden md:block" />
              long after you leave.
            </h1>

            <p className="mt-7 max-w-xl text-lg text-ink/70 leading-relaxed text-pretty animate-fade-in">
              Every guest of Amal Tamara becomes an Amal Yatri. This is your
              lifelong companion — your doctors, your practices, your
              community, and a calm AI guide, gathered in one beautiful,
              quiet place.
            </p>

            <div className="mt-9 flex flex-wrap gap-3 animate-fade-in">
              <Button asChild size="lg">
                <Link href="/register">Become a Yatri</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#philosophy">Read the philosophy</Link>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md text-sm text-ink/70">
              <div>
                <dt className="text-xs uppercase tracking-widest opacity-60">Founded</dt>
                <dd className="mt-1 font-display text-xl text-forest-900">Kerala, 2026</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest opacity-60">Yatris</dt>
                <dd className="mt-1 font-display text-xl text-forest-900">∞ lifelong</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest opacity-60">Promise</dt>
                <dd className="mt-1 font-display text-xl text-forest-900">Never ending</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.25rem] bg-gradient-to-br from-clay-200/40 to-forest-200/40 blur-2xl" />
            <KeralaMist />
          </div>
        </div>
      </div>
    </section>
  );
}
