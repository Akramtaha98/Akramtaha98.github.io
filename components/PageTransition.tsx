'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import { PixelDissolve } from '@/lib/pixelDissolve';
import { prefersReducedMotion } from '@/lib/random';
import styles from './PageTransition.module.css';

const COVER_MS = 380;
const REVEAL_MS = 460;
const NAVIGATE_AT_MS = 410;
const LABEL_AT_MS = 210;
const FAILSAFE_MS = 2600;

const clean = (href: string) => {
  const p = href.split('#')[0].split('?')[0];
  return p.length > 1 ? p.replace(/\/+$/, '') : p;
};

function labelFor(path: string): string {
  const known = site.routeLabels[path];
  if (known) return known.toUpperCase();
  const tail = (path.split('/').filter(Boolean).pop() || 'Loading').replace(/[-_]+/g, ' ');
  return tail.replace(/[^A-Za-z0-9 ]/g, '').slice(0, 24).trim().toUpperCase() || 'LOADING';
}

/** Return an internal, same-site, different-page href for a clicked anchor — else null. */
function internalHref(a: HTMLAnchorElement | null, current: string): string | null {
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
  const href = a.getAttribute('href') || '';
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  return clean(href) === clean(current) ? null : href;
}

/**
 * Intercepts internal link clicks: covers the viewport with a pixel dissolve
 * radiating from the click point, shows the destination label, navigates,
 * then dissolves away once the new route renders.
 */
export default function PageTransition() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<PixelDissolve | null>(null);
  const pathRef = useRef(pathname);
  const busyRef = useRef(false);
  const failsafeRef = useRef<number>();

  const hide = () => {
    const root = rootRef.current!;
    root.dataset.state = 'idle';
    labelRef.current!.dataset.visible = '0';
    engineRef.current?.stop();
  };

  const reveal = () => {
    window.clearTimeout(failsafeRef.current);
    busyRef.current = false;
    if (prefersReducedMotion()) return hide();
    const engine = engineRef.current!;
    rootRef.current!.dataset.state = 'revealing';
    labelRef.current!.dataset.visible = '0';
    engine.prepare(0.2 + 0.6 * Math.random(), 0.2 + 0.6 * Math.random());
    engine.paint(0, 'reveal');
    engine.animate(REVEAL_MS, 'reveal', hide);
  };

  // Mount: wire up the engine, click interception, and the initial reveal.
  useEffect(() => {
    engineRef.current = new PixelDissolve(canvasRef.current!);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a') as HTMLAnchorElement | null;
      const href = internalHref(anchor, pathRef.current);
      if (!href) return;
      e.preventDefault();
      if (busyRef.current) return;

      if (prefersReducedMotion()) return router.push(href);

      busyRef.current = true;
      const engine = engineRef.current!;
      rootRef.current!.dataset.state = 'covering';
      labelRef.current!.textContent = labelFor(clean(href) || '/');
      engine.prepare(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
      engine.animate(COVER_MS, 'cover');
      window.setTimeout(() => (labelRef.current!.dataset.visible = '1'), LABEL_AT_MS);
      window.setTimeout(() => router.push(href), NAVIGATE_AT_MS);
      // If the route never changes (e.g. 404 in dev), don't leave the screen covered.
      failsafeRef.current = window.setTimeout(() => busyRef.current && reveal(), FAILSAFE_MS);
    };

    document.addEventListener('click', onClick, true);
    reveal();
    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(failsafeRef.current);
      engineRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route changed → uncover the new page.
  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={rootRef} className={styles.root} data-state="revealing" aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <span ref={labelRef} className={styles.label} data-visible="0" />
    </div>
  );
}
