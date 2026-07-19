import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const doctors = [
  {
    name: 'Dr. Reji Raj',
    role: 'General Manager & Sr Ayurveda Consultant',
    experience: '19 years',
    qualifications: 'BAMS, PG Diploma in Health Administration',
    bio: 'Expertise in Panchakarma, wellness programmes, Ayurvedic toxicology, and obesity management. Over 19 years at Taj Hotels and world-renowned properties.',
    specialties: ['Panchakarma', 'Wellness Programs', 'Ayurvedic Toxicology'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors1.jpg',
  },
  {
    name: 'Dr. Ajitha Sunil Babu',
    role: 'Chief Medical Officer',
    experience: '14 years',
    qualifications: 'BAMS, Reiki (3rd Degree), Pranic Healing',
    bio: 'Specialises in Panchakarma, Ayurvedic ophthalmology, paediatrics, gynaecology, and assistive healing therapies.',
    specialties: ['Panchakarma', 'Ayurvedic Ophthalmology', 'Reiki'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors3.jpg',
  },
  {
    name: 'Dr. Alvin',
    role: 'Sr. Ayurveda Physician & Hotel Manager',
    experience: '17 years',
    qualifications: 'BAMS, MBA in Health & Hospitality',
    bio: 'Blends Eastern and Western practices. Trained in Thai Holistic Treatments. Previously at Taj Hotels, Sofitel Phuket, and Vivanta by Taj.',
    specialties: ['Panchakarma', 'Spa Therapies', 'Wellness Management'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2025/09/IMG_8237-scaled.jpg',
  },
  {
    name: 'Dr. Karthika S',
    role: 'Sr. Ayurveda Physician',
    experience: '14 years',
    qualifications: 'BAMS, MD',
    bio: 'PhD scholar. Former assistant professor. Worked at the National Research Institute of Panchakarma under the Govt. of India.',
    specialties: ['Panchakarma', 'Ayurvedic Consultations', 'Meditation'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1168-scaled.jpg',
  },
  {
    name: 'Dr. Haripriya S Bonsalay',
    role: 'Sr. Ayurveda Physician',
    experience: '9 years',
    qualifications: 'BAMS, Fellowship in Sports Rehabilitation',
    bio: 'Expertise in Panchakarma, pain management, cosmetology, and obesity management. Trained in Kalari and Marma therapy.',
    specialties: ['Panchakarma', 'Pain Management', 'Cosmetology'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors4.jpg',
  },
  {
    name: 'Dr. Devi Krishna',
    role: 'Jr. Ayurveda Physician',
    experience: '9 years',
    qualifications: 'BAMS',
    bio: 'Experience at leading wellness resorts as Spa Manager. Began her career at Illom Ayurveda Hospital as a medical officer.',
    specialties: ['Ayurvedic Consultations', 'Panchakarma', 'Spa Management'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1214-scaled.jpg',
  },
  {
    name: 'Dr. Deepesh NP',
    role: 'Sr. Naturopathy Physician & Yoga Consultant',
    experience: '10 years',
    qualifications: 'BNYS',
    bio: 'Specialises in acupuncture, pulse diagnosis, yoga therapy, aquatic yoga, and laughter yoga.',
    specialties: ['Acupuncture', 'Yoga Therapy', 'Pulse Diagnosis'],
    image: 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1258-scaled.jpg',
  },
  {
    name: 'Dr. Atul Vivek',
    role: 'Naturopathy Physician & Yoga Consultant',
    experience: '8 years',
    qualifications: 'BNYS',
    bio: 'Expertise in therapy yoga, diet therapy, and hydro therapy.',
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
              className="flex flex-col rounded-2xl bg-white/70 backdrop-blur-sm border border-forest-900/8 overflow-hidden shadow-soft hover:shadow-glow transition-shadow group"
            >
              {/* Photo — same aspect ratio as /doctor page */}
              <div className="aspect-[16/9] bg-gradient-to-br from-forest-50 to-cream overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Info — same structure as /doctor page */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl text-forest-900 leading-tight">
                      {d.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ink/55 flex-wrap">
                      <span className="flex items-center gap-1">
                        {d.experience}
                      </span>
                      <span className="text-ink/30">·</span>
                      <span className="text-ink/55">{d.qualifications}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider bg-cream px-2 py-1 rounded-full text-forest-700/80 border border-forest-900/8 whitespace-nowrap">
                    {d.role.split('·')[0].trim()}
                  </span>
                </div>

                <p className="mt-3 text-sm text-ink/75 leading-relaxed flex-1">
                  {d.bio}
                </p>

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
