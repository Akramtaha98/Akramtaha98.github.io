import Link from 'next/link';
import { footer, site } from '@/content/site';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.copy}>{site.role}</p>
        </div>
        <nav className={styles.links} aria-label="Footer">
          {[...site.nav, site.navCta].map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.links}>
          {footer.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className={styles.base}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className={styles.note}>{footer.note}</p>
      </div>
    </footer>
  );
}
