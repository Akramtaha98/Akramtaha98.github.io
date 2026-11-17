import type { CSSProperties } from 'react';
import Button from '@/components/Button';
import DarkBanner from '@/components/DarkBanner';
import Portrait from '@/components/Portrait';
import ScrollReveal from '@/components/ScrollReveal';
import { ACCENTS, site } from '@/content/site';
import styles from './AboutView.module.css';

const accentVar = (accent: keyof typeof ACCENTS) => ({ '--accent': ACCENTS[accent] }) as CSSProperties;

/** The full single-page profile. Rendered at both `/` and `/about/`. */
export default function AboutView() {
  const { about } = site;
  const { competencies, projects, cta } = about;

  return (
    <div className={styles.page}>
      <ScrollReveal />

      <DarkBanner
        eyebrow={about.eyebrow}
        title={site.name}
        kicker={site.role}
        lede={about.lede}
        aside={<Portrait src={about.portrait.src} alt={about.portrait.alt} />}
      >
        {about.actions.map((a) => (
          <Button
            key={a.label}
            href={a.href}
            variant={a.variant}
            icon={'icon' in a ? a.icon : undefined}
            download={'download' in a ? a.download : undefined}
          >
            {a.label}
          </Button>
        ))}
      </DarkBanner>

      {/* ── Story + sidebar ── */}
      <section id="about" className={`${styles.intro} container`}>
        <div className={styles.story}>
          <h2 className={styles.storyHeading} data-reveal="text">
            {about.story.heading}
          </h2>
          {about.story.paragraphs.map((p, i) => (
            <p key={i} className={styles.storyText} data-reveal="text">
              {p.lead}
              {'emphasis' in p && <em>{p.emphasis}</em>}
              {'tail' in p && p.tail}
            </p>
          ))}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>At a glance</h3>
            <dl>
              {about.glance.map((row) => (
                <div key={row.k} className={styles.glanceRow}>
                  <dt>{row.k}</dt>
                  <dd>{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Affiliations</h3>
            <ul className={styles.affiliations}>
              {site.affiliations.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Links</h3>
            <div className={styles.profiles}>
              {about.profiles.map((p) => (
                <a key={p.label} href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <span>{p.label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* ── Research interests ── */}
      <section id={competencies.id} className={`${styles.section} container`}>
        <p className="eyebrow" data-reveal="text">
          {competencies.eyebrow}
        </p>
        <h2 className={styles.sectionHeading} data-reveal="text">
          {competencies.heading}
        </h2>
        <div className={styles.grid}>
          {competencies.items.map((c) => (
            <article key={c.title} className={styles.card} data-reveal="card" style={accentVar(c.accent)}>
              <div className={styles.cardHead}>
                <span className={styles.cardDot} aria-hidden="true" />
                <h3>{c.title}</h3>
              </div>
              <p>{c.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section id={projects.id} className={`${styles.section} container`}>
        <p className="eyebrow" data-reveal="text">
          {projects.eyebrow}
        </p>
        <h2 className={styles.sectionHeading} data-reveal="text">
          {projects.heading}
        </h2>
        <div className={styles.projectGrid}>
          {projects.items.map((p) => {
            const body = (
              <>
                <span className={styles.projectTag}>{p.tag}</span>
                <h3 className={styles.projectTitle}>{p.title}</h3>
                <p>{p.detail}</p>
                {'href' in p && p.href && <span className={styles.projectLink}>View on GitHub ↗</span>}
              </>
            );
            return 'href' in p && p.href ? (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.project} ${styles.projectInteractive}`}
                data-reveal="card"
                style={accentVar(p.accent)}
              >
                {body}
              </a>
            ) : (
              <article key={p.title} className={styles.project} data-reveal="card" style={accentVar(p.accent)}>
                {body}
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id={cta.id} className={`${styles.ctaWrap} container`}>
        <div className={styles.cta}>
          <h2 data-reveal="text">{cta.heading}</h2>
          <p data-reveal="text">{cta.body}</p>
          <div className={styles.ctaRow}>
            <a href={cta.link.href} className={styles.ctaLink}>
              {cta.link.label}
            </a>
            <a href={cta.link.href} className={styles.ctaEmail}>
              {cta.secondary}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
