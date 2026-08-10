import type { Metadata, Viewport } from 'next';
import { identity } from '@/content/site';
import './globals.css';

/**
 * Where this site is served from. Everything relative in the metadata below —
 * most importantly the generated opengraph-image.png — is resolved against it,
 * so a wrong value silently produces link previews with a broken image.
 *
 * Order: an explicit value in site.ts, then the deploy platform's own origin
 * (Vercel sets VERCEL_URL per deployment), then NEXT_PUBLIC_SITE_URL as a
 * manual override for anywhere else, then localhost for `next dev`.
 */
const siteUrl =
  identity.siteUrl ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${identity.name} — ${identity.role}`,
  description: `Portfolio of ${identity.name}, ${identity.role} based in ${identity.location}.`,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: `Portfolio of ${identity.name}, ${identity.role}.`,
    url: siteUrl,
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
