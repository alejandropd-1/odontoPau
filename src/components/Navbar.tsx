'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/20 bg-white/70 backdrop-blur-[15px] shadow-sm shadow-orange-500/5">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-sans">
            Paula Gualtieri
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link className="font-sans text-sm font-semibold tracking-tight text-slate-700 hover:text-orange-500 transition-colors" href="/#inicio">Inicio</Link>
          <Link className="font-sans text-sm font-semibold tracking-tight text-slate-700 hover:text-orange-500 transition-colors" href="/#servicios">Servicios</Link>
          <Link className="font-sans text-sm font-semibold tracking-tight text-slate-700 hover:text-orange-500 transition-colors" href="/#testimonios">Testimonios</Link>
          <Link className="font-sans text-sm font-semibold tracking-tight text-slate-700 hover:text-orange-500 transition-colors" href="/#ubicacion">Ubicación</Link>
        </div>
        <a 
          href="https://wa.me/5491137854198?text=Hola,%20quiero%20sacar%20un%20turno"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-primary-container to-brand-orange text-white font-sans text-sm font-semibold px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
        >
          Agendar Turno
        </a>
      </div>
    </nav>
  );
}
