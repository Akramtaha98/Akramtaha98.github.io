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
