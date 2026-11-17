import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Paper, Project, TimelineEntry } from '@/content/site';
import styles from './doc.module.css';

/** Plain <a> for files, mail and external URLs; next/link for routes. */
export function A({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const file = /\.(pdf|webp|png|jpg)$/.test(href);
  if (file || /^https?:/.test(href))
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  if (href.startsWith('mailto:') || href.startsWith('#'))
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Title block for inner pages. */
export function PageHeader({ title, lede, children }: { title: string; lede?: string; children?: ReactNode }) {
  return (
    <header className={`${styles.pageHeader} page`}>
      <h1>{title}</h1>
      {lede && <p className={styles.pageLede}>{lede}</p>}
      {children && <div className={styles.pageActions}>{children}</div>}
    </header>
  );
}

/**
 * A document section: heading in the left margin column, content in the
 * reading column, optional side notes in the right margin.
 */
export function Section({
  id,
  title,
  lede,
  more,
  notes,
  wide,
  children,
}: {
  id?: string;
  title: string;
  lede?: string;
  more?: { label: string; href: string };
  notes?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${styles.section} ${wide ? styles.wide : ''} page`} aria-labelledby={id ? `${id}-h` : undefined}>
      <div className={styles.sectionHead}>
        <h2 id={id ? `${id}-h` : undefined}>{title}</h2>
        {lede && <p>{lede}</p>}
        {more && (
          <A href={more.href} className={`link ${styles.more}`}>
            {more.label}
          </A>
        )}
      </div>
      <div className={styles.sectionBody}>{children}</div>
      {notes && <aside className={styles.notes}>{notes}</aside>}
    </section>
  );
}

export function Notes({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className={styles.noteList}>
      {items.map((n) => (
        <div key={n.k}>
          <dt>{n.k}</dt>
          <dd>{n.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={styles.prose}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function Glossary({ items }: { items: { term: string; def: string }[] }) {
  return (
    <dl className={styles.glossary}>
      {items.map((i) => (
        <div key={i.term}>
          <dt>{i.term}</dt>
          <dd>{i.def}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A real sequence, so it is numbered. */
export function Steps({
  steps,
}: {
  steps: { label: string; status: string; title: string; summary: string; href: string; linkLabel: string }[];
}) {
  return (
    <ol className={styles.steps}>
      {steps.map((s, i) => (
        <li key={s.label}>
          <span className={styles.stepNo} aria-hidden="true">
            {i + 1}
          </span>
          <p className={styles.stepLabel}>
            {s.label}
            <span>{s.status}</span>
          </p>
          <h3>{s.title}</h3>
          <p className={styles.stepText}>{s.summary}</p>
          <A href={s.href} className="link">
            {s.linkLabel}
          </A>
        </li>
      ))}
    </ol>
  );
}

export function PaperList({ items }: { items: Paper[] }) {
  return (
    <ul className={styles.papers}>
      {items.map((p) => (
        <li key={p.title}>
          <p className={styles.paperStatus}>{p.status}</p>
          <h3>
            <A href={p.href} className={styles.paperTitle}>
              {p.title}
            </A>
          </h3>
          <p className={styles.paperText}>{p.summary}</p>
          <p className={styles.paperMeta}>
            <A href={p.href} className="link">
              Read the PDF
            </A>
            <span>{p.pages}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function ProjectRows({ items }: { items: Project[] }) {
  return (
    <ul className={styles.projects}>
      {items.map((p) => (
        <li key={p.title}>
          <h3>{p.href ? <A href={p.href}>{p.title}</A> : p.title}</h3>
          <p className={styles.projectWhat}>{p.what}</p>
          <p className={styles.projectStack}>
            {p.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
          <p className={styles.projectLink}>
            {p.href ? (
              <A href={p.href} className="link">
                Source on GitHub
              </A>
            ) : (
              <span>{p.status}</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((e) => (
        <li key={e.title + e.when}>
          <p className={styles.when}>{e.when}</p>
          <div>
            <h3>{e.title}</h3>
            <p className={styles.org}>{e.org}</p>
            {e.points && (
              <ul>
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className={styles.chips}>
      {items.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  );
}
