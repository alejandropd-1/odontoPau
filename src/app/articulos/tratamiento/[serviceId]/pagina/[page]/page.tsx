import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleArchive from '@/components/ArticleArchive';
import {
  ARTICLES_PER_PAGE,
  getListableArticlesByServiceId,
  getTreatmentArticlesArchiveCanonicalUrl,
  getTreatmentArticlesArchivePath,
  isEditorialPreviewBuild,
  paginateArticles,
} from '@/data/articulos';
import { getTratamientoById, getTratamientos } from '@/data/tratamientos';

interface PaginatedTreatmentArticlesPageProps {
  params: Promise<{ serviceId: string; page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getTratamientos().flatMap((treatment) => {
    const totalPages = Math.ceil(
      getListableArticlesByServiceId(treatment.id).length / ARTICLES_PER_PAGE,
    );

    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      serviceId: treatment.id,
      page: String(index + 2),
    }));
  });
}

function getTreatmentArchive(serviceId: string, pageParam: string) {
  const treatment = getTratamientoById(serviceId);
  const page = Number(pageParam);

  if (!treatment) {
    notFound();
  }

  const archive = paginateArticles(getListableArticlesByServiceId(serviceId), page);

  if (!Number.isInteger(page) || page < 2 || page > archive.totalPages || archive.articles.length === 0) {
    notFound();
  }

  return { treatment, archive };
}

export async function generateMetadata({ params }: PaginatedTreatmentArticlesPageProps): Promise<Metadata> {
  const { serviceId, page } = await params;
  const { treatment, archive } = getTreatmentArchive(serviceId, page);

  return {
    title: `Artículos sobre ${treatment.tituloHero} - Página ${archive.currentPage}`,
    description: `Información, casos y respuestas del equipo profesional sobre ${treatment.tituloHero.toLowerCase()}.`,
    alternates: {
      canonical: getTreatmentArticlesArchiveCanonicalUrl(serviceId, archive.currentPage),
    },
    robots: isEditorialPreviewBuild() ? { index: false, follow: false } : undefined,
  };
}

export default async function PaginatedTreatmentArticlesPage({ params }: PaginatedTreatmentArticlesPageProps) {
  const { serviceId, page } = await params;
  const { treatment, archive } = getTreatmentArchive(serviceId, page);

  return (
    <ArticleArchive
      {...archive}
      eyebrow="Artículos por tratamiento"
      title={`Artículos sobre ${treatment.tituloHero}`}
      description={`Información, casos y respuestas del equipo profesional para comprender mejor ${treatment.tituloHero.toLowerCase()}.`}
      getPageHref={(pageNumber) => getTreatmentArticlesArchivePath(serviceId, pageNumber)}
      paginationLabel={`Paginación de artículos sobre ${treatment.tituloHero}`}
      breadcrumbItems={[
        { label: 'Artículos', href: '/articulos' },
        { label: treatment.tituloHero },
      ]}
    />
  );
}
