import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  href: string;
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  download?: boolean;
  children: ReactNode;
}

/** Banner call-to-action. Downloads and external links render a plain <a>. */
export default function Button({ href, variant = 'primary', icon, download, children }: ButtonProps) {
  const className = `${styles.btn} ${styles[variant]}`;
  const content = (
    <>
      {children}
      {icon && <span aria-hidden="true">{icon}</span>}
    </>
  );
  if (download || !href.startsWith('/')) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={className}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
