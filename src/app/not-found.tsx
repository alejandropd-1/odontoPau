import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__background" aria-hidden="true" />

      <section className="not-found-page__panel" aria-labelledby="not-found-title">
        <div className="not-found-page__logo">
          <Image
            src="/images/isologo.png"
            alt="Paula Gualtieri Odontología"
            width={112}
            height={112}
            priority
          />
        </div>

        <p className="not-found-page__eyebrow">404</p>
        <h1 className="not-found-page__title" id="not-found-title">
          Esta página no está disponible
        </h1>
        <p className="not-found-page__description">
          Puede que el enlace haya cambiado o que la página ya no exista. Te
          acompaño de vuelta al inicio para que sigas navegando con tranquilidad.
        </p>

        <Link className="not-found-page__link" href="/">
          Volver a la página de inicio
        </Link>
      </section>
    </main>
  );
}
