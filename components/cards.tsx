import type { Accent, Project } from '@/content/site';
import styles from './cards.module.css';
import { SmartLink, Tags, accentStyle } from './ui';

export function InterestGrid({ items }: { items: { title: string; accent: Accent; detail: string }[] }) {
  return (
    <div className={styles.interestGrid}>
      {items.map((c) => (
        <article key={c.title} className={styles.interest} data-reveal="card" style={accentStyle(c.accent)}>
          <div className={styles.interestHead}>
            <span className={styles.dot} aria-hidden="true" />
            <h3>{c.title}</h3>
          </div>
          <p>{c.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function ProjectGrid({ items }: { items: Project[] }) {
  return (
    <div className={styles.projectGrid}>
      {items.map((p) => {
        const body = (
          <>
            <span className={styles.kicker}>{p.category}</span>
            <h3 className={styles.projectTitle}>{p.title}</h3>
            <p className={styles.projectText}>{p.summary}</p>
            <Tags items={p.tags} />
            <span className={styles.projectLink}>{p.href ? 'View on GitHub ↗' : 'In development'}</span>
          </>
        );
        return p.href ? (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.project} ${styles.interactive}`}
            data-reveal="card"
            style={accentStyle(p.accent)}
          >
            {body}
          </a>
        ) : (
          <article key={p.title} className={styles.project} data-reveal="card" style={accentStyle(p.accent)}>
            {body}
          </article>
        );
      })}
    </div>
  );
}

export function PaperList({
  items,
}: {
  items: { title: string; status: string; summary: string; tags: string[]; pages: string; href: string; accent: Accent }[];
}) {
  return (
    <ol className={styles.paperList}>
      {items.map((p, i) => (
        <li key={p.title} className={styles.paper} data-reveal="card" style={accentStyle(p.accent)}>
          <span className={styles.paperIndex}>{String(i + 1).padStart(2, '0')}</span>
          <div className={styles.paperBody}>
            <span className={styles.kicker}>{p.status}</span>
            <h3 className={styles.paperTitle}>{p.title}</h3>
            <p className={styles.paperText}>{p.summary}</p>
            <div className={styles.paperFoot}>
              <Tags items={p.tags} />
              <span className={styles.paperMeta}>{p.pages}</span>
            </div>
          </div>
          <div className={styles.paperActions}>
            <SmartLink href={p.href} className={styles.btnSmall}>
              Read PDF ↗
            </SmartLink>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProgrammeSteps({
  steps,
}: {
  steps: { step: string; label: string; status: string; title: string; summary: string; href: string; linkLabel: string }[];
}) {
  return (
    <ol className={styles.steps}>
      {steps.map((s) => (
        <li key={s.step} className={styles.stepItem} data-reveal="card">
          <div className={styles.stepNum}>{s.step}</div>
          <div className={styles.stepCard}>
            <span className={styles.kicker}>
              {s.label} · {s.status}
            </span>
            <h3>{s.title}</h3>
            <p>{s.summary}</p>
            <SmartLink href={s.href} className={styles.inlineLink}>
              {s.linkLabel} ↗
            </SmartLink>
          </div>
        </li>
      ))}
    </ol>
  );
}
