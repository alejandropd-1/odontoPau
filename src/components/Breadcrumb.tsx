'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link 
            href="/" 
            className="breadcrumb__link"
          >
            <Home className="breadcrumb__link-icon" />
            Inicio
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            <ChevronRight className="breadcrumb__separator" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="breadcrumb__link"
              >
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__current">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
