'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Instagram, Facebook, Phone } from 'lucide-react';
import Image from 'next/image';

const IconsMap: Record<string, any> = {
  Instagram: Instagram,
  Facebook: Facebook,
  WhatsApp: Phone,
  Google: Star,
};

export default function Testimonials({ data }: { data: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const testimonialsList = data?.testimonials || [];

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
    if (testimonialsList.length <= itemsToShow) return;
    setCurrentIndex((prev) => (prev + 1) % (testimonialsList.length - itemsToShow + 1));
  };

  const prev = () => {
    if (testimonialsList.length <= itemsToShow) return;
    setCurrentIndex((prev) => (prev - 1 + (testimonialsList.length - itemsToShow + 1)) % (testimonialsList.length - itemsToShow + 1));
  };

  return (
    <section 
      className="py-24 bg-white" 
      id="testimonios"
      data-sb-field-path="testimonialsSection"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4" data-sb-field-path=".title">
              {data?.title || 'Experiencias de nuestros pacientes'}
            </h2>
            <p className="text-lg text-on-surface-variant" data-sb-field-path=".description">
              {data?.description || 'Historias reales de personas que transformaron su salud bucal y su confianza con nosotros.'}
            </p>
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
                x: testimonialsList.length > itemsToShow 
                  ? `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (32 / itemsToShow)}px)`
                  : '0'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonialsList.map((t: any, i: number) => {
                const Icon = IconsMap[t.source] || Star;
                return (
                  <div
                    key={i}
                    className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)] flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow"
                    data-sb-field-path={`.testimonials.${i}`}
                  >
                    <Quote className="absolute top-6 right-6 text-orange-200 w-12 h-12" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden relative shadow-inner">
                        <Image 
                          src={t.img || 'https://picsum.photos/seed/patient/100/100'} 
                          alt={t.name} 
                          fill 
                          className="object-cover" 
                          referrerPolicy="no-referrer"
                          data-sb-field-path=".img"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface" data-sb-field-path=".name">{t.name}</h3>
                        <div className="flex text-orange-500" data-sb-field-path=".rating">
                          {[...Array(t.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-on-surface-variant italic mb-6 leading-relaxed" data-sb-field-path=".content">
                      {t.content}
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider" data-sb-field-path=".source">
                      <Icon className="w-4 h-4" /> Vía {t.source}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
