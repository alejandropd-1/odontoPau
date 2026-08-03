import fs from 'node:fs';
import path from 'node:path';
import { getTratamientos } from '@/data/tratamientos';

export type ArticleStatus =
  | 'draft'
  | 'clinical_review'
  | 'technical_review'
  | 'approved'
  | 'published';

export interface ArticleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  caption?: string;
}

export interface ArticleSource {
  title: string;
  publisher: string;
  url: string;
}

export interface ArticleTextSection {
  type: 'text';
  title?: string;
  paragraphs: string[];
}

export interface ArticleListSection {
  type: 'list';
  title: string;
  intro?: string;
  items: string[];
}

export interface ArticleComparisonRow {
  label: string;
  values: string[];
}

export interface ArticleComparisonSection {
  type: 'comparison';
  title: string;
  intro?: string;
  columns: string[];
  rows: ArticleComparisonRow[];
}

export interface ArticleStat {
  value: string;
  label: string;
  description?: string;
}

export interface ArticleStatsSection {
  type: 'stats';
  title?: string;
  items: ArticleStat[];
}

export interface ArticleGallerySection {
  type: 'gallery';
  title?: string;
  intro?: string;
  images: ArticleImage[];
}

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export interface ArticleFaqSection {
  type: 'faq';
  title: string;
  items: ArticleFaqItem[];
}

export interface ArticleQuoteSection {
  type: 'quote';
  quote: string;
  attribution?: string;
}

export interface ArticleCtaSection {
  type: 'cta';
  label?: string;
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
}

export type ArticleSection =
  | ArticleTextSection
  | ArticleListSection
  | ArticleComparisonSection
  | ArticleStatsSection
  | ArticleGallerySection
  | ArticleFaqSection
  | ArticleQuoteSection
  | ArticleCtaSection;

export interface Article {
  type: 'Articulo';
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  serviceIds: string[];
  titlePrefix?: string;
  breadcrumbLabel?: string;
  title: string;
  excerpt: string;
  author: string;
  clinicalReviewer?: string;
  status: ArticleStatus;
  publishedAt?: string;
  updatedAt: string;
  readTime: string;
  tags: string[];
  heroImage: ArticleImage;
  sources?: ArticleSource[];
  sections: ArticleSection[];
  sourcePath: string;
}

const articleStatuses = new Set<ArticleStatus>([
  'draft',
  'clinical_review',
  'technical_review',
  'approved',
  'published',
]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const articlesRoot = path.join(process.cwd(), 'src', 'data', 'articulos');

function getArticleFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getArticleFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
    });
}

function requireString(value: unknown, field: string, sourcePath: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Articulo invalido en ${sourcePath}: ${field} debe ser un texto no vacio.`);
  }
}

function requireStringList(value: unknown, field: string, sourcePath: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    throw new Error(`Articulo invalido en ${sourcePath}: ${field} debe ser una lista de textos.`);
  }
}

function validateImage(image: ArticleImage, field: string, sourcePath: string) {
  if (!image || typeof image !== 'object') {
    throw new Error(`Articulo invalido en ${sourcePath}: ${field} debe ser una imagen.`);
  }

  requireString(image.src, `${field}.src`, sourcePath);
  requireString(image.alt, `${field}.alt`, sourcePath);

  if (!Number.isFinite(image.width) || image.width <= 0 || !Number.isFinite(image.height) || image.height <= 0) {
    throw new Error(`Articulo invalido en ${sourcePath}: ${field} necesita dimensiones positivas.`);
  }

  if (!image.src.startsWith('/images/')) {
    throw new Error(`Articulo invalido en ${sourcePath}: ${field}.src debe estar bajo /images/.`);
  }

  const publicFile = path.join(process.cwd(), 'public', image.src.slice(1));
  if (!fs.existsSync(publicFile)) {
    throw new Error(`Articulo invalido en ${sourcePath}: no existe ${image.src}.`);
  }
}

function validateSection(section: ArticleSection, index: number, sourcePath: string) {
  const field = `sections[${index}]`;
  requireString(section?.type, `${field}.type`, sourcePath);

  switch (section.type) {
    case 'text':
      requireStringList(section.paragraphs, `${field}.paragraphs`, sourcePath);
      break;
    case 'list':
      requireString(section.title, `${field}.title`, sourcePath);
      requireStringList(section.items, `${field}.items`, sourcePath);
      break;
    case 'comparison':
      requireString(section.title, `${field}.title`, sourcePath);
      requireStringList(section.columns, `${field}.columns`, sourcePath);
      if (!Array.isArray(section.rows) || section.rows.length === 0) {
        throw new Error(`Articulo invalido en ${sourcePath}: ${field}.rows no puede estar vacio.`);
      }
      section.rows.forEach((row, rowIndex) => {
        requireString(row.label, `${field}.rows[${rowIndex}].label`, sourcePath);
        requireStringList(row.values, `${field}.rows[${rowIndex}].values`, sourcePath);
        if (row.values.length !== section.columns.length) {
          throw new Error(`Articulo invalido en ${sourcePath}: cada fila de ${field} debe coincidir con sus columnas.`);
        }
      });
      break;
    case 'stats':
      if (!Array.isArray(section.items) || section.items.length === 0) {
        throw new Error(`Articulo invalido en ${sourcePath}: ${field}.items no puede estar vacio.`);
      }
      break;
    case 'gallery':
      if (!Array.isArray(section.images) || section.images.length === 0) {
        throw new Error(`Articulo invalido en ${sourcePath}: ${field}.images no puede estar vacio.`);
      }
      section.images.forEach((image, imageIndex) => validateImage(image, `${field}.images[${imageIndex}]`, sourcePath));
      break;
    case 'faq':
      requireString(section.title, `${field}.title`, sourcePath);
      if (!Array.isArray(section.items) || section.items.length === 0) {
        throw new Error(`Articulo invalido en ${sourcePath}: ${field}.items no puede estar vacio.`);
      }
      break;
    case 'quote':
      requireString(section.quote, `${field}.quote`, sourcePath);
      break;
    case 'cta':
      requireString(section.title, `${field}.title`, sourcePath);
      requireString(section.text, `${field}.text`, sourcePath);
      requireString(section.href, `${field}.href`, sourcePath);
      requireString(section.buttonLabel, `${field}.buttonLabel`, sourcePath);
      break;
    default: {
      const exhaustiveCheck: never = section;
      throw new Error(`Articulo invalido en ${sourcePath}: tipo de seccion desconocido ${String(exhaustiveCheck)}.`);
    }
  }
}

function loadArticle(filePath: string): Article {
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const article = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Omit<Article, 'sourcePath'>;

  requireString(article.id, 'id', sourcePath);
  requireString(article.slug, 'slug', sourcePath);
  requireString(article.title, 'title', sourcePath);
  requireString(article.excerpt, 'excerpt', sourcePath);
  requireString(article.author, 'author', sourcePath);
  requireString(article.updatedAt, 'updatedAt', sourcePath);
  requireString(article.readTime, 'readTime', sourcePath);
  requireStringList(article.serviceIds, 'serviceIds', sourcePath);
  requireStringList(article.tags, 'tags', sourcePath);

  if (article.titlePrefix !== undefined) {
    requireString(article.titlePrefix, 'titlePrefix', sourcePath);
  }

  if (article.breadcrumbLabel !== undefined) {
    requireString(article.breadcrumbLabel, 'breadcrumbLabel', sourcePath);
  }

  if (article.sources) {
    if (!Array.isArray(article.sources)) {
      throw new Error(`Articulo invalido en ${sourcePath}: sources debe ser una lista.`);
    }
    article.sources.forEach((source, index) => {
      requireString(source.title, `sources[${index}].title`, sourcePath);
      requireString(source.publisher, `sources[${index}].publisher`, sourcePath);
      requireString(source.url, `sources[${index}].url`, sourcePath);
      if (!source.url.startsWith('https://')) {
        throw new Error(`Articulo invalido en ${sourcePath}: cada fuente debe usar HTTPS.`);
      }
    });
  }

  if (article.type !== 'Articulo') {
    throw new Error(`Articulo invalido en ${sourcePath}: type debe ser Articulo.`);
  }

  if (!slugPattern.test(article.slug)) {
    throw new Error(`Articulo invalido en ${sourcePath}: slug debe usar minusculas, numeros y guiones.`);
  }

  if (!articleStatuses.has(article.status)) {
    throw new Error(`Articulo invalido en ${sourcePath}: estado editorial desconocido.`);
  }

  if (article.status === 'published' && !article.publishedAt) {
    throw new Error(`Articulo invalido en ${sourcePath}: un articulo publicado necesita publishedAt.`);
  }

  validateImage(article.heroImage, 'heroImage', sourcePath);

  if (!Array.isArray(article.sections) || article.sections.length === 0) {
    throw new Error(`Articulo invalido en ${sourcePath}: sections no puede estar vacio.`);
  }
  article.sections.forEach((section, index) => validateSection(section, index, sourcePath));

  return { ...article, sourcePath };
}

function validateArticles(items: Article[]) {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const treatmentIds = new Set(getTratamientos().map((treatment) => treatment.id));

  items.forEach((article) => {
    if (slugs.has(article.slug)) {
      throw new Error(`Slug de articulo duplicado: ${article.slug}.`);
    }
    if (ids.has(article.id)) {
      throw new Error(`ID de articulo duplicado: ${article.id}.`);
    }
    article.serviceIds.forEach((serviceId) => {
      if (!treatmentIds.has(serviceId)) {
        throw new Error(`Articulo ${article.slug}: tratamiento inexistente ${serviceId}.`);
      }
    });
    slugs.add(article.slug);
    ids.add(article.id);
  });
}

const articlesData = getArticleFiles(articlesRoot).map(loadArticle);
validateArticles(articlesData);

export const articles = articlesData.sort((a, b) => {
  const firstDate = a.publishedAt || a.updatedAt;
  const secondDate = b.publishedAt || b.updatedAt;
  return secondDate.localeCompare(firstDate);
});

export const publishedArticles = articles.filter((article) => article.status === 'published');

export function isEditorialPreviewBuild() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.CONTEXT === 'deploy-preview' ||
    process.env.CONTEXT === 'branch-deploy' ||
    process.env.CONTEXT === 'dev' ||
    process.env.NETLIFY_PREVIEW_SERVER === 'true'
  );
}

export function getRoutableArticles() {
  return isEditorialPreviewBuild() ? articles : publishedArticles;
}

export function getRoutableArticleBySlug(slug: string) {
  return getRoutableArticles().find((article) => article.slug === slug);
}

export function getPublishedArticlesByServiceId(serviceId: string) {
  return publishedArticles.filter((article) => article.serviceIds.includes(serviceId));
}

export function getArticleCanonicalUrl(slug: string) {
  return `https://paulagualtieri.com/articulos/${slug}`;
}

function getArticlePublicBaseUrl() {
  if (isEditorialPreviewBuild()) {
    const previewUrl = process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL;

    if (previewUrl) {
      return previewUrl;
    }
  }

  return 'https://paulagualtieri.com';
}

export function getArticleShareUrl(slug: string) {
  return new URL(`/articulos/${slug}`, getArticlePublicBaseUrl()).toString();
}

export function getArticleAssetUrl(src: string) {
  return new URL(src, getArticlePublicBaseUrl()).toString();
}
