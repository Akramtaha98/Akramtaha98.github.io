import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import PageTransition from '@/components/PageTransition';
import { site } from '@/content/site';
// Self-hosted fonts (no third-party requests).
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-400-italic.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-500.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | AI researcher`, template: `%s | ${site.name}` },
  description: site.metaDescription,
  openGraph: {
    type: 'profile',
    url: '/',
    title: `${site.name} | AI researcher`,
    description: site.metaDescription,
    images: [{ url: '/images/akram-photo.webp', width: 1200, height: 936, alt: site.name }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Flag JS before first paint so the hero can stage its sequence without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <PageTransition />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
