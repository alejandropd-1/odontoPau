'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import TreatmentIcon from '@/components/TreatmentIcon';
import type { Tratamiento } from '@/data/tratamientos';
import { tinaField } from 'tinacms/dist/react';
import type { VisualRecord } from '@/cms/tina/visual-data';

interface ServicesProps {
  tratamientos: Tratamiento[];
  content?: { title: string; description: string; linkLabel: string };
  editorData?: VisualRecord;
}

export default function Services({ tratamientos, content, editorData }: ServicesProps) {
  const copy = content ?? {
    title: 'Tratamientos de Vanguardia',
    description: 'Soluciones dentales precisas diseñadas con tecnología de última generación para resultados duraderos y estéticos.',
    linkLabel: 'Saber más',
  };
  return (
    <section className="services" id="servicios" data-tina-field={editorData ? tinaField(editorData) : undefined}>
      <div className="services__orb services__orb--top" aria-hidden="true"></div>
      <div className="services__orb services__orb--bottom" aria-hidden="true"></div>

      <div className="services__inner">
        <div className="services__header">
          <h2 className="services__title" data-tina-field={editorData ? tinaField(editorData, 'title') : undefined}>{copy.title}</h2>
          <p className="services__description" data-tina-field={editorData ? tinaField(editorData, 'description') : undefined}>{copy.description}</p>
        </div>

        <div className="services__grid">
          {tratamientos.map((service, index) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -8 }}
              className="services__card"
            >
              <div className="services__card-border"></div>
              <div className="services__icon-wrap">
                <TreatmentIcon name={service.icon} className="services__icon" />
              </div>
              <h3 className="services__card-title">{service.tituloHero}</h3>
              <p className="services__card-description">{service.descripcionHero}</p>
              <Link className="services__link" href={`/tratamientos/${service.id}`} data-tina-field={editorData ? tinaField(editorData, 'linkLabel') : undefined}>
                {copy.linkLabel} <ArrowRight className="services__link-icon" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
