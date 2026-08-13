'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { tinaField, useTina } from 'tinacms/dist/react';

import Footer from '@/components/Footer';
import InstructionCards from '@/components/InstructionCards';
import Navbar from '@/components/Navbar';
import TreatmentIcon from '@/components/TreatmentIcon';
import type { Instruccion } from '@/data/instrucciones';
import type { TreatmentsPageData } from '@/data/site-pages';
import type { Tratamiento } from '@/data/tratamientos';
import type { TinaVisualPayload, VisualRecord } from '@/cms/tina/visual-data';
import { treatmentsPageFromVisualData } from '@/cms/tina/visual-data';

interface TreatmentsPageContentProps {
  content: TreatmentsPageData;
  tratamientos: Tratamiento[];
  instructions: Instruccion[];
  visual: TinaVisualPayload<{ treatmentspage: VisualRecord }>;
}

export default function TreatmentsPageContent({ content: fallback, tratamientos, instructions, visual }: TreatmentsPageContentProps) {
  const { data } = useTina(visual);
  const editorPage = data.treatmentspage as VisualRecord;
  const content = treatmentsPageFromVisualData(editorPage, fallback);

  return (
    <main className="treatments-page" data-tina-field={tinaField(editorPage)}>
      <Navbar />
      <section className="treatments-index" aria-labelledby="treatments-title">
        <div className="treatments-index__inner">
          <div className="treatments-index__header">
            <span className="treatments-index__eyebrow" data-tina-field={tinaField(editorPage, 'eyebrow')}>{content.eyebrow}</span>
            <h1 id="treatments-title" className="treatments-index__title" data-tina-field={tinaField(editorPage, 'heading')}>{content.heading}</h1>
            <p className="treatments-index__description" data-tina-field={tinaField(editorPage, 'description')}>{content.description}</p>
          </div>

          <div className="treatments-index__grid">
            {tratamientos.map((treatment) => (
              <article key={treatment.id} className="treatments-index__card">
                <Link className="treatments-index__media" href={`/tratamientos/${treatment.id}`} aria-label={`Ver ${treatment.tituloHero}`}>
                  <Image src={treatment.heroImage} alt={treatment.tituloHero} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="treatments-index__image" />
                </Link>
                <div className="treatments-index__card-body">
                  <div className="treatments-index__icon-wrap" aria-hidden="true"><TreatmentIcon name={treatment.icon} className="treatments-index__icon" /></div>
                  <h2 className="treatments-index__card-title"><Link href={`/tratamientos/${treatment.id}`}>{treatment.tituloHero}</Link></h2>
                  <p className="treatments-index__card-description">{treatment.descripcionHero}</p>
                  <Link className="treatments-index__link" href={`/tratamientos/${treatment.id}`} data-tina-field={tinaField(editorPage, 'cardLinkLabel')}>{content.cardLinkLabel} <ArrowRight className="treatments-index__link-icon" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="treatments-instructions" aria-labelledby="treatments-instructions-title">
        <div className="treatments-instructions__inner">
          <div className="treatments-instructions__header">
            <span className="treatments-instructions__eyebrow" data-tina-field={tinaField(editorPage, 'instructionsEyebrow')}>{content.instructionsEyebrow}</span>
            <h2 id="treatments-instructions-title" className="treatments-instructions__title" data-tina-field={tinaField(editorPage, 'instructionsHeading')}>{content.instructionsHeading}</h2>
            <p className="treatments-instructions__description" data-tina-field={tinaField(editorPage, 'instructionsDescription')}>{content.instructionsDescription}</p>
          </div>
          <InstructionCards instructions={instructions} tratamientos={tratamientos} headingLevel="h3" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
