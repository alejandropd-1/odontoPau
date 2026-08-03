import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from '@/components/ArticleContent';
import {
  getArticleCanonicalUrl,
  getArticleAssetUrl,
  getArticleShareUrl,
  getRoutableArticleBySlug,
  getRoutableArticles,
} from '@/data/articulos';
import { getTratamientoById } from '@/data/tratamientos';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutableArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getRoutableArticleBySlug(slug);

  if (!article) {
    return { title: 'Articulo no encontrado' };
  }

  const canonicalUrl = getArticleCanonicalUrl(article.slug);
  const shareUrl = getArticleShareUrl(article.slug);
  const socialImageUrl = getArticleAssetUrl(article.heroImage.src);
  const isPublished = article.status === 'published';

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: canonicalUrl },
    robots: isPublished ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: 'article',
      locale: 'es_AR',
      url: shareUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [{
        url: socialImageUrl,
        width: article.heroImage.width,
        height: article.heroImage.height,
        alt: article.heroImage.alt,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [socialImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getRoutableArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const services = article.serviceIds
    .map(getTratamientoById)
    .filter((service) => service !== undefined);
  const canonicalUrl = getArticleCanonicalUrl(article.slug);
  const shareUrl = getArticleShareUrl(article.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: new URL(article.heroImage.src, 'https://paulagualtieri.com').toString(),
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'Paula Gualtieri Odontologia',
      logo: { '@type': 'ImageObject', url: 'https://paulagualtieri.com/images/isologo.png' },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <>
      {article.status === 'published' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <ArticleContent article={article} services={services} shareUrl={shareUrl} />
    </>
  );
}
