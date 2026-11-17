import DarkBanner from '@/components/DarkBanner';
import CertificateGallery from '@/components/CertificateGallery';
import { Section } from '@/components/ui';
import { certificates } from '@/content/site';

export const metadata = { title: 'Certificates' };

export default function CertificatesPage() {
  return (
    <>
      <DarkBanner compact eyebrow={certificates.eyebrow} title={certificates.heading} lede={certificates.lede} />
      <Section tight>
        <CertificateGallery items={certificates.items} />
      </Section>
      <div style={{ height: 72 }} />
    </>
  );
}
