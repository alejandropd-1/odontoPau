'use client';

import React, { useState } from 'react';
import { Check, Link as LinkIcon, Mail, MessageCircle, Share2 } from 'lucide-react';

interface ShareArticleMenuProps {
  title: string;
  text: string;
  url: string;
}

export default function ShareArticleMenu({ title, text, url }: ShareArticleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `${title}\n\n${text}\n\n${url}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`;

  const detectNativeShare = () =>
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleToggle = () => {
    setCanNativeShare(detectNativeShare());
    setIsOpen((value) => !value);
  };

  const handleNativeShare = async () => {
    const supportsNativeShare = detectNativeShare();
    setCanNativeShare(supportsNativeShare);

    if (!supportsNativeShare) {
      setIsOpen(true);
      return;
    }

    try {
      await navigator.share({
        title,
        text,
        url,
      });
      setIsOpen(false);
    } catch {
      setIsOpen(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="share-menu">
      <button
        type="button"
        className="share-menu__button"
        aria-expanded={isOpen}
        aria-controls="instruction-share-options"
        onClick={handleToggle}
      >
        <Share2 className="share-menu__button-icon" aria-hidden="true" />
        Compartir
      </button>

      {isOpen && (
        <div id="instruction-share-options" className="share-menu__panel">
          {canNativeShare && (
            <button type="button" className="share-menu__option" onClick={handleNativeShare}>
              <Share2 className="share-menu__option-icon" aria-hidden="true" />
              Elegir app
            </button>
          )}
          <a
            className="share-menu__option"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="share-menu__option-icon" aria-hidden="true" />
            WhatsApp
          </a>
          <a className="share-menu__option" href={mailHref}>
            <Mail className="share-menu__option-icon" aria-hidden="true" />
            Email
          </a>
          <button type="button" className="share-menu__option" onClick={handleCopy}>
            {copied ? (
              <Check className="share-menu__option-icon" aria-hidden="true" />
            ) : (
              <LinkIcon className="share-menu__option-icon" aria-hidden="true" />
            )}
            {copied ? 'Link copiado' : 'Copiar link'}
          </button>
        </div>
      )}
    </div>
  );
}
