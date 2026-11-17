import { A, Glossary, PageHeader, PaperList, Section, Steps } from '@/components/doc';
import { interests, links, papers, programme } from '@/content/site';

export const metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        title="Does a better score mean a better answer?"
        lede="My research tests that question for retrieval-augmented generation in Arabic and Malay, across retrieval, fine-tuning and evaluation."
      >
        <a href="#papers" className="btn btn-primary">
          Read the papers
        </a>
        <A href={links.scholar} className="btn">
          Google Scholar profile
        </A>
      </PageHeader>

      <Section title={programme.heading} lede={programme.lede} wide>
        <Steps steps={programme.steps} />
      </Section>

      <Section id="papers" title={papers.heading} lede={papers.lede}>
        <PaperList items={papers.items} />
        <h3 style={{ marginTop: 36, fontSize: '1.05rem', fontWeight: 600 }}>Other work</h3>
        <ul style={{ marginTop: 10, display: 'grid', gap: 8, color: 'var(--slate)' }}>
          {papers.other.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title={interests.heading}>
        <Glossary items={interests.items} />
      </Section>
    </>
  );
}
