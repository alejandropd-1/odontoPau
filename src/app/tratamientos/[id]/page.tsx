import React from 'react';
import { notFound } from 'next/navigation';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';
import TreatmentDetailContent from '@/components/TreatmentDetailContent';
import { Metadata } from 'next';

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
  const tratamiento = getTratamientoById(id);

  if (!tratamiento) {
    notFound();
  }

  return <TreatmentDetailContent tratamiento={tratamiento} />;
}
