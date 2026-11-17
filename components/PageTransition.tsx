'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import styles from './PageTransition.module.css';

const COVER_MS = 420;
const FAILSAFE_MS = 2500;

const clean = (href: string) => {
  const p = href.split('#')[0].split('?')[0];
  return p.length > 1 ? p.replace(/\/+$/, '') : p;
};
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * An ink sheet slides across the page carrying the destination's name,
 * the route changes underneath, and the sheet slides off the other side.
 */
export default function PageTransition() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef(pathname);
  const busy = useRef(false);
  const failsafe = useRef<number>();

  const uncover = () => {
    window.clearTimeout(failsafe.current);
    busy.current = false;
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.state !== 'covered' && root.dataset.state !== 'covering') return;
    root.dataset.state = 'leaving';
    window.setTimeout(() => {
      if (root.dataset.state === 'leaving') root.dataset.state = 'idle';
    }, COVER_MS + 40);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('//') || /\.(pdf|webp|png)$/.test(href)) return;
      if (clean(href) === clean(pathRef.current)) return;
      e.preventDefault();
      if (busy.current) return;
      if (reduced()) return router.push(href);

      busy.current = true;
      const root = rootRef.current!;
      labelRef.current!.textContent = site.routeLabels[clean(href) || '/'] ?? 'Loading';
      root.dataset.state = 'covering';
      window.setTimeout(() => {
        root.dataset.state = 'covered';
        router.push(href);
      }, COVER_MS);
      failsafe.current = window.setTimeout(uncover, FAILSAFE_MS);
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(failsafe.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    window.scrollTo(0, 0);
    // Let the new page paint under the sheet before sliding it away.
    requestAnimationFrame(() => requestAnimationFrame(uncover));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={rootRef} className={styles.sheet} data-state="idle" aria-hidden="true">
      <span ref={labelRef} className={styles.label} />
    </div>
  );
}
