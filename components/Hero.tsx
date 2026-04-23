'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white" id="inicio">
      {/* Background Image fading to white */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://picsum.photos/seed/dental-minimal/1920/1080" 
          alt="Consultorio de Paula Gualtieri" 
          fill
          className="w-full h-full object-cover object-center opacity-30 grayscale-[10%] blur-[1px]"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-24 md:pt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel p-6 md:p-16 rounded-3xl max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold text-on-surface mb-4 md:mb-6 leading-tight">
            Excelencia Clínica & <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary-container to-brand-orange bg-clip-text text-transparent italic">Calidez Humana</span>
          </h1>
          <p className="text-base md:text-xl text-on-surface-variant mb-6 md:mb-10 max-w-xl mx-auto leading-relaxed">
            Odontología avanzada en un entorno de transparencia, luz y confort. Tu sonrisa iluminada con tecnología de vanguardia y un trato personal inigualable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary-container to-brand-orange text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:scale-105 active:scale-95">
              Conoce a la Dra. Gualtieri
            </button>
            <button className="glass-panel border-primary-container text-primary-container font-bold px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-orange-50 transition-all hover:scale-105 active:scale-95">
              Ver Especialidades
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
