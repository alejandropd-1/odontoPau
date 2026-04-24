'use client';

import React, { useState, useEffect } from 'react';
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
  },
  {
    name: 'Carlos M.',
    content: '"Excelente atención. Me realicé un blanqueamiento y los resultados superaron mis expectativas. El ambiente es muy relajante y moderno."',
    source: 'Google',
    icon: Star,
    rating: 5,
    img: 'https://picsum.photos/seed/patient4/100/100'
  },
  {
    name: 'Sofía L.',
    content: '"La Dra. Paula es súper paciente y detallista. Me explicó todo el proceso de mi tratamiento de encías con mucha claridad. Me sentí en muy buenas manos."',
    source: 'Instagram',
    icon: Instagram,
    rating: 5,
    img: 'https://picsum.photos/seed/patient5/100/100'
  },
  {
    name: 'Roberto P.',
    content: '"Buscaba un lugar con tecnología de punta y lo encontré. El scanner intraoral es una maravilla, nada de moldes molestos. Muy recomendable."',
    source: 'WhatsApp',
    icon: Phone,
    rating: 5,
    img: 'https://picsum.photos/seed/patient6/100/100'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length - itemsToShow + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + (testimonials.length - itemsToShow + 1)) % (testimonials.length - itemsToShow + 1));
  };

  return (
    <section className="py-24 bg-white" id="testimonios">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Experiencias de nuestros pacientes</h2>
            <p className="text-lg text-on-surface-variant">Historias reales de personas que transformaron su salud bucal y su confianza con nosotros.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-orange-50 transition-colors active:scale-95"
              aria-label="Testimonio anterior"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-orange-50 transition-colors active:scale-95"
              aria-label="Siguiente testimonio"
            >
              <ArrowRight className="w-5 h-5 text-on-surface" />
            </button>
          </div>
        </div>

        <div className="relative overflow-visible">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (32 / itemsToShow)}px)`
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)] flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow"
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
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
