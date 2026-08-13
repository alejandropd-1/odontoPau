'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { tinaField } from 'tinacms/dist/react';
import type { VisualRecord } from '@/cms/tina/visual-data';

interface HeroProps {
  data?: {
    title: string;
    description: string;
    buttonPrimary: string;
    buttonSecondary: string;
    backgroundImage: string;
    backgroundAlt: string;
    eyebrow: string;
    scrollLabel: string;
  };
  editorData?: VisualRecord;
}

export default function Hero({ data, editorData }: HeroProps) {
  const content = data || {
    title: "Excelencia Clínica & Calidez Humana",
    description: "Odontología avanzada en un entorno de transparencia, luz y confort. Tu sonrisa iluminada con tecnología de vanguardia y un trato personal inigualable.",
    buttonPrimary: "Conoce a la Dra. Gualtieri",
    buttonSecondary: "Ver Especialidades",
    backgroundImage: "/images/hero-bg.png",
    backgroundAlt: "Consultorio de Paula Gualtieri",
    eyebrow: "Paula Gualtieri Odontología",
    scrollLabel: "Descubrir"
  };

  // Lógica para recuperar el degradado naranja automáticamente
  const titleParts = content.title.split('&');
  const firstPart = titleParts[0];
  const secondPart = titleParts.length > 1 ? `& ${titleParts[1]}` : '';

  return (
    <section className="hero" id="inicio" data-tina-field={editorData ? tinaField(editorData) : undefined}>
      {/* Background Image fading to white */}
      <div className="hero__background">
        <Image
          src={content.backgroundImage}
          alt={content.backgroundAlt}
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
              {content.eyebrow}
            </span>
          </div>
          
          <h1 
            className="hero__title"
            data-tina-field={editorData ? tinaField(editorData, 'title') : undefined}
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
            data-tina-field={editorData ? tinaField(editorData, 'description') : undefined}
          >
            {content.description}
          </p>
          
          <div className="hero__actions">
            <button 
              onClick={() => document.getElementById('equipo')?.scrollIntoView({ behavior: 'smooth' })}
              className="hero__button hero__button--primary"
              data-tina-field={editorData ? tinaField(editorData, 'buttonPrimary') : undefined}
            >
              {content.buttonPrimary}
            </button>
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="hero__button hero__button--secondary"
              data-tina-field={editorData ? tinaField(editorData, 'buttonSecondary') : undefined}
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
        <span className="hero__scroll-label" data-tina-field={editorData ? tinaField(editorData, 'scrollLabel') : undefined}>{content.scrollLabel}</span>
        <ChevronDown className="hero__scroll-icon" />
      </motion.button>
    </section>
  );
}
