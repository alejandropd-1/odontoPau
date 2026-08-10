'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { siteFeatures } from '@/config/site-features';

type NavigationItem = {
  href: string;
  label: string;
  activePath?: string;
};

const navigationItems: NavigationItem[] = [
  { href: '/#inicio', label: 'Inicio', activePath: '/' },
  { href: '/tratamientos', label: 'Servicios', activePath: '/tratamientos' },
  { href: '/articulos', label: 'Artículos', activePath: '/articulos' },
  { href: '/instrucciones', label: 'Instrucciones', activePath: '/instrucciones' },
  ...(siteFeatures.testimonials
    ? [{ href: '/#testimonios', label: 'Testimonios' }]
    : []),
  { href: '/#ubicacion', label: 'Ubicación' },
];

function isCurrentItem(item: NavigationItem, pathname: string) {
  if (!item.activePath) return false;
  if (item.activePath === '/') return pathname === '/';
  return pathname === item.activePath || pathname.startsWith(`${item.activePath}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement && panelRef.current?.contains(activeElement)) {
      if (restoreFocus) {
        menuButtonRef.current?.focus();
      } else {
        activeElement.blur();
      }
    }

    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 48em)');
    const panel = panelRef.current;

    document.body.style.overflow = 'hidden';

    const focusFirstLink = requestAnimationFrame(() => {
      panel?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusableLinks = Array.from(
        panel.querySelectorAll<HTMLAnchorElement>('a[href]'),
      );
      const firstLink = focusableLinks[0];
      const lastLink = focusableLinks.at(-1);

      if (!firstLink || !lastLink) return;

      if (event.shiftKey && document.activeElement === firstLink) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        firstLink.focus();
      }
    };

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktopChange);

    return () => {
      cancelAnimationFrame(focusFirstLink);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktopChange);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Navegación principal">
        <Link href="/" className="navbar__brand">
          <span>Paula Gualtieri</span>
        </Link>

        <div className="navbar__links">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              className="navbar__link"
              href={item.href}
              aria-current={isCurrentItem(item, pathname) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="navbar__actions">
          <a
            href="https://wa.me/5491137854198?text=Hola,%20quiero%20sacar%20un%20turno"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__cta"
          >
            <span className="navbar__cta-label navbar__cta-label--mobile">Turno</span>
            <span className="navbar__cta-label navbar__cta-label--desktop">Agendar Turno</span>
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="navbar__menu-toggle"
            aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-panel"
            aria-haspopup="dialog"
            onClick={() => (isMenuOpen ? closeMenu(true) : setIsMenuOpen(true))}
          >
            {isMenuOpen ? (
              <X className="navbar__menu-icon" aria-hidden="true" />
            ) : (
              <Menu className="navbar__menu-icon" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <button
        type="button"
        className="navbar__backdrop"
        data-state={isMenuOpen ? 'open' : 'closed'}
        aria-label="Cerrar menú principal"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => closeMenu(true)}
      />

      <div
        ref={panelRef}
        id="mobile-navigation-panel"
        className="navbar__mobile-panel"
        data-state={isMenuOpen ? 'open' : 'closed'}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className="navbar__mobile-heading" aria-hidden="true">
          <span>Explorar</span>
          <strong>Menú principal</strong>
        </div>

        <nav className="navbar__mobile-links" aria-label="Navegación mobile">
          {navigationItems.map((item, index) => (
            <Link
              key={item.href}
              className="navbar__mobile-link"
              href={item.href}
              aria-current={isCurrentItem(item, pathname) ? 'page' : undefined}
              onClick={() => closeMenu(false)}
            >
              <span className="navbar__mobile-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
