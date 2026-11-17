import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ACCENTS, type Accent } from '@/content/site';
import styles from './ui.module.css';

export const accentStyle = (accent: Accent) => ({ '--accent': ACCENTS[accent] }) as CSSProperties;

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** Link that uses next/link for routes and a plain <a> (new tab for http) otherwise. */
export function SmartLink({
  href,
  className,
  children,
  download,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  download?: boolean;
}) {
  if (download || href.endsWith('.pdf') || href.endsWith('.webp')) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" download={download || undefined}>
        {children}
      </a>
    );
  }
  if (isExternal(href)) {
    const http = href.startsWith('http');
    return (
      <a href={href} className={className} target={http ? '_blank' : undefined} rel={http ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Section({ id, children, tight }: { id?: string; children: ReactNode; tight?: boolean }) {
  return (
    <section id={id} className={`${styles.section} ${tight ? styles.tight : ''} container`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  heading,
  lede,
  action,
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  action?: { label: string; href: string };
}) {
  return (
    <header className={styles.header}>
      <div>
        <p className="eyebrow" data-reveal="text">
          {eyebrow}
        </p>
        <h2 className={styles.heading} data-reveal="text">
          {heading}
        </h2>
        {lede && (
          <p className={styles.lede} data-reveal="text">
            {lede}
          </p>
        )}
      </div>
      {action && (
        <SmartLink href={action.href} className={styles.headerAction}>
          {action.label} <span aria-hidden="true">→</span>
        </SmartLink>
      )}
    </header>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className={styles.tags}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function CtaBand({
  heading,
  body,
  primary,
  secondary,
}: {
  heading: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className={`${styles.ctaWrap} container`}>
      <div className={styles.cta}>
        <h2 data-reveal="text">{heading}</h2>
        <p data-reveal="text">{body}</p>
        <div className={styles.ctaRow}>
          <SmartLink href={primary.href} className={styles.ctaLink}>
            {primary.label}
          </SmartLink>
          {secondary && (
            <SmartLink href={secondary.href} className={styles.ctaSecondary}>
              {secondary.label}
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  );
}
