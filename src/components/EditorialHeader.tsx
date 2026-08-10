'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditorialHeaderProps {
  showLogout?: boolean;
}

export default function EditorialHeader({ showLogout = true }: EditorialHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/editorial/logout', { method: 'POST' });
      router.push('/editorial/login');
      router.refresh();
    } catch {
      window.location.href = '/editorial/login';
    }
  };

  return (
    <header className="editorial-header">
      <div className="editorial-header__inner">
        <div className="editorial-header__brand">
          <ShieldCheck className="editorial-header__brand-icon" />
          <span className="editorial-header__brand-title">Paula Gualtieri</span>
          <span className="editorial-header__brand-divider">|</span>
          <span className="editorial-header__brand-subtitle">Panel Editorial</span>
        </div>

        <div className="editorial-header__actions">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-header__site-link"
          >
            Ver sitio web
            <ExternalLink className="editorial-header__site-link-icon" />
          </Link>

          {showLogout && (
            <button onClick={handleLogout} className="editorial-header__logout-btn">
              <LogOut className="editorial-header__logout-icon" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
