import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstructionCards from '@/components/InstructionCards';
import { getRoutableInstructions, isInstructionPreviewBuild } from '@/data/instrucciones';

export const metadata: Metadata = {
  title: 'Instrucciones para pacientes',
  description: 'Indicaciones odontológicas breves para pacientes: cuidados posteriores, recomendaciones y recursos disponibles.',
  alternates: { canonical: 'https://paulagualtieri.com/instrucciones' },
  robots: isInstructionPreviewBuild() ? { index: false, follow: false } : undefined,
};

export default function InstruccionesPage() {
  const instructions = getRoutableInstructions();
  const isPreview = isInstructionPreviewBuild();

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
              Material para descargar luego de los procedimientos.
            </p>
            {isPreview && (
              <p className="instructions-index__preview-notice" role="status">
                Vista previa editorial: también se muestran instrucciones que todavía no están publicadas.
              </p>
            )}
          </div>

          {instructions.length > 0 ? (
            <InstructionCards instructions={instructions} />
          ) : (
            <p className="instructions-index__empty">Las instrucciones se encuentran en revisión editorial.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
