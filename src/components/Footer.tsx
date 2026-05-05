'use client';

import React from 'react';

import settingsData from '@/data/settings.json';

export default function Footer() {
  return (
    <footer 
      className="w-full border-t border-slate-100 bg-white py-12"
      data-sb-object-id="src/data/settings.json"
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-8 max-w-7xl mx-auto">
        <div className="font-extrabold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-sans text-2xl tracking-tight">Paula Gualtieri</div>

        <div className="text-sm font-medium text-slate-500" data-sb-field-path="footer.text">
          {settingsData.footer.text}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <a
            className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest"
            href={settingsData.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-sb-field-path="social.instagram"
          >
            Instagram
          </a>
          <a
            className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest"
            href={settingsData.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            data-sb-field-path="social.facebook"
          >
            Facebook
          </a>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Paula Gualtieri
          </div>
        </div>
      </div>
    </footer>
  );
}
