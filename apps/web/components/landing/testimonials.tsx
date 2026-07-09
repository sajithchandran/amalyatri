import { Badge } from '@/components/ui/badge';

const stories = [
  {
    quote:
      "It feels less like a service and more like a wise friend who keeps showing up — even six months after I returned home. The home yoga nudged me back on the mat this morning.",
    author: 'Aarti S.',
    role: '14-day Panchakarma · 2023',
  },
  {
    quote:
      'When my sleep started slipping, I sent a voice note from my phone. Dr Devi replied within hours. The platform made it feel effortless, not clinical.',
    author: 'Ravi I.',
    role: '21-day Stress Recovery · 2024',
  },
  {
    quote:
      "The Panchakarma Alumni community is the quietest, kindest circle I've ever been part of. No scrolling. No drama. Just people who get it.",
    author: 'Lena M.',
    role: '10-day Reset · 2024',
  },
];

export function Testimonials() {
  return (
    <section id="stories" className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <Badge variant="clay">From Yatris</Badge>
          <h2 className="mt-5 font-display text-display-lg md:text-display-xl text-balance">
            Three small, honest
            <br className="hidden md:block" />
            voices.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <figure
              key={s.author}
              className="flex flex-col rounded-3xl bg-white/70 backdrop-blur-sm border border-forest-900/8 p-7 shadow-soft"
            >
              <span aria-hidden className="font-display text-5xl text-clay-400 leading-none">"</span>
              <blockquote className="mt-1 flex-1 text-[15px] text-ink/85 leading-relaxed text-pretty">
                {s.quote}
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-forest-900/10">
                <p className="font-display text-lg text-forest-900">{s.author}</p>
                <p className="text-xs uppercase tracking-widest text-forest-700/70 mt-0.5">{s.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
