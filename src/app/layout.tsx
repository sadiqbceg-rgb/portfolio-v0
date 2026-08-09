import type { Metadata, Viewport } from 'next';
import { identity } from '@/content/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(identity.url),
  title: `${identity.name} — ${identity.role}`,
  description: `Portfolio of ${identity.name}, ${identity.role} based in ${identity.location}.`,
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: `Portfolio of ${identity.name}, ${identity.role}.`,
    url: identity.url,
    siteName: identity.name,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are self-hosted from /public/fonts — see src/app/fonts.css.
            Preloading the two faces used above the fold (Inter for the nav and
            body, Caveat for the hero's cursive accent) stops the headline from
            reflowing once they arrive. Anton is not preloaded: it appears first
            in the statement section, well below the fold. */}
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/caveat-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
