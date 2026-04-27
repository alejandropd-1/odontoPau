import { MetadataRoute } from 'next';
import { tratamientos } from '@/data/tratamientos';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://paulagualtieri.com';

  const treatmentUrls = tratamientos.map((t) => ({
    url: `${baseUrl}/tratamientos/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
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
    ...treatmentUrls,
    ...caseUrls,
  ];
}
