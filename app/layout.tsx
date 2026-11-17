import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import PageTransition from '@/components/PageTransition';
import ThemeBoot from '@/components/ThemeBoot';
import { site } from '@/content/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | AI Researcher`, template: `%s | ${site.name}` },
  description: site.metaDescription,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'profile',
    url: '/',
    title: `${site.name} | AI Researcher`,
    description: site.metaDescription,
    images: [{ url: '/images/akram-photo.webp', width: 1200, height: 936, alt: site.name }],
  },
};

const FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Flag JS before first paint so reveal-on-scroll elements start hidden without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <ThemeBoot />
        <PageTransition />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
