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
import { tinaField, useTina } from 'tinacms/dist/react';
import type { TinaVisualPayload, VisualRecord } from '@/cms/tina/visual-data';
import { treatmentFromVisualData } from '@/cms/tina/visual-data';

interface TreatmentDetailContentProps {
  tratamiento: Tratamiento;
  relatedArticles: {
    slug: string;
    title: string;
    excerpt: string;
    readTime: string;
  }[];
  relatedArticlesHref?: string;
  visual: TinaVisualPayload<{ tratamiento: VisualRecord }>;
}

export default function TreatmentDetailContent({
  tratamiento: fallback,
  relatedArticles,
  relatedArticlesHref,
  visual,
}: TreatmentDetailContentProps) {
  const { data } = useTina(visual);
  const editorTreatment = data.tratamiento as VisualRecord;
  const tratamiento = treatmentFromVisualData(editorTreatment, fallback);
  const editorProfessionals = editorTreatment.professionals as VisualRecord[] | undefined;
  const editorCases = editorTreatment.casosClinicos as VisualRecord[] | undefined;
  const editorPageCopy = editorTreatment.pageCopy as VisualRecord | undefined;
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
    <div className="treatment-detail" data-tina-field={tinaField(editorTreatment)}>
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
            <span className="treatment-detail__hero-eyebrow" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'heroEyebrow') : undefined}>
              {tratamiento.pageCopy.heroEyebrow}
            </span>
            
            {/* Etiqueta de título para el lápiz */}
            <h1 
              className="treatment-detail__hero-title"
              data-tina-field={tinaField(editorTreatment, 'tituloHero')}
            >
              {tratamiento.tituloHero}
            </h1>
            
            {/* Etiqueta de descripción para el lápiz */}
            <p 
              className="treatment-detail__hero-description"
              data-tina-field={tinaField(editorTreatment, 'descripcionHero')}
            >
              {tratamiento.descripcionHero}
            </p>
            
            <a 
              href={getWhatsAppLink(`Hola, quiero solicitar una evaluación para ${tratamiento.tituloHero}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="treatment-detail__hero-cta"
              data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'heroCtaLabel') : undefined}
            >
              {tratamiento.pageCopy.heroCtaLabel} <ArrowRight className="treatment-detail__hero-cta-icon" />
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
                data-tina-field={tinaField(editorTreatment, 'heroImage')}
              />
              <div className="treatment-detail__hero-image-overlay"></div>
            </div>
            {tratamiento.professionals && tratamiento.professionals.length > 0 && (
              <div className="treatment-detail__doctor-badge">
                <div className="treatment-detail__doctor-badge-avatars">
                  {tratamiento.professionals.map((professional, index) => (
                    <div className="treatment-detail__doctor-badge-avatar" key={professional.name} data-tina-field={editorProfessionals?.[index] ? tinaField(editorProfessionals[index]) : undefined}>
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
                  {tratamiento.professionals.map((professional, index) => (
                    <li key={professional.name} data-tina-field={editorProfessionals?.[index] ? tinaField(editorProfessionals[index]) : undefined}>
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
                <h2 className="treatment-detail__cases-title" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'casesTitle') : undefined}>{tratamiento.pageCopy.casesTitle}</h2>
                <p className="treatment-detail__cases-description" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'casesDescription') : undefined}>{tratamiento.pageCopy.casesDescription}</p>
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
                      data-tina-field={editorCases?.[idx] ? tinaField(editorCases[idx], caso.imagenDespues ? 'imagenDespues' : caso.imagenAntes ? 'imagenAntes' : 'imagenes') : undefined}
                    />
                    {caso.estado && (
                      <div className="treatment-detail__case-card-status" data-tina-field={editorCases?.[idx] ? tinaField(editorCases[idx], 'estado') : undefined}>
                        {caso.estado}
                      </div>
                    )}
                  </div>
                  <div className="treatment-detail__case-card-content">
                    <h3 className="treatment-detail__case-card-title" data-tina-field={editorCases?.[idx] ? tinaField(editorCases[idx], 'titulo') : undefined}>{caso.titulo}</h3>
                    <div className="treatment-detail__case-card-footer">
                      {caso.fecha && (
                        <span className="treatment-detail__case-card-date" data-tina-field={editorCases?.[idx] ? tinaField(editorCases[idx], 'fecha') : undefined}>{caso.fecha}</span>
                      )}
                      <Link
                        href={`/tratamientos/${tratamiento.id}/casos/${caso.id}`}
                        className="treatment-detail__case-card-link"
                      >
                        {tratamiento.pageCopy.caseLinkLabel}
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
              <span data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'articlesEyebrow') : undefined}>{tratamiento.pageCopy.articlesEyebrow}</span>
              <h2 id="related-articles-title" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'articlesTitle') : undefined}>{tratamiento.pageCopy.articlesTitle}</h2>
            </div>
            <div className="treatment-detail__articles-grid">
              {relatedArticles.map((article) => (
                <article key={article.slug} className="treatment-detail__article-card">
                  <span>{article.readTime}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link href={`/articulos/${article.slug}`} data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'articleLinkLabel') : undefined}>
                    {tratamiento.pageCopy.articleLinkLabel} <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
            {relatedArticlesHref && (
              <div className="treatment-detail__articles-more">
                <Link href={relatedArticlesHref} data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'allArticlesPrefix') : undefined}>
                  {tratamiento.pageCopy.allArticlesPrefix} {tratamiento.tituloHero}
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
               <h2 className="treatment-detail__features-title" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'featuresTitlePrefix') : undefined}>{tratamiento.pageCopy.featuresTitlePrefix} {tratamiento.tituloHero.toLowerCase()}</h2>
               <div className="treatment-detail__features-grid" data-tina-field={tinaField(editorTreatment, 'features')}>
                 {tratamiento.features.map((feature: string, i: number) => (
                   <div key={i} className="treatment-detail__feature-item">
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
              <h2 className="treatment-detail__cta-title" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'ctaTitle') : undefined}>{tratamiento.pageCopy.ctaTitle}</h2>
              <p className="treatment-detail__cta-description" data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'ctaDescription') : undefined}>{tratamiento.pageCopy.ctaDescription}</p>
              <div className="treatment-detail__cta-actions">
                <a 
                  href={getWhatsAppLink(`Hola, quiero solicitar una evaluación para ${tratamiento.tituloHero}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="treatment-detail__cta-button"
                  data-tina-field={editorPageCopy ? tinaField(editorPageCopy, 'ctaButtonLabel') : undefined}
                >
                  {tratamiento.pageCopy.ctaButtonLabel} <CheckCircle2 className="treatment-detail__cta-button-icon" />
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
