import React from 'react';
import { notFound } from 'next/navigation';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';
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

  return {
    title: `Caso Clínico: ${caso.paciente}`,
    description: caso.descripcion,
    openGraph: {
      title: `Caso de Éxito: ${caso.titulo} | Dra. Paula Gualtieri`,
      description: caso.descripcion,
      type: 'article',
      url: `https://paulagualtieri.com/tratamientos/${id}/casos/${casoId}`,
    }
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { id, casoId } = await params;
  const { tratamiento, caso } = getTratamientoYCaso(id, casoId);

  if (!tratamiento || !caso) {
    notFound();
  }

  return <CaseDetailContent tratamiento={tratamiento} caso={caso} />;
}
