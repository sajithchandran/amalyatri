import { Badge } from '@/components/ui/badge';

const doctors = [
  {
    name: 'Dr. Reji Raj',
    role: 'General Manager & Sr Ayurveda Consultant',
    experience: '19 years',
    bio: 'BAMS, PG Diploma in Health Administration. Expertise in Panchakarma, wellness programmes, Ayurvedic toxicology, and obesity management.',
    specialties: ['Panchakarma', 'Wellness Programs', 'Ayurvedic Toxicology'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors1.jpg',
  },
  {
    name: 'Dr. Ajitha Sunil Babu',
    role: 'Chief Medical Officer',
    experience: '14 years',
    bio: 'BAMS, Reiki (3rd Degree), Pranic Healing. Specialises in Panchakarma, Ayurvedic ophthalmology, paediatrics, gynaecology.',
    specialties: ['Panchakarma', 'Ayurvedic Ophthalmology', 'Reiki'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors3.jpg',
  },
  {
    name: 'Dr. Alvin',
    role: 'Sr. Ayurveda Physician & Hotel Manager',
    experience: '17 years',
    bio: 'BAMS, MBA in Health & Hospitality. Blends Eastern and Western practices. Trained in Thai Holistic Treatments.',
    specialties: ['Panchakarma', 'Spa Therapies', 'Wellness Management'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2025/09/IMG_8237-scaled.jpg',
  },
  {
    name: 'Dr. Karthika S',
    role: 'Sr. Ayurveda Physician',
    experience: '14 years',
    bio: 'BAMS, MD. PhD scholar. Former assistant professor. Worked at National Research Institute of Panchakarma.',
    specialties: ['Panchakarma', 'Ayurvedic Consultations', 'Meditation'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1168-scaled.jpg',
  },
  {
    name: 'Dr. Haripriya S Bonsalay',
    role: 'Sr. Ayurveda Physician',
    experience: '9 years',
    bio: 'BAMS, Fellowship in Sports Rehabilitation. Expertise in Panchakarma, pain management, cosmetology, obesity management.',
    specialties: ['Panchakarma', 'Pain Management', 'Cosmetology'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors4.jpg',
  },
  {
    name: 'Dr. Devi Krishna',
    role: 'Jr. Ayurveda Physician',
    experience: '9 years',
    bio: 'BAMS from Vidyaratnam Ayurveda College, Thrissur. Experience at leading wellness resorts as Spa Manager.',
    specialties: ['Ayurvedic Consultations', 'Panchakarma', 'Spa Management'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1214-scaled.jpg',
  },
  {
    name: 'Dr. Deepesh NP',
    role: 'Sr. Naturopathy Physician & Yoga Consultant',
    experience: '10 years',
    bio: 'BNYS. Specialises in acupuncture, pulse diagnosis, yoga therapy, aquatic yoga, and laughter yoga.',
    specialties: ['Acupuncture', 'Yoga Therapy', 'Pulse Diagnosis'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1258-scaled.jpg',
  },
  {
    name: 'Dr. Atul Vivek',
    role: 'Naturopathy Physician & Yoga Consultant',
    experience: '8 years',
    bio: 'BNYS. Expertise in therapy yoga, diet therapy, and hydro therapy.',
    specialties: ['Therapy Yoga', 'Diet Therapy', 'Hydro Therapy'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors5.jpg',
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((d) => (
            <article
              key={d.name}
              className="flex flex-col rounded-3xl bg-white/70 backdrop-blur-sm border border-forest-900/8 overflow-hidden shadow-soft hover:shadow-glow transition-shadow group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-forest-50">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl text-forest-900">{d.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-forest-700/80 mt-0.5">{d.role}</p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider bg-cream px-2 py-1 rounded-full text-forest-700/80 border border-forest-900/8">
                    {d.experience}
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink/75 leading-relaxed flex-1">{d.bio}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.specialties.map((s) => (
                    <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-cream border border-forest-900/10 text-forest-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink/55">
          Meet the full team on{' '}
          <a href="https://test.amaltamara.com/expertise/" target="_blank" rel="noopener noreferrer"
             className="text-forest-700 hover:underline">
            Amal Tamara expertise page
          </a>
        </p>
      </div>
    </section>
  );
}
