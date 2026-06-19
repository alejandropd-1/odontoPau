'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import TreatmentIcon from '@/components/TreatmentIcon';
import type { Tratamiento } from '@/data/tratamientos';

interface ServicesProps {
  tratamientos: Tratamiento[];
}

export default function Services({ tratamientos }: ServicesProps) {
  return (
    <section className="services" id="servicios">
      <div className="services__orb services__orb--top" aria-hidden="true"></div>
      <div className="services__orb services__orb--bottom" aria-hidden="true"></div>

      <div className="services__inner">
        <div className="services__header">
          <h2 className="services__title">Tratamientos de Vanguardia</h2>
          <p className="services__description">Soluciones dentales precisas diseñadas con tecnología de última generación para resultados duraderos y estéticos.</p>
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
              <Link className="services__link" href={`/tratamientos/${service.id}`}>
                Saber más <ArrowRight className="services__link-icon" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
