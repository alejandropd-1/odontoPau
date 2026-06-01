'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <section className="testimonials" id="testimonios">
      <div className="testimonials__inner">
        <div className="testimonials__header">
          <div className="testimonials__copy">
            <h2 className="testimonials__title">Experiencias de nuestros pacientes</h2>
            <p className="testimonials__description">Historias reales de personas que transformaron su salud bucal y su confianza con nosotros.</p>
          </div>
          <div className="testimonials__controls">
            <button
              onClick={prev}
              className="testimonials__control"
              aria-label="Testimonio anterior"
            >
              <ArrowLeft className="testimonials__control-icon" />
            </button>
            <button
              onClick={next}
              className="testimonials__control"
              aria-label="Siguiente testimonio"
            >
              <ArrowRight className="testimonials__control-icon" />
            </button>
          </div>
        </div>

        <div className="testimonials__viewport-wrap">
          <div className="testimonials__viewport">
            <motion.div
              className="testimonials__track"
              animate={{
                x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (32 / itemsToShow)}px)`
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="testimonials__card"
                >
                  <Quote className="testimonials__quote-icon" />
                  <div className="testimonials__person">
                    <div className="testimonials__avatar">
                      <Image src={t.img} alt={t.name} fill className="testimonials__avatar-image" referrerPolicy="no-referrer" />
                    </div>
                    <div className="testimonials__person-info">
                      <h3 className="testimonials__name">{t.name}</h3>
                      <div className="testimonials__stars">
                        {[...Array(t.rating)].map((_, idx) => (
                          <Star key={idx} className="testimonials__star" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="testimonials__content">{t.content}</p>
                  <div className="testimonials__source">
                    <t.icon className="testimonials__source-icon" /> Vía {t.source}
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
