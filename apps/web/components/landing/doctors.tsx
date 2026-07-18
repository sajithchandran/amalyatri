import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';

const doctors = [
  {
    name: 'Dr. Reji Raj',
    role: 'General Manager & Sr Ayurveda Consultant',
    bio: 'Over 19 years of experience at Taj Hotels and world-renowned properties. Specialises in Panchakarma, wellness programmes, Ayurvedic toxicology, and obesity management.',
    specialties: ['Panchakarma', 'Wellness Programs', 'Ayurvedic Toxicology'],
    initials: 'RR',
  },
  {
    name: 'Dr. Ajitha Sunil Babu',
    role: 'Chief Medical Officer',
    bio: 'Chief Medical Officer with 14+ years of experience. Trained in Reiki (3rd degree) and Pranic Healing. Specialises in Panchakarma, Ayurvedic ophthalmology, and gynaecology.',
    specialties: ['Panchakarma', 'Ayurvedic Ophthalmology', 'Reiki'],
    initials: 'AS',
  },
  {
    name: 'Dr. Alvin',
    role: 'Sr. Ayurveda Physician & Hotel Manager',
    bio: 'BAMS from Government Ayurveda College, Kannur and MBA in Health & Hospitality. Over 17 years of experience blending Eastern and Western wellness practices.',
    specialties: ['Panchakarma', 'Spa Therapies', 'Wellness Management'],
    initials: 'AL',
  },
  {
    name: 'Dr. Karthika S',
    role: 'Sr. Ayurveda Physician',
    bio: 'BAMS, MD with 14+ years of experience. PhD scholar and former assistant professor. Specialises in Panchakarma and meditative wellness approaches.',
    specialties: ['Panchakarma', 'Ayurvedic Consultations', 'Meditation'],
    initials: 'KS',
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

        <p className="mt-10 text-center text-sm text-ink/55">
          Meet all 8 Amal Tamara physicians on{' '}
          <a href="https://test.amaltamara.com/expertise/" target="_blank" rel="noopener noreferrer"
             className="text-forest-700 hover:underline">
            our expertise page
          </a>.
        </p>
      </div>
    </section>
  );
}
