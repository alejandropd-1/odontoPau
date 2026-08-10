import React from 'react';
import { notFound } from 'next/navigation';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';
import TreatmentDetailContent from '@/components/TreatmentDetailContent';
import { Metadata } from 'next';
import {
  getListableArticlesByServiceId,
  getTreatmentArticlesArchivePath,
  RELATED_ARTICLES_LIMIT,
} from '@/data/articulos';

type Props = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return getTratamientos().map((tratamiento) => ({
    id: tratamiento.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const tratamiento = getTratamientoById(id);

  if (!tratamiento) return { title: 'Tratamiento no encontrado' };

  return {
    title: tratamiento.tituloHero,
    description: tratamiento.descripcionHero,
    alternates: {
      canonical: `https://paulagualtieri.com/tratamientos/${tratamiento.id}`,
    },
    openGraph: {
      title: `${tratamiento.tituloHero} | Dra. Paula Gualtieri`,
      description: tratamiento.descripcionHero,
      type: 'article',
      url: `https://paulagualtieri.com/tratamientos/${tratamiento.id}`,
      images: [
        {
          url: tratamiento.heroImage,
          alt: tratamiento.tituloHero,
        },
      ],
    }
  };
}

export default async function TreatmentPage({ params }: Props) {
  const id = (await params).id;
  const tratamiento = getTratamientoById(id);

  if (!tratamiento) {
    notFound();
  }

  const allRelatedArticles = getListableArticlesByServiceId(tratamiento.id);
  const relatedArticles = allRelatedArticles.slice(0, RELATED_ARTICLES_LIMIT).map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    readTime: article.readTime,
  }));
  const availableArticleSlugs = new Set(allRelatedArticles.map((article) => article.slug));
  const caseArticleHrefs = Object.fromEntries(
    tratamiento.casosClinicos.flatMap((caso) =>
      caso.articleSlug && availableArticleSlugs.has(caso.articleSlug)
        ? [[String(caso.id), `/articulos/${caso.articleSlug}`]]
        : [],
    ),
  );

  return (
    <TreatmentDetailContent
      tratamiento={tratamiento}
      relatedArticles={relatedArticles}
      caseArticleHrefs={caseArticleHrefs}
      relatedArticlesHref={
        allRelatedArticles.length > RELATED_ARTICLES_LIMIT
          ? getTreatmentArticlesArchivePath(tratamiento.id)
          : undefined
      }
    />
  );
}
