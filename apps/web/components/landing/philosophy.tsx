import { Badge } from '@/components/ui/badge';

const pillars = [
  {
    title: 'Healing, not fixing',
    body:
      "We don't pretend to cure. We create conditions for the body and mind to settle, soften, and remember what balance feels like.",
  },
  {
    title: 'Continuity, not completion',
    body:
      'The 21 days are only the beginning. The home practice, the season-aware routine, the doctor who knows you — that is the work.',
  },
  {
    title: 'A companion, not a portal',
    body:
      "Amal Yatri is not software on the way to a prescription. It is a quiet, lifelong place to belong — between visits and beyond them.",
  },
];

export function Philosophy() {
  return (
    <section id="philosophy" className="py-24 md:py-32 section-fade">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="clay">Philosophy</Badge>
          <h2 className="mt-5 font-display text-display-lg md:text-display-xl text-balance">
            Wellness is a relationship,
            <br className="hidden md:block" />
            not a transaction.
          </h2>
          <p className="mt-5 text-lg text-ink/70 leading-relaxed text-pretty">
            At Amal Tamara we treat health as a long conversation between your
            body, your seasons, your food, your breath, and your community.
            The platform exists to keep that conversation alive when you are
            far from our groves.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl bg-white/70 backdrop-blur-sm border border-forest-900/8 p-8 shadow-soft hover:shadow-glow transition-shadow"
            >
              <h3 className="font-display text-2xl text-forest-900">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-ink/75 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
