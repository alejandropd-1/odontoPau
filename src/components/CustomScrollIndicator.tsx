'use client';

import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';

const MIN_THUMB_SIZE = 48;

export default function CustomScrollIndicator() {
  const trackRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);
  const isScrollableRef = useRef(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      const navbar = document.querySelector<HTMLElement>('.navbar');
      const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
      const footer = document.querySelector<HTMLElement>('.footer');
      const footerOverlap = footer
        ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
        : 0;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      const nextIsScrollable = scrollable > 0;

      if (nextIsScrollable !== isScrollableRef.current) {
        isScrollableRef.current = nextIsScrollable;
        setIsScrollable(nextIsScrollable);
      }

      if (!track || !thumb) return;

      track.style.setProperty('--scroll-track-top', `${navbarHeight}px`);
      track.style.setProperty('--scroll-track-bottom', `${footerOverlap}px`);

      const trackHeight = track.getBoundingClientRect().height;
      const thumbSize = nextIsScrollable
        ? Math.min(
            Math.max((window.innerHeight / root.scrollHeight) * trackHeight, MIN_THUMB_SIZE),
            trackHeight
          )
        : trackHeight;
      const maxOffset = Math.max(trackHeight - thumbSize, 0);
      const progress = nextIsScrollable ? window.scrollY / scrollable : 0;
      const thumbOffset = progress * maxOffset;

      thumb.style.setProperty('--scroll-thumb-size', `${thumbSize}px`);
      thumb.style.setProperty('--scroll-thumb-offset', `${thumbOffset}px`);
      thumb.setAttribute('aria-valuenow', `${Math.round(progress * 100)}`);
      thumb.tabIndex = nextIsScrollable ? 0 : -1;
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const scrollToProgress = (progress: number) => {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - window.innerHeight;
    const nextProgress = Math.min(Math.max(progress, 0), 1);

    window.scrollTo({
      top: scrollable * nextProgress,
      behavior: 'auto',
    });
  };

  const scrollToPointer = (clientY: number) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;

    if (!track || !thumb) return;

    const trackRect = track.getBoundingClientRect();
    const thumbHeight = thumb.getBoundingClientRect().height;
    const maxOffset = Math.max(trackRect.height - thumbHeight, 1);
    const nextOffset = clientY - trackRect.top - dragOffsetRef.current;

    scrollToProgress(nextOffset / maxOffset);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!thumbRef.current) return;

    event.preventDefault();
    dragOffsetRef.current =
      event.clientY - thumbRef.current.getBoundingClientRect().top;
    setIsDragging(true);

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      scrollToPointer(moveEvent.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const root = document.documentElement;
    const step = window.innerHeight * 0.1;
    const pageStep = window.innerHeight * 0.85;

    if (event.key === 'Home') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      window.scrollTo({ top: root.scrollHeight, behavior: 'smooth' });
      return;
    }

    const deltaByKey: Record<string, number> = {
      ArrowUp: -step,
      ArrowDown: step,
      PageUp: -pageStep,
      PageDown: pageStep,
    };
    const delta = deltaByKey[event.key];

    if (delta === undefined) return;

    event.preventDefault();
    window.scrollBy({ top: delta, behavior: 'smooth' });
  };

  return (
    <aside
      ref={trackRef}
      className="custom-scroll"
      aria-label="Control de desplazamiento"
      data-visible={isScrollable}
      data-dragging={isDragging}
      style={{
        '--scroll-track-top': 'var(--navbar-height)',
        '--scroll-track-bottom': '0px',
      } as CSSProperties}
    >
      <div
        ref={thumbRef}
        className="custom-scroll__thumb"
        role="scrollbar"
        aria-label="Progreso de desplazamiento"
        aria-controls="site-content"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        tabIndex={isScrollable ? 0 : -1}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        style={{
          '--scroll-thumb-size': '100%',
          '--scroll-thumb-offset': '0px',
        } as CSSProperties}
      />
    </aside>
  );
}
