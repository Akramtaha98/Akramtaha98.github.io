import Button from '@/components/Button';
import CertificateGallery from '@/components/CertificateGallery';
import DarkBanner from '@/components/DarkBanner';
import Portrait from '@/components/Portrait';
import ScrollReveal from '@/components/ScrollReveal';
import { InterestGrid, PaperList, ProjectGrid } from '@/components/cards';
import { CtaBand, Section, SectionHeader } from '@/components/ui';
import { certificates, contact, home, interests, links, papers, projects, site } from '@/content/site';
import styles from './home.module.css';

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      <DarkBanner
        eyebrow={home.eyebrow}
        title={site.name}
        kicker={site.role}
        lede={home.lede}
        aside={<Portrait src={site.portrait.src} alt={site.portrait.alt} />}
      >
        {home.actions.map((a) => (
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

      {/* ── About ── */}
      <section id="about" className={`${styles.intro} container`}>
        <div className={styles.story}>
          <h2 className={styles.storyHeading} data-reveal="text">
            {home.story.heading}
          </h2>
          {home.story.paragraphs.map((p, i) => (
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
              {home.glance.map((row) => (
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
                <li key={a.org}>
                  <strong>{a.unit}</strong>
                  <span>
                    {a.org} · {a.place}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <Section id="interests">
        <SectionHeader eyebrow={interests.eyebrow} heading={interests.heading} />
        <InterestGrid items={interests.items} />
      </Section>

      <Section>
        <SectionHeader
          eyebrow={papers.eyebrow}
          heading="Recent research."
          action={{ label: 'All research', href: '/research/' }}
        />
        <PaperList items={papers.items.slice(0, 2)} />
      </Section>

      <Section>
        <SectionHeader eyebrow={projects.eyebrow} heading="Selected projects." action={{ label: 'All projects', href: '/projects/' }} />
        <ProjectGrid items={projects.items.filter((p) => p.featured)} />
      </Section>

      <Section>
        <SectionHeader
          eyebrow={certificates.eyebrow}
          heading="Latest certificates."
          action={{ label: `All ${certificates.items.length} certificates`, href: '/certificates/' }}
        />
        <CertificateGallery items={certificates.items} filters={false} limit={3} />
      </Section>

      <CtaBand
        heading={contact.heading}
        body={contact.lede}
        primary={{ label: 'Get in touch →', href: '/contact/' }}
        secondary={{ label: site.email, href: links.email }}
      />
    </>
  );
}
