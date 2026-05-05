'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Team({ data }: { data: any }) {
  return (
    <section 
      className="py-24 bg-orange-50/50" 
      id="equipo"
      data-sb-field-path="teamSection"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span 
            className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wider uppercase mb-4"
            data-sb-field-path=".badge"
          >
            {data?.badge || 'Conocé a los especialistas'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-6" data-sb-field-path=".title">
            {data?.title || 'Equipo de trabajo'}
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto" data-sb-field-path=".description">
            {data?.description || 'Contamos con un equipo de profesionales altamente capacitados para brindarte la mejor atención en cada especialidad odontológica.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Main Doctor */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface-background rounded-3xl p-8 border border-surface-variant text-center md:text-left flex flex-col md:flex-row gap-8 items-center"
            data-sb-field-path=".mainDoctor"
          >
            <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-xl relative bg-orange-100">
              <div className="absolute inset-0 flex items-center justify-center text-orange-300 text-6xl font-bold">
                PG
              </div>
              <Image 
                src={data?.mainDoctor?.image || "/images/dra-paula.jpg"} 
                alt={data?.mainDoctor?.name || "Dra. Paula Gualtieri"} 
                fill 
                className="object-cover relative z-10"
                data-sb-field-path=".image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-on-surface mb-2" data-sb-field-path=".name">
                {data?.mainDoctor?.name || 'Dra. Paula Gualtieri'}
              </h3>
              <p className="text-orange-600 font-bold mb-4" data-sb-field-path=".mn">
                {data?.mainDoctor?.mn || 'MN'}
              </p>
              <p className="text-on-surface-variant leading-relaxed" data-sb-field-path=".role">
                {data?.mainDoctor?.role || 'Especialista en alineadores dentales y ortopedia.'}
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
            {(data?.members || []).map((member: any, idx: number) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl bg-white border border-surface-variant hover:shadow-lg transition-shadow"
                data-sb-field-path={`.members.${idx}`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface" data-sb-field-path=".name">{member.name}</h3>
                  <span className="text-sm text-orange-600 font-bold block mb-1" data-sb-field-path=".mn">{member.mn}</span>
                  <p className="text-sm text-on-surface-variant" data-sb-field-path=".role">{member.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
