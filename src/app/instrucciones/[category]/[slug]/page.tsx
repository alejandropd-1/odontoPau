import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InstructionContent from '@/components/InstructionContent';
import {
  getInstructionAssetUrl,
  getInstructionCanonicalUrl,
  getInstructionShareUrl,
  getRoutableInstruction,
  getRoutableInstructions,
} from '@/data/instrucciones';

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutableInstructions().map((item) => ({
    category: item.category,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const instruction = getRoutableInstruction(category, slug);

  if (!instruction) {
    return { title: 'Instrucción no encontrada' };
  }

  const canonicalUrl = getInstructionCanonicalUrl(category, slug);
  const shareUrl = getInstructionShareUrl(category, slug);
  const socialImage = instruction.socialImage || instruction.resourceImage;
  const socialImageUrl = getInstructionAssetUrl(socialImage?.src || '/images/isologo.png');
  const isPublished = instruction.status === 'published';

  return {
    title: instruction.title,
    description: instruction.excerpt,
    alternates: { canonical: canonicalUrl },
    robots: isPublished ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: 'article',
      locale: 'es_AR',
      url: shareUrl,
      title: `${instruction.title} | Dra. Paula Gualtieri`,
      description: instruction.excerpt,
      publishedTime: instruction.publishedAt,
      modifiedTime: instruction.updatedAt,
      images: [{
        url: socialImageUrl,
        width: socialImage?.width || 512,
        height: socialImage?.height || 512,
        alt: socialImage?.alt || 'Paula Gualtieri Odontología',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: instruction.title,
      description: instruction.excerpt,
      images: [socialImageUrl],
    },
  };
}

export default async function InstructionDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const instruction = getRoutableInstruction(category, slug);

  if (!instruction) {
    notFound();
  }

  const canonicalUrl = getInstructionCanonicalUrl(category, slug);
  const shareUrl = getInstructionShareUrl(category, slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: instruction.title,
    description: instruction.excerpt,
    url: canonicalUrl,
    datePublished: instruction.publishedAt,
    dateModified: instruction.updatedAt,
    reviewedBy: instruction.clinicalReviewer
      ? { '@type': 'Person', name: instruction.clinicalReviewer }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Paula Gualtieri Odontología',
      logo: { '@type': 'ImageObject', url: 'https://paulagualtieri.com/images/isologo.png' },
    },
  };

  return (
    <>
      {instruction.status === 'published' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <InstructionContent instruction={instruction} shareUrl={shareUrl} />
    </>
  );
}
