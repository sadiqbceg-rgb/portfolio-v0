/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // `npm run preview` sets PREVIEW_EXPORT=1 to produce a static export in
  // .next-export/, which scripts/build-preview.mjs then inlines into a single
  // self-contained HTML file. The normal build and dev server are unaffected.
  ...(process.env.PREVIEW_EXPORT === '1'
    ? {
        output: 'export',
        distDir: '.next-export',
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
