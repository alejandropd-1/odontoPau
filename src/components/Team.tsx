'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Team() {
  return (
    <section className="py-24 bg-orange-50/50" id="equipo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wider uppercase mb-4">
            Conocé a los especialistas
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-6">Equipo de trabajo</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Contamos con un equipo de profesionales altamente capacitados para brindarte la mejor atención en cada especialidad odontológica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Dra. Paula */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface-background rounded-3xl p-8 border border-surface-variant text-center md:text-left flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-xl relative bg-orange-100">
              {/* Fallback avatar if photo not found */}
              <div className="absolute inset-0 flex items-center justify-center text-orange-300 text-6xl font-bold">
                PG
              </div>
              <Image 
                src="/images/dra-paula.jpg" 
                alt="Dra. Paula Gualtieri" 
                fill 
                className="object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">Dra. Paula Gualtieri</h3>
              <p className="text-orange-600 font-bold mb-4">MN</p>
              <p className="text-on-surface-variant leading-relaxed">
                Especialista en alineadores dentales y ortopedia.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Team List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              {
                name: 'Dr. Roberto Dominguez',
                mn: 'MN',
                role: 'Especialista en rehabilitación oral (Implantes y prótesis).'
              },
              {
                name: 'Dra. Emilia Omastott',
                mn: 'MN',
                role: 'Atención niños, Maestría en cirugía dental.'
              },
              {
                name: 'Dr. Pablo Martinez',
                mn: 'MN',
                role: 'Especialista en Endodoncia.'
              }
            ].map((member, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl bg-white border border-surface-variant hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{member.name}</h3>
                  <span className="text-sm text-orange-600 font-bold block mb-1">{member.mn}</span>
                  <p className="text-sm text-on-surface-variant">{member.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
