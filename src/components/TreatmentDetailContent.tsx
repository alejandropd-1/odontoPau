'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import TreatmentIcon from '@/components/TreatmentIcon';
import type { Tratamiento } from '@/data/tratamientos';
import { getTreatmentProfessionalMobileRole } from '@/lib/treatment-professionals';

interface TreatmentDetailContentProps {
  tratamiento: Tratamiento;
  caseArticleHrefs: Record<string, string>;
  relatedArticles: {
    slug: string;
    title: string;
    excerpt: string;
    readTime: string;
  }[];
  relatedArticlesHref?: string;
}

export default function TreatmentDetailContent({
  tratamiento,
  caseArticleHrefs,
  relatedArticles,
  relatedArticlesHref,
}: TreatmentDetailContentProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <div className="treatment-detail" data-sb-object-id={tratamiento.sourcePath}>
      <Navbar />
      
      <div className="treatment-detail__breadcrumb-spacer">
        <Breadcrumb items={[{ label: tratamiento.tituloHero }]} />
      </div>

      {/* Hero Section */}
      <section className="treatment-detail__hero">
        <div className="treatment-detail__hero-inner">
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            <span className="treatment-detail__hero-eyebrow">
              Atención odontológica
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
              href={getWhatsAppLink(`Hola, quiero solicitar una evaluación para ${tratamiento.tituloHero}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="treatment-detail__hero-cta"
            >
              Solicitar evaluación <ArrowRight className="treatment-detail__hero-cta-icon" />
            </a>
          </motion.div>

          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
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
            {tratamiento.professionals && tratamiento.professionals.length > 0 && (
              <div className="treatment-detail__doctor-badge">
                <div className="treatment-detail__doctor-badge-avatars">
                  {tratamiento.professionals.map((professional) => (
                    <div className="treatment-detail__doctor-badge-avatar" key={professional.name}>
                      <Image
                        src={professional.image}
                        alt={professional.imageAlt}
                        fill
                        sizes="48px"
                        className="treatment-detail__doctor-badge-avatar-image"
                      />
                    </div>
                  ))}
                </div>
                <ul className="treatment-detail__doctor-badge-info" aria-label="Profesionales del tratamiento">
                  {tratamiento.professionals.map((professional) => (
                    <li key={professional.name}>
                      <p className="treatment-detail__doctor-badge-name">{professional.name}</p>
                      <p className="treatment-detail__doctor-badge-role">
                        <span className="treatment-detail__doctor-badge-role-mobile">
                          {getTreatmentProfessionalMobileRole(professional)}
                        </span>
                        <span className="treatment-detail__doctor-badge-role-desktop">
                          {professional.role}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                <p className="treatment-detail__cases-description">Registros clínicos que documentan distintos abordajes del equipo.</p>
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
              {tratamiento.casosClinicos.map((caso, idx) => (
                <motion.div 
                  key={caso.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : idx * 0.1 }}
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
                      <Link
                        href={caseArticleHrefs[String(caso.id)] ?? `/tratamientos/${tratamiento.id}/casos/${caso.id}`}
                        className="treatment-detail__case-card-link"
                      >
                        Ver caso completo
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="treatment-detail__articles" aria-labelledby="related-articles-title">
          <div className="treatment-detail__articles-inner">
            <div className="treatment-detail__articles-header">
              <span>Para entender mejor el tratamiento</span>
              <h2 id="related-articles-title">Artículos relacionados</h2>
            </div>
            <div className="treatment-detail__articles-grid">
              {relatedArticles.map((article) => (
                <article key={article.slug} className="treatment-detail__article-card">
                  <span>{article.readTime}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link href={`/articulos/${article.slug}`}>
                    Leer artículo <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
            {relatedArticlesHref && (
              <div className="treatment-detail__articles-more">
                <Link href={relatedArticlesHref}>
                  Ver todos los artículos de {tratamiento.tituloHero}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section (Orange Box) */}
      <section className="treatment-detail__features">
        <div className="treatment-detail__features-inner">
          <div className="treatment-detail__features-box">
             {/* Decorative Background Icon */}
              <div className="treatment-detail__features-bg-icon">
                 <TreatmentIcon name={tratamiento.icon} className="treatment-detail__features-bg-icon-svg" />
              </div>

             <div className="treatment-detail__features-content">
               <h2 className="treatment-detail__features-title">Aspectos de {tratamiento.tituloHero.toLowerCase()}</h2>
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

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="treatment-detail__cta">
        <div className="treatment-detail__cta-inner">
          <div className="treatment-detail__cta-box">
            <div className="treatment-detail__cta-bg-glow"></div>
            
            <div className="treatment-detail__cta-content">
              <h2 className="treatment-detail__cta-title">¿Querés consultar por este tratamiento?</h2>
              <p className="treatment-detail__cta-description">Escribinos para coordinar una evaluación y conversar sobre las opciones adecuadas para tu caso.</p>
              <div className="treatment-detail__cta-actions">
                <a 
                  href={getWhatsAppLink(`Hola, quiero solicitar una evaluación para ${tratamiento.tituloHero}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="treatment-detail__cta-button"
                >
                  Solicitar evaluación <CheckCircle2 className="treatment-detail__cta-button-icon" />
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
