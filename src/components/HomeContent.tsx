'use client';

import { useTina } from 'tinacms/dist/react';

import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Location from '@/components/Location';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import Team from '@/components/Team';
import Testimonials from '@/components/Testimonials';
import { siteFeatures } from '@/config/site-features';
import type { TinaVisualPayload, VisualRecord } from '@/cms/tina/visual-data';
import { homeFromVisualData } from '@/cms/tina/visual-data';
import type { HomePageData } from '@/data/site-pages';
import type { Tratamiento } from '@/data/tratamientos';

interface HomeContentProps {
  home: HomePageData;
  tratamientos: Tratamiento[];
  visual: TinaVisualPayload<{ homepage: VisualRecord }>;
}

export default function HomeContent({ home: fallback, tratamientos, visual }: HomeContentProps) {
  const { data } = useTina(visual);
  const editorHome = data.homepage as VisualRecord;
  const home = homeFromVisualData(editorHome, fallback);

  return (
    <main className="home-page">
      <Navbar />
      <Hero data={home.hero} editorData={editorHome.hero as VisualRecord} />
      <Services
        tratamientos={tratamientos}
        content={home.services}
        editorData={editorHome.services as VisualRecord}
      />
      {siteFeatures.testimonials && <Testimonials />}
      <Team data={home.team} editorData={editorHome.team as VisualRecord} />
      <Location data={home.location} editorData={editorHome.location as VisualRecord} />
      <Footer />
    </main>
  );
}
