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
    subtitle: string;
    logo: string;
    backgroundImage: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const content = data || {
    title: "Excelencia Clínica & Calidez Humana",
    description: "Odontología avanzada en un entorno de transparencia, luz y confort. Tu sonrisa iluminada con tecnología de vanguardia y un trato personal inigualable.",
    buttonPrimary: "Conoce a la Dra. Gualtieri",
    buttonSecondary: "Ver Especialidades",
    subtitle: "Paula Gualtieri Odontología",
    logo: "/images/p-solo.svg",
    backgroundImage: "/images/hero-bg.png"
  };

  // Improved title parsing to handle cases with and without '&'
  const title = content.title || "Excelencia Clínica & Calidez Humana";
  const hasAmpersand = title.includes('&');
  let firstPart = title;
  let secondPart = "";

  if (hasAmpersand) {
    const parts = title.split('&');
    firstPart = parts[0].trim();
    secondPart = `& ${parts[1].trim()}`;
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white" id="inicio" data-sb-field-path="hero">
      {/* Background Image fading to white */}
      <div className="absolute inset-0 z-0" data-sb-field-path=".backgroundImage">
        <Image
          src={content.backgroundImage}
          alt="Consultorio de Paula Gualtieri"
          fill
          className="w-full h-full object-cover object-center opacity-60 grayscale-[5%] blur-[0.5px]"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-white/40 to-white"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-24 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel p-8 md:p-14 rounded-3xl max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 relative mb-4" data-sb-field-path=".logo">
              <Image 
                src={content.logo} 
                alt="Isologo Paula Gualtieri"
                fill
                className="object-contain"
              />
            </div>
            <span 
              className="text-[11px] md:text-[13px] font-bold tracking-[0.5em] text-on-surface-variant/60 uppercase"
              data-sb-field-path=".subtitle"
            >
              {content.subtitle}
            </span>
          </div>
          
          <h1 
            className="text-3xl md:text-5xl font-extrabold text-on-surface mb-4 md:mb-6 leading-tight"
            data-sb-field-path=".title"
          >
            {firstPart}{' '}
            {secondPart && (
              <>
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary-container to-brand-orange bg-clip-text text-transparent inline-block">
                  {secondPart}
                </span>
              </>
            )}
          </h1>
          
          <p 
            className="text-[13px] md:text-base text-on-surface-variant mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed opacity-90"
            data-sb-field-path=".description"
          >
            {content.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('equipo')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary-container to-brand-orange text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:scale-105 active:scale-95"
              data-sb-field-path=".buttonPrimary"
            >
              {content.buttonPrimary}
            </button>
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-panel border-primary-container text-primary-container font-bold px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-orange-50 transition-all hover:scale-105 active:scale-95"
              data-sb-field-path=".buttonSecondary"
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
        className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 opacity-70 hover:opacity-100 transition-opacity cursor-pointer group"
      >
        <span className="text-xs md:text-sm font-bold text-on-surface-variant mb-1 md:mb-2 group-hover:text-primary-container transition-colors">Descubrir</span>
        <ChevronDown className="text-primary-container group-hover:scale-110 transition-transform w-5 h-5 md:w-6 md:h-6" />
      </motion.button>
    </section>
  );
}
