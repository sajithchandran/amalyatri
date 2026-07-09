import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: '🌅',
    title: 'A daily home ritual',
    body: 'A morning yoga, breath, and meditation nudge — tailored to your practice and your season.',
  },
  {
    icon: '🩺',
    title: 'Your doctor, in your pocket',
    body: 'Send a message, a voice note, an image. Escalate to a scheduled consultation when you need it.',
  },
  {
    icon: '🌱',
    title: 'Your wellness timeline',
    body: 'Every retreat, assessment, milestone, breath — kept for you, in one quiet, continuous story.',
  },
  {
    icon: '🍲',
    title: 'Cure cuisine, at home',
    body: 'Season-aware recipes, gentle kitchen rituals, and weekly grocery nudges built around your dosha.',
  },
  {
    icon: '🧘',
    title: 'A library of stillness',
    body: 'Articles, podcasts, yoga sessions, and short meditations — curated by the team at Amal Tamara.',
  },
  {
    icon: '🤝',
    title: 'A moderated community',
    body: 'Wellness circles for sleep, gut, women’s health, ageing, sugar, and more — gently held by our team.',
  },
  {
    icon: '🌿',
    title: 'AI that listens, not lectures',
    body: 'A calm assistant for everyday wellness questions. It always escorts you to your doctor when it matters.',
  },
  {
    icon: '🎟️',
    title: 'When the time comes',
    body: 'A retreat reunion, a follow-up visit, a seasonal reset — your next stay is one calm tap away.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <Badge variant="forest">What you'll find inside</Badge>
          <h2 className="mt-5 font-display text-display-lg md:text-display-xl text-balance">
            Eight gentle features,
            <br className="hidden md:block" />
            chosen carefully.
          </h2>
          <p className="mt-5 text-lg text-ink/70 leading-relaxed text-pretty max-w-2xl">
            We chose them against a single question: does this strengthen the
            lifelong relationship between Amal Tamara and the Amal Yatri?
            Everything below said yes.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="group rounded-3xl bg-white/65 backdrop-blur-sm border border-forest-900/8 p-6 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
            >
              <div
                aria-hidden
                className="inline-flex items-center justify-center size-11 rounded-2xl bg-cream border border-forest-900/8 text-xl shadow-inset animate-breathe"
              >
                {f.icon}
              </div>
              <h3 className="mt-5 font-display text-xl text-forest-900 leading-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
