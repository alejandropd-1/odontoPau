'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import type { CasoClinico, Tratamiento } from '@/data/tratamientos';

interface CaseDetailContentProps {
  tratamiento: Tratamiento;
  caso: CasoClinico;
}

export default function CaseDetailContent({ tratamiento, caso }: CaseDetailContentProps) {
  const whatsappNumber = '5491137854198';
  const getWhatsAppLink = (message: string) => 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="case-detail">
      <Navbar />
      
      <div className="case-detail__breadcrumb-spacer">
        <Breadcrumb 
          items={[
            { label: tratamiento.tituloHero, href: `/tratamientos/${tratamiento.id}` },
            { label: `Caso: ${caso.titulo}` }
          ]} 
        />
      </div>

      {/* Hero Section */}
      <section className="case-detail__hero">
        <div className="case-detail__hero-inner">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="case-detail__hero-badge"
          >
            Caso de Éxito: {tratamiento.tituloHero}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="case-detail__hero-title"
          >
            Caso Clínico: <span className="case-detail__hero-title-accent">{caso.titulo}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="case-detail__hero-description"
          >
            Un viaje desde el malestar crónico hasta la sonrisa definitiva mediante tecnología de precisión.
          </motion.p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="case-detail__comparison">
        <div className="case-detail__comparison-inner">
          <div className="case-detail__comparison-grid">
            {caso.imagenes ? (
              caso.imagenes.map((img: string, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="case-detail__comparison-card"
                >
                  <div className="case-detail__comparison-image-wrap">
                    <Image 
                      src={img} 
                      alt={`Imagen ${idx + 1}`}
                      fill
                      className="case-detail__comparison-image"
                    />
                  </div>
                  {caso.etiquetasImagenes && caso.etiquetasImagenes[idx] && (
                    <div className={`case-detail__comparison-label ${caso.etiquetasImagenes[idx].toUpperCase() === 'ANTES' ? 'case-detail__comparison-label--before' : ''}`}>
                      {caso.etiquetasImagenes[idx]}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <>
                {caso.imagenAntes && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="case-detail__comparison-card"
                  >
                    <div className="case-detail__comparison-image-wrap">
                      <Image 
                        src={caso.imagenAntes} 
                        alt="Antes"
                        fill
                        className="case-detail__comparison-image"
                      />
                    </div>
                    <div className="case-detail__comparison-label case-detail__comparison-label--before">ANTES</div>
                  </motion.div>
                )}
                {caso.imagenDespues && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="case-detail__comparison-card"
                  >
                    <div className="case-detail__comparison-image-wrap case-detail__comparison-image-wrap--after">
                      <Image 
                        src={caso.imagenDespues} 
                        alt="Después"
                        fill
                        className="case-detail__comparison-image"
                      />
                    </div>
                    <div className="case-detail__comparison-label">DESPUÉS</div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="case-detail__details">
        <div className="case-detail__details-inner">
          {/* Challenge */}
          <div className="case-detail__challenge">
            <div>
              <div className="case-detail__challenge-heading">
                <AlertCircle className="case-detail__challenge-icon" />
                <h2 className="case-detail__challenge-title">El Desafío</h2>
              </div>
              <p className="case-detail__challenge-text">
                {caso.desafio || 'El paciente presentaba una situación clínica compleja que afectaba tanto su salud bucodental como su bienestar emocional.'}
              </p>
              <div className="case-detail__info-cards">
                <div className="case-detail__info-card">
                  <h4 className="case-detail__info-card-title">Diagnóstico</h4>
                  <p className="case-detail__info-card-text">{caso.diagnostico || 'Evaluación pendiente de detalle.'}</p>
                </div>
                <div className="case-detail__info-card">
                  <h4 className="case-detail__info-card-title">Duración</h4>
                  <p className="case-detail__info-card-text">{caso.duracion || 'Variable según evolución.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="case-detail__solution">
            <h2 className="case-detail__solution-title">Nuestra Solución</h2>
            <p className="case-detail__solution-text">
              {caso.solucion || 'Implementamos un abordaje integral basado en tecnología digital para garantizar resultados óptimos y duraderos.'}
            </p>
            <ul className="case-detail__solution-list">
              {(caso.solucionFeatures || ['Planificación 3D', 'Materiales Premium', 'Seguimiento Personalizado']).map((f: string, i: number) => (
                <li key={i} className="case-detail__solution-item">
                  <div className="case-detail__solution-icon-wrap">
                    <CheckCircle2 className="case-detail__solution-icon" />
                  </div>
                  <span className="case-detail__solution-item-text">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* CTA Footer */}
      <section className="case-detail__cta">
        <div className="case-detail__cta-inner">
          <div className="case-detail__cta-box">
            <div className="case-detail__cta-glow-wrap">
              <div className="case-detail__cta-glow"></div>
            </div>
            
            <h2 className="case-detail__cta-title">
              ¿Querés lograr un resultado similar?
            </h2>
            <p className="case-detail__cta-description">
              Agendá tu consulta hoy mismo y comenzá tu propia transformación.
            </p>
            <div className="case-detail__cta-actions">
              <a 
                href={getWhatsAppLink(`Vi el caso de ${tratamiento.tituloHero} y me gustaría lograr un resultado similar`)}
                target="_blank"
                rel="noopener noreferrer"
                className="case-detail__cta-button case-detail__cta-button--primary"
              >
                Agendar Consulta <ArrowRight className="case-detail__cta-button-icon" />
              </a>
              <Link 
                href={`/tratamientos/${tratamiento.id}`}
                className="case-detail__cta-button case-detail__cta-button--secondary"
              >
                Ver otros casos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
