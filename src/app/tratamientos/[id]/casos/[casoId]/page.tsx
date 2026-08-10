import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';
import { getRoutableArticleBySlug } from '@/data/articulos';
import CaseDetailContent from '@/components/CaseDetailContent';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string, casoId: string }>
}

function getTratamientoYCaso(id: string, casoId: string) {
  const tratamiento = getTratamientoById(id);
  const caso = tratamiento?.casosClinicos.find((c) => c.id.toString() === casoId);
  return { tratamiento, caso };
}

export function generateStaticParams() {
  return getTratamientos().flatMap((tratamiento) =>
    tratamiento.casosClinicos.map((caso) => ({
      id: tratamiento.id,
      casoId: caso.id.toString(),
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, casoId } = await params;
  const { tratamiento, caso } = getTratamientoYCaso(id, casoId);

  if (!tratamiento || !caso) return { title: 'Caso no encontrado' };

  const caseImage = caso.imagenDespues || caso.imagenAntes || caso.imagenes?.[caso.imagenes.length - 1];
  const canonicalUrl = `https://paulagualtieri.com/tratamientos/${tratamiento.id}/casos/${casoId}`;

  return {
    title: `Caso clínico: ${caso.titulo}`,
    description: caso.descripcion,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Caso clínico: ${caso.titulo} | Dra. Paula Gualtieri`,
      description: caso.descripcion,
      type: 'article',
      url: canonicalUrl,
      images: caseImage ? [{ url: caseImage, alt: caso.titulo }] : undefined,
    }
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { id, casoId } = await params;
  const { tratamiento, caso } = getTratamientoYCaso(id, casoId);

  if (!tratamiento || !caso) {
    notFound();
  }

  const linkedArticle = caso.articleSlug
    ? getRoutableArticleBySlug(caso.articleSlug)
    : undefined;

  if (linkedArticle) {
    permanentRedirect(`/articulos/${linkedArticle.slug}`);
  }

  return <CaseDetailContent tratamiento={tratamiento} caso={caso} />;
}
