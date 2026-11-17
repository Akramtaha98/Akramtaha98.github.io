import { A, PageHeader, ProjectRows, Section } from '@/components/doc';
import { links, projects } from '@/content/site';

export const metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Things I have built." lede={projects.lede}>
        <A href={links.github} className="btn btn-primary">
          See my GitHub
        </A>
      </PageHeader>
      <Section title="All projects" wide>
        <ProjectRows items={projects.items} />
      </Section>
    </>
  );
}
