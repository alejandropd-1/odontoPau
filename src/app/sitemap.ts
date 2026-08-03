import { MetadataRoute } from 'next';
import { getTratamientos } from '@/data/tratamientos';
import { publishedInstrucciones } from '@/data/instrucciones';
import { publishedArticles } from '@/data/articulos';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://paulagualtieri.com';
  const tratamientos = getTratamientos();

  const treatmentUrls = tratamientos.map((t) => ({
    url: `${baseUrl}/tratamientos/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const instructionUrls = publishedInstrucciones.map((instruction) => ({
    url: `${baseUrl}/instrucciones/${instruction.category}/${instruction.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articleUrls = publishedArticles.map((article) => ({
    url: `${baseUrl}/articulos/${article.slug}`,
    lastModified: new Date(`${article.updatedAt}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const caseUrls = tratamientos.flatMap((t) =>
    t.casosClinicos.map((c) => ({
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
    ...caseUrls,
  ];
}
