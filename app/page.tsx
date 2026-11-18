import CertificateGallery from '@/components/CertificateGallery';
import GroundedHero from '@/components/GroundedHero';
import TermRibbon from '@/components/TermRibbon';
import { Glossary, Notes, PaperList, ProjectRows, Prose, Section, Steps } from '@/components/doc';
import { about, certificates, interests, papers, programme, projects } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <GroundedHero />
      <TermRibbon />

      <Section id="about" title={about.heading} notes={<Notes items={about.notes} />}>
        <Prose paragraphs={about.paragraphs} />
      </Section>

      <Section id="interests" title={interests.heading}>
        <Glossary items={interests.items} />
      </Section>

      <Section id="programme" title={programme.heading} lede={programme.lede} wide>
        <Steps steps={programme.steps} />
      </Section>

      <Section id="papers" title={papers.heading} more={{ label: 'All research', href: '/research/' }}>
        <PaperList items={papers.items.slice(0, 2)} />
      </Section>

      <Section id="projects" title={projects.heading} more={{ label: 'All projects', href: '/projects/' }} wide>
        <ProjectRows items={projects.items.slice(0, 3)} />
      </Section>

      <Section
        id="certificates"
        title={certificates.heading}
        more={{ label: `All ${certificates.items.length} certificates`, href: '/certificates/' }}
        wide
      >
        <CertificateGallery items={certificates.items} filters={false} limit={3} />
      </Section>
    </>
  );
}
