'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import styles from './Nav.module.css';

const normalize = (p: string) => p.replace(/\/+$/, '') || '/';

export default function Nav() {
  const pathname = normalize(usePathname() || '/');
  const [open, setOpen] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = (href: string) => {
    const h = normalize(href);
    return pathname === h || pathname.startsWith(h + '/');
  };

  return (
    <header className={styles.shell} data-raised={raised ? '1' : undefined}>
      <nav className={`${styles.bar} page`} aria-label="Main">
        <Link href="/" className={styles.brand} aria-current={pathname === '/' ? 'page' : undefined}>
          <svg className={styles.mark} viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#FFE066" />
            <g fill="none" stroke="#121A2E" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
              <path d="M9 50 L19.5 16 L30 50" />
              <path d="M13.5 38 H25.5" />
              <path d="M35 24 H52 L35 50 H53" />
            </g>
            <circle cx="52" cy="12" r="6.5" fill="#2747D9" />
          </svg>
          Akram Taha Zeyad
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <ul id="site-menu" className={styles.links} data-open={open ? '1' : undefined}>
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={current(item.href) ? 'page' : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
