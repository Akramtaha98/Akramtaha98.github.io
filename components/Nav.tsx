'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentProps, useEffect, useState } from 'react';
import { site } from '@/content/site';
import styles from './Nav.module.css';

const SOLID_AFTER_PX = 28;
const normalize = (p: string) => p.replace(/\/+$/, '') || '/';
const isRoute = (href: string) => href.startsWith('/');

/** Route links use next/link; anchors, mailto and external URLs use a plain <a>. */
function NavLink({ href, ...rest }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return isRoute(href) ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;
}

export default function Nav() {
  const pathname = normalize(usePathname() || '/');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Transparent-dark only while sitting on top of a dark banner.
  const solid = !site.darkBannerRoutes.includes(pathname) || scrolled || open;
  const isActive = (href: string) => {
    if (!isRoute(href)) return false;
    const h = normalize(href);
    return pathname === h || pathname.startsWith(h + '/');
  };

  return (
    <header className={styles.shell} data-solid={solid ? '1' : '0'}>
      <nav className={styles.bar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.brandText}>{site.shortName}</span>
        </Link>

        <ul className={styles.links}>
          {site.nav.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} className={styles.link} data-on={isActive(item.href) ? '1' : '0'}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink href={site.navCta.href} className={styles.cta}>
          {site.navCta.label}
        </NavLink>

        <button
          type="button"
          className={styles.burger}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        {open && (
          <ul className={styles.mobileMenu}>
            {[...site.nav, site.navCta].map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} data-on={isActive(item.href) ? '1' : '0'} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
