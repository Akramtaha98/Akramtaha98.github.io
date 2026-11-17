import { A, Chips, PageHeader, Section, Timeline } from '@/components/doc';
import { certificates, cv, links } from '@/content/site';

export const metadata = { title: 'Curriculum vitae' };

export default function CvPage() {
  return (
    <>
      <PageHeader title={cv.heading} lede={cv.lede}>
        <a href={links.cv} className="btn btn-primary" download>
          Download CV (PDF)
        </a>
        <a href="#full-cv" className="btn">
          Preview the PDF
        </a>
      </PageHeader>

      <Section title="Education">
        <Timeline items={cv.education} />
      </Section>

      <Section title="Experience">
        <Timeline items={cv.experience} />
      </Section>

      <Section title="Skills">
        <div style={{ display: 'grid', gap: 22 }}>
          {cv.skills.map((g) => (
            <div key={g.group}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 10 }}>{g.group}</h3>
              <Chips items={g.items} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Certificates" more={{ label: 'See them all', href: '/certificates/' }}>
        <ul style={{ display: 'grid', gap: 10 }}>
          {certificates.items.map((c) => (
            <li key={c.title} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2px 16px' }}>
              <A href={c.verify ?? c.file} className="link">
                {c.title}
              </A>
              <span style={{ color: 'var(--slate)', fontSize: '0.92rem' }}>
                {c.issuer}, {c.issued}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="full-cv" title="Full CV" more={{ label: 'Open the PDF', href: links.cv }} wide>
        <div style={{ display: 'grid', gap: 20, maxWidth: 820 }}>
          {cv.pages.map((src, i) => (
            <a key={src} href={links.cv} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`CV page ${i + 1} of ${cv.pages.length}`}
                loading="lazy"
                width={1100}
                height={1424}
                style={{ border: '1px solid var(--line)', borderRadius: 6, background: '#fff' }}
              />
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
