'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Drill, Sparkles, Smile } from 'lucide-react';

const services = [
  {
    title: 'Implantología',
    description: 'Recupera la funcionalidad y estética de tu sonrisa con implantes de titanio de máxima biocompatibilidad y precisión guiada por ordenador.',
    icon: Drill,
  },
  {
    title: 'Ortodoncia Invisible',
    description: 'Alineación perfecta y discreta mediante alineadores transparentes hechos a medida. Comodidad y resultados predecibles sin brackets.',
    icon: Smile,
    featured: true,
  },
  {
    title: 'Estética Dental',
    description: 'Diseño de sonrisa digital, blanqueamientos de alta eficacia y carillas cerámicas ultradelgadas para lograr proporciones ideales y luminosidad.',
    icon: Sparkles,
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-surface-background relative overflow-hidden" id="servicios">
      {/* Decorative blurred orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4 tracking-tight">Tratamientos de Vanguardia</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Soluciones dentales precisas diseñadas con tecnología de última generación para resultados duraderos y estéticos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className={`glass-panel rounded-2xl p-8 transition-all duration-300 relative ${service.featured ? 'border-orange-500/30' : ''}`}
            >
              {service && (
                <div className="absolute inset-0 border-2 border-primary-container opacity-10 rounded-2xl pointer-events-none"></div>
              )}
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                <service.icon className="text-primary-container w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-3">{service.title}</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed">{service.description}</p>
              <a className="inline-flex items-center gap-2 text-sm font-bold text-primary-container hover:text-brand-orange transition-colors" href="#">
                Saber más <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
