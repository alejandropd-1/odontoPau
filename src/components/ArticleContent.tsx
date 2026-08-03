import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ShareArticleMenu from '@/components/ShareArticleMenu';
import type { Article, ArticleSection } from '@/data/articulos';
import type { Tratamiento } from '@/data/tratamientos';

interface ArticleContentProps {
  article: Article;
  services: Tratamiento[];
  canonicalUrl: string;
}

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function renderSection(section: ArticleSection, index: number, hiddenGalleryIndex: number) {
  const key = `${section.type}-${index}`;

  switch (section.type) {
    case 'text':
      return (
        <section key={key} className="article-detail__section" data-sb-field-path={`sections.${index}`}>
          {section.title && <h2 className="article-detail__section-title">{section.title}</h2>}
          <div className="article-detail__prose">
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>
      );
    case 'list':
      return (
        <section key={key} className="article-detail__section" data-sb-field-path={`sections.${index}`}>
          <h2 className="article-detail__section-title">{section.title}</h2>
          {section.intro && <p className="article-detail__section-intro">{section.intro}</p>}
          <ul className="article-detail__list">
            {section.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      );
    case 'comparison':
      return (
        <section key={key} className="article-detail__section" data-sb-field-path={`sections.${index}`}>
          <h2 className="article-detail__section-title">{section.title}</h2>
          {section.intro && <p className="article-detail__section-intro">{section.intro}</p>}
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
        <section key={key} className="article-detail__section" data-sb-field-path={`sections.${index}`}>
          {section.title && <h2 className="article-detail__section-title">{section.title}</h2>}
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
        <section key={key} className="article-detail__section" data-sb-field-path={`sections.${index}`}>
          {section.title && <h2 className="article-detail__section-title">{section.title}</h2>}
          {section.intro && <p className="article-detail__section-intro">{section.intro}</p>}
          <div className="article-detail__gallery" data-image-count={Math.min(section.images.length, 3)}>
            {section.images.map((image, imageIndex) => (
              <figure key={image.src} className="article-detail__gallery-item" data-sb-field-path={`images.${imageIndex}`}>
                <div className="article-detail__gallery-media">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="article-detail__gallery-image"
                  />
                  {image.label && <span className="article-detail__image-label">{image.label}</span>}
                </div>
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      );
    case 'faq':
      return (
        <section key={key} className="article-detail__section" data-sb-field-path={`sections.${index}`}>
          <h2 className="article-detail__section-title">{section.title}</h2>
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
        <blockquote key={key} className="article-detail__quote" data-sb-field-path={`sections.${index}`}>
          <p>{section.quote}</p>
          {section.attribution && <footer>{section.attribution}</footer>}
        </blockquote>
      );
    case 'cta':
      return (
        <section key={key} className="article-detail__cta" data-sb-field-path={`sections.${index}`}>
          <div>
            {section.label && <span className="article-detail__cta-label">{section.label}</span>}
            <h2 className="article-detail__cta-title">{section.title}</h2>
            <p className="article-detail__cta-text">{section.text}</p>
          </div>
          <a className="article-detail__cta-button" href={section.href} target="_blank" rel="noopener noreferrer">
            {section.buttonLabel}
            <MessageCircle aria-hidden="true" />
          </a>
        </section>
      );
  }
}

export default function ArticleContent({ article, services, canonicalUrl }: ArticleContentProps) {
  const editorialDate = article.publishedAt || article.updatedAt;
  const primaryGalleryIndex = article.sections.findIndex((section) => section.type === 'gallery');
  const primaryGallerySection = primaryGalleryIndex >= 0 ? article.sections[primaryGalleryIndex] : undefined;
  const primaryImageCount = primaryGallerySection?.type === 'gallery' ? primaryGallerySection.images.length : 1;
  const showHeroMedia = primaryImageCount === 1;
  const hiddenGalleryIndex = showHeroMedia && primaryGalleryIndex >= 0 ? primaryGalleryIndex : -1;

  return (
    <main className="article-detail" data-sb-object-id={article.sourcePath}>
      <Navbar />

      <div className="article-detail__breadcrumb-spacer">
        <Breadcrumb items={[{ label: 'Articulos', href: '/articulos' }, { label: article.title }]} />
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

          <header className={`article-detail__hero${showHeroMedia ? '' : ' article-detail__hero--text-only'}`}>
            <div className="article-detail__hero-content">
              <span className="article-detail__eyebrow" data-sb-field-path="categoryLabel">{article.categoryLabel}</span>
              <h1 className="article-detail__title" data-sb-field-path="title">{article.title}</h1>
              <p className="article-detail__excerpt" data-sb-field-path="excerpt">{article.excerpt}</p>

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
                <ShareArticleMenu title={article.title} text={article.excerpt} url={canonicalUrl} />
              </div>
            </div>

            {showHeroMedia && (
              <figure className="article-detail__hero-media" data-sb-field-path="heroImage">
                <Image
                  src={article.heroImage.src}
                  alt={article.heroImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="article-detail__hero-image"
                />
                {article.heroImage.label && <span className="article-detail__image-label">{article.heroImage.label}</span>}
                {article.heroImage.caption && <figcaption>{article.heroImage.caption}</figcaption>}
              </figure>
            )}
          </header>

          <div className="article-detail__body">
            {article.sections.map((section, index) => renderSection(section, index, hiddenGalleryIndex))}
          </div>

          <footer className="article-detail__footer">
            {article.sources && article.sources.length > 0 && (
              <section className="article-detail__sources" aria-labelledby="article-sources-title">
                <h2 id="article-sources-title">Fuentes generales</h2>
                <p>Referencias educativas. La información específica del caso fue provista y debe ser validada por el equipo tratante.</p>
                <ul>
                  {article.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title}
                      </a>
                      <span>{source.publisher}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="article-detail__tags" aria-label="Etiquetas">
              {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>

            {services.length > 0 && (
              <div className="article-detail__services">
                <h2>Tratamientos relacionados</h2>
                <div>
                  {services.map((service) => (
                    <Link key={service.id} href={`/tratamientos/${service.id}`}>{service.tituloHero}</Link>
                  ))}
                </div>
              </div>
            )}
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  );
}
