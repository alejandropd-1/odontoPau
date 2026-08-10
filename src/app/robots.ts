import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/editorial'],
    },
    sitemap: 'https://paulagualtieri.com/sitemap.xml',
  };
}
