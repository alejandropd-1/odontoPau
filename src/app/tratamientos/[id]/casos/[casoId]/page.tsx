import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';
import { getRoutableArticleBySlug } from '@/data/articulos';

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

export default async function CaseDetailPage({ params }: Props) {
  const { id, casoId } = await params;
  const { tratamiento, caso } = getTratamientoYCaso(id, casoId);

  if (!tratamiento || !caso) {
    notFound();
  }

  const linkedArticle = caso.articleSlug
    ? getRoutableArticleBySlug(caso.articleSlug)
    : undefined;

  if (!linkedArticle) {
    notFound();
  }

  permanentRedirect(`/articulos/${linkedArticle.slug}`);
}
