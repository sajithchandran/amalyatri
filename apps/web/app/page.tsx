import { SiteHeader } from '@/components/landing/site-header';
import { SiteFooter } from '@/components/landing/site-footer';
import { Hero } from '@/components/landing/hero';
import { Philosophy } from '@/components/landing/philosophy';
import { Features } from '@/components/landing/features';
import { Doctors } from '@/components/landing/doctors';
import { Testimonials } from '@/components/landing/testimonials';
import { CallToAction } from '@/components/landing/cta';

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Philosophy />
        <Features />
        <Doctors />
        <Testimonials />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
