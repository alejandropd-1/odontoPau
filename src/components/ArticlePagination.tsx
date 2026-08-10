import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticlePaginationProps {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
  label?: string;
}

type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const visiblePages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push(previousPage === 1 ? 'ellipsis-start' : 'ellipsis-end');
    }
    items.push(page);
  });

  return items;
}

export default function ArticlePagination({
  currentPage,
  totalPages,
  getPageHref,
  label = 'Paginación de artículos',
}: ArticlePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);

  return (
    <nav className="articles-pagination" aria-label={label}>
      {currentPage > 1 ? (
        <Link
          className="articles-pagination__direction"
          href={getPageHref(currentPage - 1)}
          rel="prev"
        >
          <ChevronLeft aria-hidden="true" />
          <span>Anterior</span>
        </Link>
      ) : (
        <span className="articles-pagination__direction articles-pagination__direction--disabled" aria-disabled="true">
          <ChevronLeft aria-hidden="true" />
          <span>Anterior</span>
        </span>
      )}

      <ol className="articles-pagination__pages">
        {items.map((item) => (
          <li key={item}>
            {typeof item === 'number' ? (
              <Link
                className="articles-pagination__page"
                href={getPageHref(item)}
                aria-label={`Ir a la página ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </Link>
            ) : (
              <span className="articles-pagination__ellipsis" aria-hidden="true">…</span>
            )}
          </li>
        ))}
      </ol>

      {currentPage < totalPages ? (
        <Link
          className="articles-pagination__direction"
          href={getPageHref(currentPage + 1)}
          rel="next"
        >
          <span>Siguiente</span>
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span className="articles-pagination__direction articles-pagination__direction--disabled" aria-disabled="true">
          <span>Siguiente</span>
          <ChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
