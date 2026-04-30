import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Team from '@/components/Team';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import homeData from '@/data/home.json';

export const metadata: Metadata = {
  title: 'Inicio | Dra. Paula Gualtieri - Odontología de Vanguardia',
  description: 'Clínica odontológica en Buenos Aires liderada por la Dra. Paula Gualtieri. Especialistas en implantes dentales, ortodoncia invisible y estética dental con tecnología de precisión.',
};

export default function Home() {
  return (
    <main className="min-h-screen" data-sb-object-id="src/data/home.json">
      <Navbar />
      <Hero data={homeData.hero} />
      <Services />
      <Testimonials />
      <Team />
      <Location />
      <Footer />
    </main>
  );
}
