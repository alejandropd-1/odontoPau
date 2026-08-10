import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Team from '@/components/Team';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import homeData from '@/data/home.json';
import { getTratamientos } from '@/data/tratamientos';
import { siteFeatures } from '@/config/site-features';

export const metadata: Metadata = {
  title: { absolute: 'Dra. Paula Gualtieri | Odontóloga en Flores' },
  description: 'Consultorio odontológico en Flores, CABA, con atención en rehabilitación, ortodoncia invisible, estética dental, ortopedia, pediatría y endodoncia.',
  alternates: { canonical: 'https://paulagualtieri.com' },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': 'https://paulagualtieri.com/#consultorio',
  name: 'Paula Gualtieri Odontología',
  url: 'https://paulagualtieri.com',
  image: 'https://paulagualtieri.com/images/isologo.png',
  telephone: '+54 9 11 3785-4198',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ramón Falcón 2401, Piso 1, Departamento B',
    addressLocality: 'Flores',
    addressRegion: 'Ciudad Autónoma de Buenos Aires',
    postalCode: 'C1406',
    addressCountry: 'AR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -34.630037358888586,
    longitude: -58.46496512431464,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '15:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday'], opens: '13:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '15:00' },
  ],
};

export default function Home() {
  const tratamientos = getTratamientos();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }}
      />
      <main className="home-page" data-sb-object-id="src/data/home.json">
        <Navbar />
        <Hero data={homeData.hero} />
        <Services tratamientos={tratamientos} />
        {siteFeatures.testimonials && <Testimonials />}
        <Team />
        <Location />
        <Footer />
      </main>
    </>
  );
}
