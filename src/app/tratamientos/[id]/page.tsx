import React from 'react';
import { notFound } from 'next/navigation';
import { tratamientos } from '@/data/tratamientos';
import TreatmentDetailContent from '@/components/TreatmentDetailContent';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const tratamiento = tratamientos.find((t) => t.id === id);

  if (!tratamiento) return { title: 'Tratamiento no encontrado' };

  return {
    title: tratamiento.tituloHero,
    description: tratamiento.descripcionHero,
    openGraph: {
      title: `${tratamiento.tituloHero} | Dra. Paula Gualtieri`,
      description: tratamiento.descripcionHero,
      type: 'article',
      url: `https://paulagualtieri.com/tratamientos/${id}`,
    }
  };
}

export default async function TreatmentPage({ params }: Props) {
  const id = (await params).id;
  const tratamiento = tratamientos.find((t) => t.id === id);

  if (!tratamiento) {
    notFound();
  }

  return <TreatmentDetailContent id={id} />;
}
