import { PageHeader, Section } from '@/components/doc';
import { contact, links, site } from '@/content/site';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Let's talk." lede={contact.lede}>
        <a href={links.email} className="btn btn-primary">
          Email {site.email}
        </a>
      </PageHeader>

      <Section title="Profiles" wide>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px 28px' }}>
          {contact.profiles.map((p) => (
            <li key={p.label} style={{ borderTop: '1.5px solid var(--ink)', paddingTop: 12 }}>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="link" style={{ fontSize: '1.15rem' }}>
                {p.label}
              </a>
              {p.detail && <p style={{ color: 'var(--slate)', fontSize: '0.92rem', marginTop: 4 }}>{p.detail}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Where I work" wide>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
          {contact.places.map((p) => (
            <li key={p.name}>
              <p style={{ fontWeight: 600 }}>{p.name}</p>
              <p style={{ color: 'var(--slate)' }}>{p.where}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
