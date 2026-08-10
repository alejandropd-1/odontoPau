import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstructionCards from '@/components/InstructionCards';
import { publishedInstrucciones } from '@/data/instrucciones';
import { getTratamientos } from '@/data/tratamientos';
import TreatmentIcon from '@/components/TreatmentIcon';

export const metadata: Metadata = {
  title: 'Tratamientos',
  description: 'Conocé los tratamientos odontológicos disponibles en Paula Gualtieri Odontología: rehabilitación, ortodoncia, estética dental, ortopedia, pediatría y endodoncia.',
  alternates: { canonical: 'https://paulagualtieri.com/tratamientos' },
};

export default function TratamientosPage() {
  const tratamientos = getTratamientos();

  return (
    <main className="treatments-page">
      <Navbar />

      <section className="treatments-index" aria-labelledby="treatments-title">
        <div className="treatments-index__inner">
          <div className="treatments-index__header">
            <span className="treatments-index__eyebrow">Nuestros tratamientos</span>
            <h1 id="treatments-title" className="treatments-index__title">
              Distintas formas de cuidar tu sonrisa
            </h1>
            <p className="treatments-index__description">
              Te acompañamos con una mirada integral y un plan pensado para vos, desde la primera consulta hasta cada control.
            </p>
          </div>

          <div className="treatments-index__grid">
            {tratamientos.map((treatment) => (
              <article key={treatment.id} className="treatments-index__card">
                <Link className="treatments-index__media" href={`/tratamientos/${treatment.id}`} aria-label={`Ver ${treatment.tituloHero}`}>
                  <Image
                    src={treatment.heroImage}
                    alt={treatment.tituloHero}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="treatments-index__image"
                  />
                </Link>
                <div className="treatments-index__card-body">
                  <div className="treatments-index__icon-wrap" aria-hidden="true">
                    <TreatmentIcon name={treatment.icon} className="treatments-index__icon" />
                  </div>
                  <h2 className="treatments-index__card-title">
                    <Link href={`/tratamientos/${treatment.id}`}>
                      {treatment.tituloHero}
                    </Link>
                  </h2>
                  <p className="treatments-index__card-description">{treatment.descripcionHero}</p>
                  <Link className="treatments-index__link" href={`/tratamientos/${treatment.id}`}>
                    Conocer el tratamiento
                    <ArrowRight className="treatments-index__link-icon" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="treatments-instructions" aria-labelledby="treatments-instructions-title">
        <div className="treatments-instructions__inner">
          <div className="treatments-instructions__header">
            <span className="treatments-instructions__eyebrow">Para tener siempre a mano</span>
            <h2 id="treatments-instructions-title" className="treatments-instructions__title">
              Indicaciones para volver a consultar cuando las necesites
            </h2>
            <p className="treatments-instructions__description">
              Guías claras y simples para repasar desde el teléfono los cuidados recomendados después de la consulta.
            </p>
          </div>

          <InstructionCards instructions={publishedInstrucciones} headingLevel="h3" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
