import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstructionCards from '@/components/InstructionCards';
import { publishedInstrucciones } from '@/data/instrucciones';

export const metadata: Metadata = {
  title: 'Instrucciones para pacientes',
  description: 'Indicaciones breves para pacientes de Paula Gualtieri Odontologia: cuidados posteriores, recomendaciones y enlaces directos para WhatsApp.',
};

export default function InstruccionesPage() {
  return (
    <main className="instructions-page">
      <Navbar />

      <section className="instructions-index" aria-labelledby="instructions-title">
        <div className="instructions-index__inner">
          <div className="instructions-index__header">
            <span className="instructions-index__eyebrow">Guias para pacientes</span>
            <h1 id="instructions-title" className="instructions-index__title">
              Instrucciones claras para seguir el cuidado en casa
            </h1>
            <p className="instructions-index__description">
              Material breve para compartir por WhatsApp despues de cada consulta, con indicaciones simples y faciles de repasar.
            </p>
          </div>

          <InstructionCards instructions={publishedInstrucciones} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
