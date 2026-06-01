'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { tratamientos } from '@/data/tratamientos';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

interface TreatmentDetailContentProps {
  id: string;
}

export default function TreatmentDetailContent({ id }: TreatmentDetailContentProps) {
  const tratamiento = tratamientos.find((t) => t.id === id);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  if (!tratamiento) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 400; 
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const whatsappNumber = '5491137854198';
  const getWhatsAppLink = (message: string) => 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // La ruta del archivo para el object-id en Netlify
  const objectId = `src/data/tratamientos/${id}.json`;

  return (
    <div className="treatment-detail" data-sb-object-id={objectId}>
      <Navbar />
      
      <div className="treatment-detail__breadcrumb-spacer">
        <Breadcrumb items={[{ label: tratamiento.tituloHero }]} />
      </div>

      {/* Hero Section */}
      <section className="treatment-detail__hero">
        <div className="treatment-detail__hero-inner">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="treatment-detail__hero-eyebrow">
              Excelencia Restaurativa
            </span>
            
            {/* Etiqueta de título para el lápiz */}
            <h1 
              className="treatment-detail__hero-title"
              data-sb-field-path="tituloHero"
            >
              {tratamiento.tituloHero}
            </h1>
            
            {/* Etiqueta de descripción para el lápiz */}
            <p 
              className="treatment-detail__hero-description"
              data-sb-field-path="descripcionHero"
            >
              {tratamiento.descripcionHero}
            </p>
            
            <a 
              href={getWhatsAppLink(`Hola, quiero solicitar una valoración para ${tratamiento.tituloHero}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="treatment-detail__hero-cta"
            >
              Solicitar Valoración <ArrowRight className="treatment-detail__hero-cta-icon" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="treatment-detail__hero-media"
          >
            <div className="treatment-detail__hero-image-wrap">
              <Image 
                src={tratamiento.heroImage} 
                alt={tratamiento.tituloHero}
                fill
                className="treatment-detail__hero-image"
                data-sb-field-path="heroImage"
              />
              <div className="treatment-detail__hero-image-overlay"></div>
            </div>
            {/* Dr. Badge Overlay */}
            <div className="treatment-detail__doctor-badge">
              <div className="treatment-detail__doctor-badge-avatar">
                <span className="treatment-detail__doctor-badge-initials">PG</span>
              </div>
              <div className="treatment-detail__doctor-badge-info">
                {id === 'pediatria' ? (
                  <>
                    <p className="treatment-detail__doctor-badge-name">Dra. Paula Gualtieri</p>
                    <p className="treatment-detail__doctor-badge-name">Dra. Emilia Omastott</p>
                    <p className="treatment-detail__doctor-badge-role">Especialistas en {tratamiento.tituloHero}</p>
                  </>
                ) : id === 'implantes' ? (
                  <>
                    <p className="treatment-detail__doctor-badge-role">Paula Gualtieri Odontología</p>
                    <p className="treatment-detail__doctor-badge-name">Dr. Roberto Dominguez</p>
                    <p className="treatment-detail__doctor-badge-role">Especialista en Rehabilitación Oral</p>
                  </>
                ) : id === 'estetica-dental' ? (
                  <>
                    <p className="treatment-detail__doctor-badge-role">Paula Gualtieri Odontología</p>
                    <p className="treatment-detail__doctor-badge-name">Dr. Roberto Dominguez</p>
                    <p className="treatment-detail__doctor-badge-role">Especialista en {tratamiento.tituloHero}</p>
                  </>
                ) : (
                  <>
                    <p className="treatment-detail__doctor-badge-name">Dra. Paula Gualtieri</p>
                    <p className="treatment-detail__doctor-badge-role">Especialista en {tratamiento.tituloHero}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clinical Cases Section */}
      {tratamiento.casosClinicos && tratamiento.casosClinicos.length > 0 && (
        <section className="treatment-detail__cases">
          <div className="treatment-detail__cases-inner">
            <div className="treatment-detail__cases-header">
              <div>
                <h2 className="treatment-detail__cases-title">Casos Clínicos</h2>
                <p className="treatment-detail__cases-description">Descubre cómo hemos transformado vidas a través de la reconstrucción dental avanzada. Resultados reales de pacientes reales.</p>
              </div>
              <div className="treatment-detail__cases-controls">
                <button 
                  onClick={() => scroll('left')}
                  className="treatment-detail__cases-control"
                  aria-label="Anterior caso"
                >
                  <ArrowRight className="treatment-detail__cases-control-icon treatment-detail__cases-control-icon--left" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="treatment-detail__cases-control"
                  aria-label="Siguiente caso"
                >
                  <ArrowRight className="treatment-detail__cases-control-icon" />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="treatment-detail__cases-scroller"
            >
              {tratamiento.casosClinicos.map((caso: any, idx: number) => (
                <motion.div 
                  key={caso.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="treatment-detail__case-card"
                >
                  <div className="treatment-detail__case-card-image-wrap">
                    <Image 
                      src={caso.imagenDespues || caso.imagenAntes || (caso.imagenes && caso.imagenes.length > 0 ? caso.imagenes[caso.imagenes.length - 1] : '')} 
                      alt={caso.titulo}
                      fill
                      className="treatment-detail__case-card-image"
                    />
                    {caso.estado && (
                      <div className="treatment-detail__case-card-status">
                        {caso.estado}
                      </div>
                    )}
                  </div>
                  <div className="treatment-detail__case-card-content">
                    <h3 className="treatment-detail__case-card-title">{caso.titulo}</h3>
                    <div className="treatment-detail__case-card-footer">
                      {caso.fecha && (
                        <span className="treatment-detail__case-card-date">{caso.fecha}</span>
                      )}
                      <Link href={`/tratamientos/${tratamiento.id}/casos/${caso.id}`} className="treatment-detail__case-card-link">Ver Caso Completo</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section (Orange Box) */}
      <section className="treatment-detail__features">
        <div className="treatment-detail__features-inner">
          <div className="treatment-detail__features-box">
             {/* Decorative Background Icon */}
              <div className="treatment-detail__features-bg-icon">
                 {/* @ts-ignore */}
                 <tratamiento.icon className="treatment-detail__features-bg-icon-svg" />
              </div>

             <div className="treatment-detail__features-content">
               <h2 className="treatment-detail__features-title">¿Por qué elegir nuestros {tratamiento.tituloHero.toLowerCase()}?</h2>
               <div className="treatment-detail__features-grid" data-sb-field-path="features">
                 {tratamiento.features.map((feature: string, i: number) => (
                   <div key={i} className="treatment-detail__feature-item" data-sb-field-path={`.${i}`}>
                     <div className="treatment-detail__feature-icon-wrap">
                       <CheckCircle2 className="treatment-detail__feature-icon" />
                     </div>
                     <span className="treatment-detail__feature-text">{feature}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="treatment-detail__features-stats">
                <div className="treatment-detail__stat-card">
                  <p className="treatment-detail__stat-value">98%</p>
                  <p className="treatment-detail__stat-label">Tasa de Éxito</p>
                </div>
                <div className="treatment-detail__stat-card">
                  <p className="treatment-detail__stat-value">15+</p>
                  <p className="treatment-detail__stat-label">Años de Experiencia</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="treatment-detail__cta">
        <div className="treatment-detail__cta-inner">
          <div className="treatment-detail__cta-box">
            <div className="treatment-detail__cta-bg-glow"></div>
            
            <div className="treatment-detail__cta-content">
              <h2 className="treatment-detail__cta-title">¿Listo para transformar su sonrisa?</h2>
              <p className="treatment-detail__cta-description">Unite a los pacientes que han recuperado su confianza con nuestro tratamientos de vanguardia.</p>
              <div className="treatment-detail__cta-actions">
                <a 
                  href={getWhatsAppLink(`Hola, quiero agendar mi cita para el tratamiento de ${tratamiento.tituloHero}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="treatment-detail__cta-button"
                >
                  Agendar Cita <CheckCircle2 className="treatment-detail__cta-button-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
