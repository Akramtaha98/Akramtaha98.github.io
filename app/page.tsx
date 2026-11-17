import AboutView from '@/components/AboutView';

/** The site root serves the profile directly (no redirect needed on GitHub Pages). */
export default function Home() {
  return <AboutView />;
}
