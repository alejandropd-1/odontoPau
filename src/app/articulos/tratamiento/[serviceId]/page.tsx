import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleArchive from '@/components/ArticleArchive';
import {
  getListableArticlesByServiceId,
  getTreatmentArticlesArchiveCanonicalUrl,
  getTreatmentArticlesArchivePath,
  isEditorialPreviewBuild,
  paginateArticles,
} from '@/data/articulos';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';

interface TreatmentArticlesPageProps {
  params: Promise<{ serviceId: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getTratamientos()
    .filter((treatment) => getListableArticlesByServiceId(treatment.id).length > 0)
    .map((treatment) => ({ serviceId: treatment.id }));
}

function getTreatmentArchive(serviceId: string) {
  const treatment = getTratamientoById(serviceId);

  if (!treatment) {
    notFound();
  }

  return {
    treatment,
    archive: paginateArticles(getListableArticlesByServiceId(serviceId), 1),
  };
}

export async function generateMetadata({ params }: TreatmentArticlesPageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const { treatment } = getTreatmentArchive(serviceId);

  return {
    title: `Artículos sobre ${treatment.tituloHero}`,
    description: `Información, casos y respuestas del equipo profesional sobre ${treatment.tituloHero.toLowerCase()}.`,
    alternates: { canonical: getTreatmentArticlesArchiveCanonicalUrl(serviceId) },
    robots: isEditorialPreviewBuild() ? { index: false, follow: false } : undefined,
  };
}

export default async function TreatmentArticlesPage({ params }: TreatmentArticlesPageProps) {
  const { serviceId } = await params;
  const { treatment, archive } = getTreatmentArchive(serviceId);

  return (
    <ArticleArchive
      {...archive}
      eyebrow="Artículos por tratamiento"
      title={`Artículos sobre ${treatment.tituloHero}`}
      description={`Información, casos y respuestas del equipo profesional para comprender mejor ${treatment.tituloHero.toLowerCase()}.`}
      getPageHref={(page) => getTreatmentArticlesArchivePath(serviceId, page)}
      paginationLabel={`Paginación de artículos sobre ${treatment.tituloHero}`}
      breadcrumbItems={[
        { label: 'Artículos', href: '/articulos' },
        { label: treatment.tituloHero },
      ]}
    />
  );
}
