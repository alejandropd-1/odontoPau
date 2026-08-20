import React from 'react';
import { notFound } from 'next/navigation';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';
import TreatmentDetailContent from '@/components/TreatmentDetailContent';
import { Metadata } from 'next';
import {
  getListableArticlesByServiceId,
  getRoutableArticleBySlug,
  getTreatmentArticlesArchivePath,
  RELATED_ARTICLES_LIMIT,
} from '@/data/articulos';
import { createTreatmentVisualPayload } from '@/cms/tina/visual-data';

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
  const caseArticlesById = Object.fromEntries(
    tratamiento.casosClinicos.flatMap((caso) => {
      const article = caso.articleSlug ? getRoutableArticleBySlug(caso.articleSlug) : undefined;

      return article ? [[String(caso.id), { slug: article.slug }]] : [];
    })
  );
  const relatedArticles = allRelatedArticles.slice(0, RELATED_ARTICLES_LIMIT).map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    readTime: article.readTime,
  }));
  return (
    <TreatmentDetailContent
      tratamiento={tratamiento}
      caseArticlesById={caseArticlesById}
      relatedArticles={relatedArticles}
      relatedArticlesHref={
        allRelatedArticles.length > RELATED_ARTICLES_LIMIT
          ? getTreatmentArticlesArchivePath(tratamiento.id)
          : undefined
      }
      visual={createTreatmentVisualPayload(tratamiento)}
    />
  );
}
