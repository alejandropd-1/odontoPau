'use client';

import React from 'react';
import Link from 'next/link';
import { siteFeatures } from '@/config/site-features';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand">
          <span>Paula Gualtieri</span>
        </Link>
        <div className="navbar__links">
          <Link className="navbar__link" href="/#inicio">Inicio</Link>
          <Link className="navbar__link" href="/tratamientos">Servicios</Link>
          <Link className="navbar__link" href="/articulos">Artículos</Link>
          <Link className="navbar__link" href="/instrucciones">Instrucciones</Link>
          {siteFeatures.testimonials && (
            <Link className="navbar__link" href="/#testimonios">Testimonios</Link>
          )}
          <Link className="navbar__link" href="/#ubicacion">Ubicación</Link>
        </div>
        <a 
          href="https://wa.me/5491137854198?text=Hola,%20quiero%20sacar%20un%20turno"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar__cta"
        >
          Agendar Turno
        </a>
      </div>
    </nav>
  );
}
