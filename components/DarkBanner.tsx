import type { ReactNode } from 'react';
import ConstellationField from './ConstellationField';
import styles from './DarkBanner.module.css';

interface DarkBannerProps {
  eyebrow: string;
  title: string;
  kicker?: string;
  lede?: string;
  /** Optional right-hand column (e.g. a portrait). */
  aside?: ReactNode;
  /** Action buttons row. */
  children?: ReactNode;
}

/** Full-bleed dark hero with the interactive constellation background. */
export default function DarkBanner({ eyebrow, title, kicker, lede, aside, children }: DarkBannerProps) {
  return (
    <section className={styles.band} data-dark-band>
      <ConstellationField />
      <div className={`${styles.inner} ${aside ? styles.split : ''}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          {lede && <p className={styles.lede}>{lede}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </section>
  );
}
