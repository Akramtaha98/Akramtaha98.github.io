import CertificateGallery from '@/components/CertificateGallery';
import { PageHeader, Section } from '@/components/doc';
import { certificates } from '@/content/site';

export const metadata = { title: 'Certificates' };

export default function CertificatesPage() {
  return (
    <>
      <PageHeader title="Courses and credentials." lede={certificates.lede} />
      <Section title={`${certificates.items.length} certificates`} wide>
        <CertificateGallery items={certificates.items} />
      </Section>
    </>
  );
}
