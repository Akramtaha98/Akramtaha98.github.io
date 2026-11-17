import Button from '@/components/Button';
import DarkBanner from '@/components/DarkBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { Section, SectionHeader, SmartLink } from '@/components/ui';
import { certificates, cv, interests, links, papers, site } from '@/content/site';
import styles from './cv.module.css';

export const metadata = { title: 'Curriculum Vitae' };

export default function CvPage() {
  return (
    <>
      <ScrollReveal />
      <DarkBanner compact eyebrow={cv.eyebrow} title={site.name} kicker={site.role} lede={cv.lede}>
        <Button href={links.cv} icon="↓" download>
          Download CV (PDF)
        </Button>
        <Button href="#preview" variant="ghost">
          Preview
        </Button>
      </DarkBanner>

      <Section tight>
        <div className={styles.layout}>
          <div className={styles.main}>
            <CvBlock title="Positions">
              {cv.positions.map((p) => (
                <article key={p.org} className={styles.entry} data-reveal="text">
                  <h4>{p.title}</h4>
                  <p className={styles.org}>
                    {p.org} · {p.place}
                  </p>
                  <p>{p.detail}</p>
                </article>
              ))}
            </CvBlock>

            <CvBlock title="Education & awards">
              <ol className={styles.timeline}>
                {cv.education.map((e) => (
                  <li key={e.title} data-reveal="text">
                    <span className={styles.when}>{e.when}</span>
                    <div>
                      <h4>{e.title}</h4>
                      <p className={styles.org}>{e.org}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CvBlock>

            <CvBlock title="Research outputs">
              {papers.items.map((p) => (
                <article key={p.title} className={styles.entry} data-reveal="text">
                  <p className={styles.org}>{p.status}</p>
                  <h4 className={styles.paper}>{p.title}</h4>
                  <SmartLink href={p.href} className={styles.link}>
                    Read PDF ↗
                  </SmartLink>
                </article>
              ))}
            </CvBlock>
          </div>

          <aside className={styles.side}>
            <CvBlock title="Research interests">
              <ul className={styles.list}>
                {interests.items.map((i) => (
                  <li key={i.title}>{i.title}</li>
                ))}
              </ul>
            </CvBlock>

            {cv.skills.map((g) => (
              <CvBlock key={g.group} title={g.group}>
                <ul className={styles.chips}>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </CvBlock>
            ))}

            <CvBlock title="Certificates">
              <ul className={styles.certs}>
                {certificates.items.map((c) => (
                  <li key={c.title}>
                    <a href={c.verify ?? c.file} target="_blank" rel="noopener noreferrer">
                      {c.title}
                    </a>
                    <span>
                      {c.issuer} · {c.issued}
                    </span>
                  </li>
                ))}
              </ul>
            </CvBlock>
          </aside>
        </div>
      </Section>

      <Section id="preview">
        <SectionHeader eyebrow="/ preview" heading="Full CV." action={{ label: 'Open in new tab', href: links.cv }} />
        <div className={styles.pages}>
          {cv.pages.map((src, i) => (
            <a key={src} href={links.cv} target="_blank" rel="noopener noreferrer" className={styles.page}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`CV page ${i + 1} of ${cv.pages.length}`} loading="lazy" width={1100} height={1424} />
            </a>
          ))}
        </div>
      </Section>
      <div style={{ height: 72 }} />
    </>
  );
}

function CvBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{title}</h3>
      {children}
    </section>
  );
}
