'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ArrowLeft, ArrowRight, Instagram, Facebook, Phone } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Martina R.',
    content: '"El tratamiento de ortodoncia invisible fue tal como la Dra. Paula me lo explicó. Sin dolor, rápido y los resultados son increíbles. La clínica transmite mucha paz."',
    source: 'Instagram',
    icon: Instagram,
    rating: 5,
    img: 'https://picsum.photos/seed/patient1/100/100'
  },
  {
    name: 'Diego F.',
    content: '"Le tenía terror al dentista hasta que vine aquí por un implante. El equipo es súper profesional y humano. Me explicaron cada paso y no sentí nada. Totalmente recomendados."',
    source: 'Facebook',
    icon: Facebook,
    rating: 5,
    img: 'https://picsum.photos/seed/patient2/100/100'
  },
  {
    name: 'Lucía G.',
    content: '"Me hice diseño de sonrisa y carillas. El cambio fue espectacular pero súper natural. La calidez de la doctora Paula hace la diferencia. Gracias por devolverme las ganas de sonreír."',
    source: 'WhatsApp',
    icon: Phone,
    rating: 5,
    img: 'https://picsum.photos/seed/patient3/100/100'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white" id="testimonios">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Experiencias de nuestros pacientes</h2>
            <p className="text-lg text-on-surface-variant">Historias reales de personas que transformaron su salud bucal y su confianza con nosotros.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-orange-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-orange-50 transition-colors">
              <ArrowRight className="w-5 h-5 text-on-surface" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-6 right-6 text-orange-200 w-12 h-12" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden relative">
                  <Image src={t.img} alt={t.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">{t.name}</h4>
                  <div className="flex text-orange-500">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant italic mb-6 leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <t.icon className="w-4 h-4" /> Vía {t.source}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
