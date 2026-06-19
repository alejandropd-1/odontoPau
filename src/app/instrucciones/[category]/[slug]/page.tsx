import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShareArticleMenu from '@/components/ShareArticleMenu';
import { publishedInstrucciones } from '@/data/instrucciones';
import { getTratamientoById } from '@/data/tratamientos';

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

function getInstruction(category: string, slug: string) {
  return publishedInstrucciones.find((item) => item.category === category && item.slug === slug);
}

function getInstructionUrl(category: string, slug: string) {
  return `https://paulagualtieri.com/instrucciones/${category}/${slug}`;
}

export function generateStaticParams() {
  return publishedInstrucciones.map((item) => ({
    category: item.category,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const instruction = getInstruction(category, slug);

  if (!instruction) {
    return {
      title: 'Instruccion no encontrada',
    };
  }

  const service = instruction.serviceId ? getTratamientoById(instruction.serviceId) : undefined;
  const canonicalUrl = getInstructionUrl(instruction.category, instruction.slug);
  const shareImage = instruction.shareImage || service?.heroImage || '/images/isologo.png';

  return {
    title: instruction.title,
    description: instruction.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${instruction.title} | Dra. Paula Gualtieri`,
      description: instruction.excerpt,
      type: 'article',
      url: canonicalUrl,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: instruction.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: instruction.title,
      description: instruction.excerpt,
      images: [shareImage],
    },
  };
}

export default async function InstructionDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const instruction = getInstruction(category, slug);

  if (!instruction) {
    notFound();
  }

  const service = instruction.serviceId ? getTratamientoById(instruction.serviceId) : undefined;
  const canonicalUrl = getInstructionUrl(instruction.category, instruction.slug);

  return (
    <main className="instruction-detail" data-sb-object-id={instruction.sourcePath}>
      <Navbar />

      <article className="instruction-detail__article">
        <div className="instruction-detail__inner">
          <Link className="instruction-detail__back-link" href="/instrucciones">
            <ArrowLeft className="instruction-detail__back-link-icon" />
            Volver a instrucciones
          </Link>

          <div className="instruction-detail__hero">
            <div className="instruction-detail__hero-content">
              <span className="instruction-detail__eyebrow">{instruction.heroLabel || instruction.categoryLabel}</span>
              <h1 className="instruction-detail__title">{instruction.title}</h1>
              <p className="instruction-detail__excerpt">{instruction.excerpt}</p>

              <div className="instruction-detail__meta">
                <span className="instruction-detail__meta-item">
                  <Calendar className="instruction-detail__meta-icon" />
                  {instruction.date}
                </span>
                <span className="instruction-detail__meta-item">
                  <Clock className="instruction-detail__meta-icon" />
                  {instruction.readTime}
                </span>
                <ShareArticleMenu
                  title={instruction.title}
                  text={instruction.excerpt}
                  url={canonicalUrl}
                />
              </div>
            </div>

            {service?.heroImage && (
              <figure className="instruction-detail__media">
                <Image
                  src={service.heroImage}
                  alt={service.tituloHero}
                  fill
                  priority
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="instruction-detail__image"
                />
                <figcaption className="instruction-detail__media-caption">
                  {service.tituloHero}
                </figcaption>
              </figure>
            )}
          </div>

          <div className="instruction-detail__body">
            {instruction.sections.map((section, index) => (
              <section key={section.title} className="instruction-detail__section">
                <span className="instruction-detail__step">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="instruction-detail__section-title">{section.title}</h2>
                  {section.intro && (
                    <p className="instruction-detail__section-intro">{section.intro}</p>
                  )}
                  <ul className="instruction-detail__list">
                    {section.items.map((item) => (
                      <li key={item} className="instruction-detail__list-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {section.note && (
                    <p className="instruction-detail__note">{section.note}</p>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="instruction-detail__tags" aria-label="Etiquetas">
            {instruction.tags.map((tag) => (
              <span key={tag} className="instruction-detail__tag">
                {tag}
              </span>
            ))}
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
}
