import type { Metadata } from 'next';
import ArticleArchive from '@/components/ArticleArchive';
import {
  getArticlesArchiveCanonicalUrl,
  getArticlesArchivePath,
  getListableArticles,
  isEditorialPreviewBuild,
  paginateArticles,
} from '@/data/articulos';

export const metadata: Metadata = {
  title: 'Artículos de odontología',
  description: 'Información odontológica clara y revisada por el equipo clínico.',
  alternates: { canonical: getArticlesArchiveCanonicalUrl() },
  robots: isEditorialPreviewBuild() ? { index: false, follow: false } : undefined,
};

export default function ArticlesPage() {
  const archive = paginateArticles(getListableArticles(), 1);

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
