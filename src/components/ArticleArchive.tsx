import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import ArticlePagination from '@/components/ArticlePagination';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { Article } from '@/data/articulos';

interface ArticleArchiveProps {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  eyebrow: string;
  title: string;
  description: string;
  getPageHref: (page: number) => string;
  paginationLabel: string;
  breadcrumbItems?: { label: string; href?: string }[];
}

export default function ArticleArchive({
  articles,
  currentPage,
  totalPages,
  eyebrow,
  title,
  description,
  getPageHref,
  paginationLabel,
  breadcrumbItems,
}: ArticleArchiveProps) {
  return (
    <main className="articles-page">
      <Navbar />

      <section className="articles-index" aria-labelledby="articles-title">
        <div className="articles-index__inner">
          {breadcrumbItems && (
            <div className="articles-index__breadcrumb">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}

          <header className="articles-index__header">
            <span className="articles-index__eyebrow">{eyebrow}</span>
            <h1 id="articles-title" className="articles-index__title">{title}</h1>
            <p className="articles-index__description">{description}</p>
            {currentPage > 1 && (
              <p className="articles-index__page-context" aria-live="polite">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </header>

          {articles.length > 0 ? (
            <>
              <div className="articles-index__grid">
                {articles.map((article) => (
                  <article key={article.slug} className="articles-index__card">
                    <Link className="articles-index__media" href={`/articulos/${article.slug}`} aria-label={`Leer ${article.title}`}>
                      <Image
                        src={article.heroImage.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="articles-index__image"
                      />
                    </Link>
                    <div className="articles-index__card-body">
                      <span className="articles-index__category">{article.categoryLabel}</span>
                      <h2><Link href={`/articulos/${article.slug}`}>{article.title}</Link></h2>
                      <p>{article.excerpt}</p>
                    </div>
                    <div className="articles-index__card-footer">
                      <span><Clock aria-hidden="true" />{article.readTime}</span>
                      <Link href={`/articulos/${article.slug}`}>
                        Leer artículo <ArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <ArticlePagination
                currentPage={currentPage}
                totalPages={totalPages}
                getPageHref={getPageHref}
                label={paginationLabel}
              />
            </>
          ) : (
            <div className="articles-index__empty">
              <h2>Estamos preparando los primeros artículos</h2>
              <p>Cada contenido pasa por revisión clínica antes de publicarse.</p>
              <Link href="/tratamientos">Conocer los tratamientos</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
