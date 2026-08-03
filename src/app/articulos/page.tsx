import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { publishedArticles } from '@/data/articulos';

export const metadata: Metadata = {
  title: 'Articulos de odontologia',
  description: 'Informacion odontologica clara y revisada por profesionales del equipo de Paula Gualtieri Odontologia.',
  alternates: { canonical: 'https://paulagualtieri.com/articulos' },
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <Navbar />

      <section className="articles-index" aria-labelledby="articles-title">
        <div className="articles-index__inner">
          <header className="articles-index__header">
            <span className="articles-index__eyebrow">Informacion para pacientes</span>
            <h1 id="articles-title" className="articles-index__title">Odontologia explicada con claridad</h1>
            <p className="articles-index__description">
              Casos, tratamientos y respuestas del equipo profesional para entender mejor cada opcion de cuidado.
            </p>
          </header>

          {publishedArticles.length > 0 ? (
            <div className="articles-index__grid">
              {publishedArticles.map((article) => (
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
                      Leer articulo <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="articles-index__empty">
              <h2>Estamos preparando los primeros articulos</h2>
              <p>Cada contenido pasa por revision clinica antes de publicarse.</p>
              <Link href="/tratamientos">Conocer los tratamientos</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
