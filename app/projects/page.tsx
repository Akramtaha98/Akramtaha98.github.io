import Button from '@/components/Button';
import DarkBanner from '@/components/DarkBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { ProjectGrid } from '@/components/cards';
import { CtaBand, Section } from '@/components/ui';
import { contact, links, projects } from '@/content/site';

export const metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <>
      <ScrollReveal />
      <DarkBanner compact eyebrow={projects.eyebrow} title={projects.heading} lede={projects.lede}>
        <Button href={links.github} icon="↗">
          GitHub profile
        </Button>
      </DarkBanner>

      <Section tight>
        <ProjectGrid items={projects.items} />
      </Section>

      <CtaBand heading={contact.heading} body={contact.lede} primary={{ label: 'Get in touch →', href: '/contact/' }} />
    </>
  );
}
