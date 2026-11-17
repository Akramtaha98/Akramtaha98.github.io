import Button from '@/components/Button';
import DarkBanner from '@/components/DarkBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { Section } from '@/components/ui';
import { contact, links, site } from '@/content/site';
import styles from './contact.module.css';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <ScrollReveal />
      <DarkBanner compact eyebrow={contact.eyebrow} title={contact.heading} lede={contact.lede}>
        <Button href={links.email}>Email me</Button>
        <Button href={links.cv} variant="ghost" icon="↓" download>
          Download CV
        </Button>
      </DarkBanner>

      <Section tight>
        <div className={styles.grid}>
          {contact.profiles.map((p) => (
            <a
              key={p.label}
              href={p.href}
              className={styles.card}
              data-reveal="card"
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              <span className={styles.icon} aria-hidden="true">
                {p.icon}
              </span>
              <span className={styles.text}>
                <strong>{p.label}</strong>
                <span>{p.detail}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className={styles.affil} data-reveal="text">
          {site.affiliations.map((a) => (
            <p key={a.org}>
              <strong>{a.unit}</strong>
              <br />
              {a.org}, {a.place}
            </p>
          ))}
        </div>
      </Section>
      <div style={{ height: 72 }} />
    </>
  );
}
