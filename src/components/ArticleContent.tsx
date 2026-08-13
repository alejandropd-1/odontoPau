'use client';

import Image from 'next/image';
import Link from 'next/link';
import { tinaField, useTina } from 'tinacms/dist/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Tag,
  Download,
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ShareArticleMenu from '@/components/ShareArticleMenu';
import type { Article, ArticleGallerySection, ArticleImage, ArticleSection } from '@/data/articulos';
import type { Tratamiento } from '@/data/tratamientos';
import {
  articleFromVisualData,
  tinaTemplateField,
  type TinaVisualPayload,
} from '@/cms/tina/visual-data';

type VisualRecord = Record<string, unknown>;

interface ArticleContentProps {
  article: Article;
  availableServices: Tratamiento[];
  shareUrl: string;
  visual: TinaVisualPayload<{ articulo: VisualRecord }>;
}

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDate(date: string) {
  const dateString = date.includes('T') ? date : `${date}T00:00:00Z`;
  return dateFormatter.format(new Date(dateString));
}

function renderGallery(
  images: ArticleImage[],
  editorImages?: VisualRecord[],
  className = 'article-detail__gallery',
) {
  return (
    <div className={className} data-image-count={Math.min(images.length, 3)}>
      {images.map((image, imageIndex) => (
        <figure
          key={image.src}
          className="article-detail__gallery-item"
          data-tina-field={editorImages?.[imageIndex] ? tinaField(editorImages[imageIndex]) : undefined}
        >
          <div className="article-detail__gallery-media">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 48vw, 100vw"
              className="article-detail__gallery-image"
              data-tina-field={editorImages?.[imageIndex]
                ? tinaField(editorImages[imageIndex], 'src')
                : undefined}
            />
            {image.label && (
              <span
                className="article-detail__image-label"
                data-tina-field={editorImages?.[imageIndex]
                  ? tinaField(editorImages[imageIndex], 'label')
                  : undefined}
              >
                {image.label}
              </span>
            )}
          </div>
          {image.caption && (
            <figcaption data-tina-field={editorImages?.[imageIndex]
              ? tinaField(editorImages[imageIndex], 'caption')
              : undefined}
            >
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function renderSection(
  section: ArticleSection,
  editorSection: VisualRecord | undefined,
  index: number,
  hiddenGalleryIndex: number,
) {
  const key = `${section.type}-${index}`;
  const field = (name: string) => editorSection
    ? tinaField(editorSection, tinaTemplateField(section.type, name))
    : undefined;

  switch (section.type) {
    case 'case_summary': {
      const hasFacts = Boolean(section.facts?.length);
      const hasApproach = Boolean(section.approach);
      const summaryClassName = [
        'article-detail__case-summary',
        hasApproach && 'article-detail__case-summary--with-approach',
        !hasFacts && !hasApproach && 'article-detail__case-summary--minimal',
      ].filter(Boolean).join(' ');
      const titleId = `article-case-summary-${index}`;

      return (
        <section
          key={key}
          className={summaryClassName}
          data-tina-field={editorSection ? tinaField(editorSection) : undefined}
          aria-labelledby={titleId}
        >
          <div className="article-detail__case-context">
            <div className="article-detail__case-heading">
              <AlertCircle aria-hidden="true" />
              <h2 id={titleId} data-tina-field={field('title')}>{section.title}</h2>
            </div>
            <div className="article-detail__case-copy" data-tina-field={field('paragraphs')}>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            {section.facts && section.facts.length > 0 && (
              <dl className="article-detail__case-facts" data-tina-field={field('facts')}>
                {section.facts.map((fact, factIndex) => (
                  <div key={`${fact.label}-${fact.value}`} className="article-detail__case-fact">
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {section.approach && (
            <div className="article-detail__case-approach" data-tina-field={field('approach')}>
              <h3>{section.approach.title}</h3>
              <p>{section.approach.text}</p>
              {section.approach.items && section.approach.items.length > 0 && (
                <ul>
                  {section.approach.items.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true"><CheckCircle2 /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      );
    }
    case 'text':
      return (
        <section key={key} className="article-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          {section.title && <h2 className="article-detail__section-title" data-tina-field={field('title')}>{section.title}</h2>}
          <div className="article-detail__prose" data-tina-field={field('paragraphs')}>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>
      );
    case 'list':
      return (
        <section key={key} className="article-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          <h2 className="article-detail__section-title" data-tina-field={field('title')}>{section.title}</h2>
          {section.intro && <p className="article-detail__section-intro" data-tina-field={field('intro')}>{section.intro}</p>}
          <ul className="article-detail__list" data-tina-field={field('items')}>
            {section.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      );
    case 'comparison':
      return (
        <section key={key} className="article-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          <h2 className="article-detail__section-title" data-tina-field={field('title')}>{section.title}</h2>
          {section.intro && <p className="article-detail__section-intro" data-tina-field={field('intro')}>{section.intro}</p>}
          <div className="article-detail__table-wrap" tabIndex={0} aria-label={`Tabla: ${section.title}`}>
            <table className="article-detail__table">
              <thead>
                <tr>
                  <th scope="col">Aspecto</th>
                  {section.columns.map((column) => <th key={column} scope="col">{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, valueIndex) => <td key={`${row.label}-${valueIndex}`}>{value}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case 'stats':
      return (
        <section key={key} className="article-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          {section.title && <h2 className="article-detail__section-title" data-tina-field={field('title')}>{section.title}</h2>}
          <div className="article-detail__stats">
            {section.items.map((item) => (
              <div key={`${item.value}-${item.label}`} className="article-detail__stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                {item.description && <p>{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'gallery':
      if (index === hiddenGalleryIndex) {
        return null;
      }

      return (
        <section key={key} className="article-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          {section.title && <h2 className="article-detail__section-title" data-tina-field={field('title')}>{section.title}</h2>}
          {section.intro && <p className="article-detail__section-intro" data-tina-field={field('intro')}>{section.intro}</p>}
          {renderGallery(
            section.images,
            editorSection?.[tinaTemplateField(section.type, 'images')] as VisualRecord[] | undefined,
          )}
        </section>
      );
    case 'faq':
      return (
        <section key={key} className="article-detail__section" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          <h2 className="article-detail__section-title" data-tina-field={field('title')}>{section.title}</h2>
          <div className="article-detail__faq">
            {section.items.map((item) => (
              <details key={item.question} className="article-detail__faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      );
    case 'quote':
      return (
        <blockquote key={key} className="article-detail__quote" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          <p data-tina-field={field('quote')}>{section.quote}</p>
          {section.attribution && <footer data-tina-field={field('attribution')}>{section.attribution}</footer>}
        </blockquote>
      );
    case 'cta':
      return (
        <section key={key} className="article-detail__cta" data-tina-field={editorSection ? tinaField(editorSection) : undefined}>
          <div>
            {section.label && <span className="article-detail__cta-label" data-tina-field={field('label')}>{section.label}</span>}
            <h2 className="article-detail__cta-title" data-tina-field={field('title')}>{section.title}</h2>
            <p className="article-detail__cta-text" data-tina-field={field('text')}>{section.text}</p>
          </div>
          <a className="article-detail__cta-button" href={section.href} target="_blank" rel="noopener noreferrer">
            {section.buttonLabel}
            <MessageCircle aria-hidden="true" />
          </a>
        </section>
      );
  }
}

export default function ArticleContent({
  article: initialArticle,
  availableServices,
  shareUrl,
  visual,
}: ArticleContentProps) {
  const { data } = useTina(visual);
  const editorArticle = data.articulo;
  const article = articleFromVisualData(editorArticle, initialArticle);
  const services = availableServices.filter((service) => article.serviceIds.includes(service.id));
  const editorSections = Array.isArray(editorArticle.sections)
    ? editorArticle.sections as VisualRecord[]
    : [];
  const editorialDate = article.publishedAt || article.updatedAt;
  const primaryGalleryIndex = article.sections.findIndex((section) => section.type === 'gallery');
  const primaryGallerySection = primaryGalleryIndex >= 0
    ? article.sections[primaryGalleryIndex] as ArticleGallerySection
    : undefined;
  const leadImages = primaryGallerySection?.images || [article.heroImage];
  const hasSources = Boolean(article.sources?.length);
  const hasServices = services.length > 0;
  const footerGridModifier = hasSources && hasServices
    ? ''
    : hasSources
      ? ' article-detail__footer-grid--sources-only'
      : ' article-detail__footer-grid--services-only';
  const breadcrumbItems = services.length > 0
    ? [
        { label: services[0].tituloHero, href: `/tratamientos/${services[0].id}` },
        { label: article.breadcrumbLabel || article.title },
      ]
    : [
        { label: 'Artículos', href: '/articulos' },
        { label: article.breadcrumbLabel || article.title },
      ];

  return (
    <main className="article-detail" data-tina-field={tinaField(editorArticle)}>
      <Navbar />

      <div className="article-detail__breadcrumb-spacer">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <article className="article-detail__article">
        <div className="article-detail__inner">
          <Link className="article-detail__back-link" href="/articulos">
            <ArrowLeft aria-hidden="true" />
            Volver a articulos
          </Link>

          {article.status !== 'published' && (
            <p className="article-detail__preview-notice" role="status">
              Vista previa editorial · Estado: {article.status} · No indexada
            </p>
          )}

          <header className="article-detail__hero">
            <div className="article-detail__hero-content">
              <span className="article-detail__eyebrow" data-tina-field={tinaField(editorArticle, 'categoryLabel')}>{article.categoryLabel}</span>
              <h1 className="article-detail__title" data-tina-field={tinaField(editorArticle, 'title')}>
                {article.titlePrefix ? (
                  <>
                    <span className="article-detail__title-prefix">{article.titlePrefix}:</span>{' '}
                    <span className="article-detail__title-accent">{article.title}</span>
                  </>
                ) : article.title}
              </h1>
              <p className="article-detail__excerpt" data-tina-field={tinaField(editorArticle, 'excerpt')}>{article.excerpt}</p>

              <div className="article-detail__meta">
                <span className="article-detail__meta-item">
                  <Calendar aria-hidden="true" />
                  {formatDate(editorialDate)}
                </span>
                <span className="article-detail__meta-item">
                  <Clock aria-hidden="true" />
                  {article.readTime}
                </span>
                <span className="article-detail__meta-author">Por {article.author}</span>
                <ShareArticleMenu title={article.title} text={article.excerpt} url={shareUrl} />
              </div>
            </div>
          </header>

          <section
            className="article-detail__lead-media"
            aria-label="Imágenes del caso"
            data-tina-field={primaryGalleryIndex >= 0 && editorSections[primaryGalleryIndex]
              ? tinaField(editorSections[primaryGalleryIndex])
              : undefined}
          >
            {renderGallery(
              leadImages,
              primaryGallerySection
                ? editorSections[primaryGalleryIndex]?.gallery_images as VisualRecord[] | undefined
                : editorArticle.heroImage
                  ? [editorArticle.heroImage as VisualRecord]
                  : undefined,
              'article-detail__gallery article-detail__gallery--lead',
            )}
          </section>

          <div className="article-detail__body">
            {article.sections.map((section, index) => renderSection(
              section,
              editorSections[index],
              index,
              primaryGalleryIndex,
            ))}
          </div>

          <footer className="article-detail__footer">
            <div className="article-detail__topics">
              <h2 className="article-detail__topics-title">
                <Tag aria-hidden="true" />
                Temas del artículo
              </h2>
              <div className="article-detail__tags" aria-label="Temas del artículo">
                {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>

            <div className={`article-detail__footer-grid${footerGridModifier}`}>
              {article.sources && article.sources.length > 0 && (
                <section className="article-detail__sources" aria-labelledby="article-sources-title">
                  <div className="article-detail__sources-heading">
                    <BookOpen aria-hidden="true" />
                    <div>
                      <h2 id="article-sources-title">Fuentes consultadas</h2>
                      <p>Referencias educativas. La información específica del caso debe ser validada por el equipo tratante.</p>
                    </div>
                  </div>
                  <ol>
                    {article.sources.map((source, sourceIndex) => (
                      <li key={source.url}>
                        <span className="article-detail__source-index" aria-hidden="true">
                          {String(sourceIndex + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            {source.title}
                            <ExternalLink aria-hidden="true" />
                          </a>
                          <span>{source.publisher}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {services.length > 0 && (
                <aside className="article-detail__services" aria-labelledby="article-services-title">
                  <span className="article-detail__services-eyebrow">Seguí explorando</span>
                  <h2 id="article-services-title">Tratamientos relacionados</h2>
                  <div className="article-detail__service-list">
                    {services.map((service) => (
                      <Link key={service.id} className="article-detail__service-card" href={`/tratamientos/${service.id}`}>
                        <strong>{service.tituloHero}</strong>
                        <span>
                          Ver tratamiento
                          <ArrowRight aria-hidden="true" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  );
}
