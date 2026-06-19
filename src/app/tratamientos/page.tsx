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
  description: 'Conoce los tratamientos odontologicos disponibles en Paula Gualtieri Odontologia: implantes, ortodoncia, estetica dental, ortopedia, pediatria y endodoncia.',
};

export default function TratamientosPage() {
  const tratamientos = getTratamientos();

  return (
    <main className="treatments-page">
      <Navbar />

      <section className="treatments-index" aria-labelledby="treatments-title">
        <div className="treatments-index__inner">
          <div className="treatments-index__header">
            <span className="treatments-index__eyebrow">Servicios odontologicos</span>
            <h1 id="treatments-title" className="treatments-index__title">
              Tratamientos para cuidar cada etapa de tu sonrisa
            </h1>
            <p className="treatments-index__description">
              Especialidades coordinadas con criterio clinico, tecnologia precisa y una atencion cercana para cada paciente.
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
                    Saber mas
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
            <span className="treatments-instructions__eyebrow">Para compartir despues de la consulta</span>
            <h2 id="treatments-instructions-title" className="treatments-instructions__title">
              Instrucciones listas para enviar a pacientes
            </h2>
            <p className="treatments-instructions__description">
              Guias breves relacionadas con los tratamientos para que cada paciente pueda repasar cuidados y recomendaciones desde su telefono.
            </p>
          </div>

          <InstructionCards instructions={publishedInstrucciones} headingLevel="h3" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
