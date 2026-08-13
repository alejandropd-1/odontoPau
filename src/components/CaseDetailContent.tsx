'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import type { CasoClinico, Tratamiento } from '@/data/tratamientos';
import { tinaField, useTina } from 'tinacms/dist/react';
import type { TinaVisualPayload, VisualRecord } from '@/cms/tina/visual-data';
import { treatmentFromVisualData } from '@/cms/tina/visual-data';

interface CaseDetailContentProps {
  tratamiento: Tratamiento;
  caso: CasoClinico;
  linkedArticle?: { slug: string; title: string };
  visual: TinaVisualPayload<{ tratamiento: VisualRecord }>;
}

export default function CaseDetailContent({
  tratamiento: fallbackTreatment,
  caso: fallbackCase,
  linkedArticle,
  visual,
}: CaseDetailContentProps) {
  const { data } = useTina(visual);
  const editorTreatment = data.tratamiento as VisualRecord;
  const tratamiento = treatmentFromVisualData(editorTreatment, fallbackTreatment);
  const caseIndex = tratamiento.casosClinicos.findIndex((item) => item.id === fallbackCase.id);
  const caso = caseIndex >= 0 ? tratamiento.casosClinicos[caseIndex] : fallbackCase;
  const editorCase = (editorTreatment.casosClinicos as VisualRecord[] | undefined)?.[caseIndex];
  const caseMarker = (field: string) => editorCase ? tinaField(editorCase, field) : undefined;
  const shouldReduceMotion = useReducedMotion();
  const whatsappNumber = '5491137854198';
  const getWhatsAppLink = (message: string) => 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const caseImages = caso.imagenes
    ? caso.imagenes.map((src, index) => ({ src, label: caso.etiquetasImagenes?.[index] }))
    : [
        caso.imagenAntes ? { src: caso.imagenAntes, label: 'Antes' } : null,
        caso.imagenDespues ? { src: caso.imagenDespues, label: 'Después' } : null,
      ].filter((image): image is { src: string; label: string } => image !== null);
  const hasCaseContext = Boolean(caso.desafio || caso.diagnostico || caso.duracion);
  const hasApproach = Boolean(caso.solucion || caso.solucionFeatures?.length);
  const hasDetails = hasCaseContext || hasApproach;

  return (
    <div className="case-detail" data-tina-field={editorCase ? tinaField(editorCase) : undefined}>
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
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="case-detail__hero-badge"
            data-tina-field={tinaField(editorTreatment, 'tituloHero')}
          >
            Caso clínico: {tratamiento.tituloHero}
          </motion.span>
          <motion.h1 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="case-detail__hero-title"
            data-tina-field={caseMarker('titulo')}
          >
            Caso clínico: <span className="case-detail__hero-title-accent">{caso.titulo}</span>
          </motion.h1>
          <motion.p 
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="case-detail__hero-description"
            data-tina-field={caseMarker('descripcion')}
          >
            {caso.descripcion}
          </motion.p>
        </div>
      </section>

      {/* Comparison Section */}
      {caseImages.length > 0 && <section className="case-detail__comparison" aria-label="Registros del caso">
        <div className="case-detail__comparison-inner">
          <div className="case-detail__comparison-grid">
            {caseImages.map((image, idx) => (
                <motion.div 
                  key={image.src}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="case-detail__comparison-card"
                  data-tina-field={caseMarker(caso.imagenes?.length ? 'imagenes' : idx === 0 ? 'imagenAntes' : 'imagenDespues')}
                >
                  <div className="case-detail__comparison-image-wrap">
                    <Image 
                      src={image.src}
                      alt={image.label ? `${image.label} del caso ${caso.titulo}` : `Registro ${idx + 1} del caso ${caso.titulo}`}
                      fill
                      className="case-detail__comparison-image"
                    />
                  </div>
                  {image.label && (
                    <div className={`case-detail__comparison-label ${image.label.toUpperCase() === 'ANTES' ? 'case-detail__comparison-label--before' : ''}`}>
                      {image.label}
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      </section>}

      {/* Details Section */}
      {hasDetails && <section className="case-detail__details">
        <div className={`case-detail__details-inner${hasCaseContext && hasApproach ? '' : ' case-detail__details-inner--single'}`}>
          {/* Challenge */}
          {hasCaseContext && <div className="case-detail__challenge">
            <div>
              <div className="case-detail__challenge-heading">
                <AlertCircle className="case-detail__challenge-icon" aria-hidden="true" />
                <h2 className="case-detail__challenge-title">El caso</h2>
              </div>
              {caso.desafio && <p className="case-detail__challenge-text" data-tina-field={caseMarker('desafio')}>{caso.desafio}</p>}
              {(caso.diagnostico || caso.duracion) && <div className="case-detail__info-cards">
                {caso.diagnostico && <div className="case-detail__info-card">
                  <h4 className="case-detail__info-card-title">Diagnóstico</h4>
                  <p className="case-detail__info-card-text" data-tina-field={caseMarker('diagnostico')}>{caso.diagnostico}</p>
                </div>}
                {caso.duracion && <div className="case-detail__info-card">
                  <h4 className="case-detail__info-card-title">Duración</h4>
                  <p className="case-detail__info-card-text" data-tina-field={caseMarker('duracion')}>{caso.duracion}</p>
                </div>}
              </div>}
            </div>
          </div>}

          {/* Solution */}
          {hasApproach && <div className="case-detail__solution">
            <h2 className="case-detail__solution-title">Abordaje documentado</h2>
            {caso.solucion && <p className="case-detail__solution-text" data-tina-field={caseMarker('solucion')}>{caso.solucion}</p>}
            {caso.solucionFeatures && caso.solucionFeatures.length > 0 && <ul className="case-detail__solution-list" data-tina-field={caseMarker('solucionFeatures')}>
              {caso.solucionFeatures.map((feature) => (
                <li key={feature} className="case-detail__solution-item">
                  <div className="case-detail__solution-icon-wrap">
                    <CheckCircle2 className="case-detail__solution-icon" aria-hidden="true" />
                  </div>
                  <span className="case-detail__solution-item-text">{feature}</span>
                </li>
              ))}
            </ul>}
          </div>}
        </div>
      </section>}


      {/* CTA Footer */}
      <section className="case-detail__cta">
        <div className="case-detail__cta-inner">
          <div className="case-detail__cta-box">
            <div className="case-detail__cta-glow-wrap">
              <div className="case-detail__cta-glow"></div>
            </div>
            
            <h2 className="case-detail__cta-title">
              ¿Querés consultar por este tratamiento?
            </h2>
            <p className="case-detail__cta-description">
              Cada situación requiere una evaluación individual. Podés escribirnos para coordinar una consulta.
            </p>
            <div className="case-detail__cta-actions">
              <a 
                href={getWhatsAppLink(`Hola, vi el caso de ${tratamiento.tituloHero} y quiero coordinar una evaluación`)}
                target="_blank"
                rel="noopener noreferrer"
                className="case-detail__cta-button case-detail__cta-button--primary"
              >
                Solicitar evaluación <ArrowRight className="case-detail__cta-button-icon" />
              </a>
              <Link 
                href={`/tratamientos/${tratamiento.id}`}
                className="case-detail__cta-button case-detail__cta-button--secondary"
              >
                Ver otros casos
              </Link>
              {linkedArticle && caso.articleSlug === linkedArticle.slug ? (
                <Link
                  href={`/articulos/${linkedArticle.slug}`}
                  className="case-detail__cta-button case-detail__cta-button--secondary"
                  data-tina-field={caseMarker('articleSlug')}
                >
                  Leer artículo relacionado: {linkedArticle.title}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
