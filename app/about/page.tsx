import AboutView from '@/components/AboutView';
import { site } from '@/content/site';

export const metadata = { title: `About — ${site.name}` };

export default function AboutPage() {
  return <AboutView />;
}
