'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">Paula Gualtieri</div>

        <div className="footer__copyright">
          © {new Date().getFullYear()} Paula Gualtieri Odontología. Todos los derechos reservados.
        </div>

        <div className="footer__links">
          {['Instagram', 'Facebook', 'Aviso Legal'].map((link) => (
            <a
              key={link}
              className="footer__link"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
