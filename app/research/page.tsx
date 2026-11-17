import Button from '@/components/Button';
import DarkBanner from '@/components/DarkBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { InterestGrid, PaperList, ProgrammeSteps } from '@/components/cards';
import { CtaBand, Section, SectionHeader } from '@/components/ui';
import { contact, interests, links, papers, programme } from '@/content/site';

export const metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <>
      <ScrollReveal />
      <DarkBanner
        compact
        eyebrow="/ research"
        title="Reliable, evidence-grounded AI."
        lede="When a grounding score improves, do the answers improve too? My research tests that question across retrieval, fine-tuning and evaluation, with a focus on Arabic and Malay."
      >
        <Button href="#papers">Read the papers</Button>
        <Button href={links.scholar} variant="ghost" icon="↗">
          Google Scholar
        </Button>
      </DarkBanner>

      <Section>
        <SectionHeader eyebrow={programme.eyebrow} heading={programme.heading} lede={programme.lede} />
        <ProgrammeSteps steps={programme.steps} />
      </Section>

      <Section id="papers">
        <SectionHeader
          eyebrow={papers.eyebrow}
          heading={papers.heading}
          lede={papers.lede}
          action={{ label: papers.scholarLabel, href: links.scholar }}
        />
        <PaperList items={papers.items} />
      </Section>

      <Section>
        <SectionHeader eyebrow={interests.eyebrow} heading={interests.heading} />
        <InterestGrid items={interests.items} />
      </Section>

      <CtaBand
        heading="Interested in collaborating?"
        body={contact.lede}
        primary={{ label: 'Get in touch →', href: '/contact/' }}
      />
    </>
  );
}
