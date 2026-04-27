'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white py-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-8 max-w-7xl mx-auto">
        <div className="font-extrabold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-sans text-2xl tracking-tight">Paula Gualtieri</div>

        <div className="text-sm font-medium text-slate-400">
          © {new Date().getFullYear()} Paula Gualtieri Odontología. Todos los derechos reservados.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {['Instagram', 'Facebook', 'LinkedIn', 'Aviso Legal'].map((link) => (
            <a
              key={link}
              className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
