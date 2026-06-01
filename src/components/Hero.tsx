'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  data?: {
    title: string;
    description: string;
    buttonPrimary: string;
    buttonSecondary: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const content = data || {
    title: "Excelencia Clínica & Calidez Humana",
    description: "Odontología avanzada en un entorno de transparencia, luz y confort. Tu sonrisa iluminada con tecnología de vanguardia y un trato personal inigualable.",
    buttonPrimary: "Conoce a la Dra. Gualtieri",
    buttonSecondary: "Ver Especialidades"
  };

  // Lógica para recuperar el degradado naranja automáticamente
  const titleParts = content.title.split('&');
  const firstPart = titleParts[0];
  const secondPart = titleParts.length > 1 ? `& ${titleParts[1]}` : '';

  return (
    <section className="hero" id="inicio">
      {/* Background Image fading to white */}
      <div className="hero__background">
        <Image
          src="/images/hero-bg.png"
          alt="Consultorio de Paula Gualtieri"
          fill
          className="hero__background-image"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="hero__background-overlay"></div>
      </div>

      <div className="hero__inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero__panel"
        >
          <div className="hero__brand">
            <div className="hero__logo">
              <Image 
                src="/images/p-solo.svg" 
                alt="Isologo Paula Gualtieri"
                fill
                className="hero__logo-image"
              />
            </div>
            <span className="hero__eyebrow">
              Paula Gualtieri Odontología
            </span>
          </div>
          
          <h1 
            className="hero__title"
            data-sb-field-path="hero.title"
          >
            {firstPart}
            {secondPart && (
              <>
                <br className="hero__title-break" />
                <span className="hero__title-accent">
                  {secondPart}
                </span>
              </>
            )}
          </h1>
          
          <p 
            className="hero__description"
            data-sb-field-path="hero.description"
          >
            {content.description}
          </p>
          
          <div className="hero__actions">
            <button 
              onClick={() => document.getElementById('equipo')?.scrollIntoView({ behavior: 'smooth' })}
              className="hero__button hero__button--primary"
              data-sb-field-path="hero.buttonPrimary"
            >
              {content.buttonPrimary}
            </button>
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="hero__button hero__button--secondary"
              data-sb-field-path="hero.buttonSecondary"
            >
              {content.buttonSecondary}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={() => {
          document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="hero__scroll"
      >
        <span className="hero__scroll-label">Descubrir</span>
        <ChevronDown className="hero__scroll-icon" />
      </motion.button>
    </section>
  );
}
