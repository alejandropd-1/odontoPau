import { MetadataRoute } from 'next';
import { getTratamientos } from '@/data/tratamientos';
import { publishedInstrucciones } from '@/data/instrucciones';
import {
  ARTICLES_PER_PAGE,
  getArticlesArchivePath,
  getTreatmentArticlesArchivePath,
  publishedArticles,
} from '@/data/articulos';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://paulagualtieri.com';
  const tratamientos = getTratamientos();
  const publishedArticleSlugs = new Set(publishedArticles.map((article) => article.slug));

  const treatmentUrls = tratamientos.map((t) => ({
    url: `${baseUrl}/tratamientos/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const instructionUrls = publishedInstrucciones.map((instruction) => ({
    url: `${baseUrl}/instrucciones/${instruction.category}/${instruction.slug}`,
    lastModified: new Date(instruction.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articleUrls = publishedArticles.map((article) => ({
    url: `${baseUrl}/articulos/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const generalArticleArchiveUrls = Array.from(
    { length: Math.max(0, Math.ceil(publishedArticles.length / ARTICLES_PER_PAGE) - 1) },
    (_, index) => ({
      url: `${baseUrl}${getArticlesArchivePath(index + 2)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    }),
  );

  const treatmentArticleArchiveUrls = tratamientos.flatMap((treatment) => {
    const relatedCount = publishedArticles.filter((article) =>
      article.serviceIds.includes(treatment.id),
    ).length;
    const totalPages = Math.ceil(relatedCount / ARTICLES_PER_PAGE);

    return Array.from({ length: totalPages }, (_, index) => ({
      url: `${baseUrl}${getTreatmentArticlesArchivePath(treatment.id, index + 1)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    }));
  });

  const caseUrls = tratamientos.flatMap((t) =>
    t.casosClinicos.filter((c) => !c.articleSlug || !publishedArticleSlugs.has(c.articleSlug)).map((c) => ({
      url: `${baseUrl}/tratamientos/${t.id}/casos/${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tratamientos`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/instrucciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/articulos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...treatmentUrls,
    ...instructionUrls,
    ...articleUrls,
    ...generalArticleArchiveUrls,
    ...treatmentArticleArchiveUrls,
    ...caseUrls,
  ];
}
