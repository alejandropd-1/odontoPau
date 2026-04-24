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
    <nav className="flex px-6 max-w-7xl mx-auto w-full pt-8 pb-4 animate-in fade-in slide-in-from-left-4 duration-700 relative z-20" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="text-on-surface-variant/60 hover:text-orange-600 flex items-center transition-colors gap-1.5 font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            Inicio
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/30" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="text-on-surface-variant/60 hover:text-orange-600 transition-colors font-semibold"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-orange-600 font-bold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
