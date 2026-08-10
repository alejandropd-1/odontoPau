import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleArchive from '@/components/ArticleArchive';
import {
  ARTICLES_PER_PAGE,
  getArticlesArchiveCanonicalUrl,
  getArticlesArchivePath,
  getListableArticles,
  isEditorialPreviewBuild,
  paginateArticles,
} from '@/data/articulos';

interface ArticlesPageProps {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const totalPages = Math.ceil(getListableArticles().length / ARTICLES_PER_PAGE);

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

function getArchive(pageParam: string) {
  const page = Number(pageParam);
  const archive = paginateArticles(getListableArticles(), page);

  if (!Number.isInteger(page) || page < 2 || page > archive.totalPages || archive.articles.length === 0) {
    notFound();
  }

  return archive;
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const archive = getArchive((await params).page);

  return {
    title: `Artículos de odontología - Página ${archive.currentPage}`,
    description: 'Información odontológica clara y revisada por el equipo clínico.',
    alternates: { canonical: getArticlesArchiveCanonicalUrl(archive.currentPage) },
    robots: isEditorialPreviewBuild() ? { index: false, follow: false } : undefined,
  };
}

export default async function PaginatedArticlesPage({ params }: ArticlesPageProps) {
  const archive = getArchive((await params).page);

  return (
    <ArticleArchive
      {...archive}
      eyebrow="Información para pacientes"
      title="Odontología explicada con claridad"
      description="Casos, tratamientos y respuestas del equipo profesional para entender mejor cada opción de cuidado."
      getPageHref={getArticlesArchivePath}
      paginationLabel="Paginación del archivo de artículos"
    />
  );
}
