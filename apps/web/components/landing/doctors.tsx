import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';

const doctors = [
  {
    name: 'Dr. Devi Nair',
    role: 'Chief Physician',
    bio: 'Eighteen years of classical Panchakarma. Her work focuses on women’s hormonal balance and gut reset.',
    specialties: ['Panchakarma', "Women's Wellness", 'Marma'],
    initials: 'DN',
  },
  {
    name: 'Dr. Arjun Menon',
    role: 'Stress & Metabolic Health',
    bio: 'Specialises in chronic stress reversal and metabolic reset programs for guests returning from urban burnout.',
    specialties: ['Stress', 'Sleep', 'Metabolic Health'],
    initials: 'AM',
  },
];

export function Doctors() {
  return (
    <section id="doctors" className="py-24 md:py-32 section-fade">
      <div className="container">
        <div className="max-w-3xl">
          <Badge variant="sun">Your doctors</Badge>
          <h2 className="mt-5 font-display text-display-lg md:text-display-xl text-balance">
            The hands that guided you,
            <br className="hidden md:block" />
            now within reach.
          </h2>
          <p className="mt-5 text-lg text-ink/70 leading-relaxed text-pretty">
            Every Amal Yatri can send a message, a voice note, or an image to
            their doctor — and request a follow-up consultation when the
            moment calls.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {doctors.map((d) => (
            <article
              key={d.name}
              className="flex gap-6 rounded-3xl bg-white/70 backdrop-blur-sm border border-forest-900/8 p-7 shadow-soft hover:shadow-glow transition-shadow"
            >
              <Avatar className="size-20 ring-2 ring-forest-700/10">
                <AvatarFallback className="bg-forest-100 text-forest-800 text-xl font-display">
                  {d.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-display text-2xl text-forest-900">{d.name}</h3>
                <p className="mt-0.5 text-sm uppercase tracking-widest text-forest-700/80">{d.role}</p>
                <p className="mt-3 text-sm text-ink/75 leading-relaxed">{d.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {d.specialties.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-cream border border-forest-900/10 text-forest-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
