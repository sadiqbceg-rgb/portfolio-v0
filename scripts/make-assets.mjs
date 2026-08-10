/**
 * Regenerates the two brand assets that are pictures rather than markup:
 *
 *   src/app/opengraph-image.png   the 1200x630 social card
 *   src/app/favicon.ico           16px + 32px, for /favicon.ico
 *
 * Both are derived from src/app/icon.svg and src/content/site.ts, so the mark
 * and the wording cannot drift apart. Next.js picks both files up by
 * convention and emits the corresponding tags.
 *
 * The card is rendered in headless Chromium using the site's own self-hosted
 * Inter (embedded as a data URI, because a file:// page cannot fetch from
 * /public) and the same colour values as globals.css. That is why it looks
 * like the site rather than approximately like it.
 *
 * Run it after changing the name, role, or location in src/content/site.ts:
 *
 *   npm run assets
 *
 * It is deliberately not wired into `npm run build`. The outputs are
 * committed, builds stay hermetic, and CI does not need a browser.
 */

import { launchChromium } from './lib/browser.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/app/opengraph-image.png');

/* Read the card's copy straight out of the content file so this cannot drift
   from the site. A regex rather than an import: site.ts is TypeScript with a
   path alias, and spawning a transpiler to read three strings is not worth
   it. */
const site = readFileSync(join(root, 'src/content/site.ts'), 'utf8');
const field = (name) => {
  const m = site.match(new RegExp(`${name}:\\s*'([^']*)'`));
  if (!m) throw new Error(`Could not read identity.${name} from site.ts`);
  return m[1];
};

const NAME = field('name');
const PLACE = field('location');
// The role line uses pipes in site.ts; middots read better at display size.
const ROLE = field('role').replace(/\s*\|\s*/g, ' · ');

const inter = readFileSync(
  join(root, 'public/fonts/inter-latin.woff2'),
).toString('base64');
const icon = readFileSync(join(root, 'src/app/icon.svg'), 'utf8');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:100 900;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#000;color:#fff;font-family:Inter,sans-serif;
     display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;position:relative;overflow:hidden}
.glow{position:absolute;width:900px;height:900px;left:50%;top:58%;transform:translate(-50%,-50%);
      background:radial-gradient(circle,rgba(43,127,255,.30) 0%,rgba(43,127,255,.10) 38%,transparent 68%)}
.row{display:flex;align-items:center;gap:20px;position:relative}
.mark{width:56px;height:56px}
.wordmark{font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.72)}
main{position:relative}
h1{font-size:104px;line-height:1.02;letter-spacing:-.035em;font-weight:600}
.role{margin-top:26px;font-size:31px;line-height:1.35;color:rgba(255,255,255,.78);font-weight:400}
footer{position:relative;display:flex;justify-content:space-between;align-items:baseline;
       font-size:21px;color:rgba(255,255,255,.62);border-top:1px solid rgba(255,255,255,.16);padding-top:22px}
</style></head><body>
<div class="glow"></div>
<div class="row"><div class="mark">${icon.replace('<svg ', '<svg width="56" height="56" ')}</div><div class="wordmark">GNH</div></div>
<main><h1>${NAME}</h1><div class="role">${ROLE}</div></main>
<footer><span>${PLACE}</span><span>Portfolio</span></footer>
</body></html>`;

const browser = await launchChromium();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

// Fail loudly rather than shipping a card set in the fallback system font.
const interLoaded = await page.evaluate(() =>
  [...document.fonts].some(
    (f) => f.family === 'Inter' && f.status === 'loaded',
  ),
);
if (!interLoaded)
  throw new Error(
    'Inter did not load — refusing to write a fallback-font card',
  );

await page.screenshot({ path: out });
await page.close();

writeFileSync(
  join(root, 'src/app/opengraph-image.alt.txt'),
  `${NAME} — ${ROLE}. Portfolio.`,
);
console.log(`wrote ${out}`);

/* ---- favicon.ico ----------------------------------------------------------
   A modern browser uses the <link rel="icon"> that icon.svg produces, but it
   may still request /favicon.ico speculatively on a cold profile — which was
   a 404 on every first visit. Shipping a real one closes that. */

const iconPng = async (size) => {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.setContent(
    `<body style="margin:0">${icon.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`,
  );
  const buf = await p.screenshot({ omitBackground: true });
  await p.close();
  return buf;
};

const sizes = [16, 32];
const pngs = [];
for (const s of sizes) pngs.push(await iconPng(s));
await browser.close();

/* ICO container. Six-byte header, then one 16-byte directory entry per image,
   then the PNG payloads. Storing PNG rather than BMP inside an ICO is allowed
   and is what every current toolchain emits. */
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);

let offset = 6 + 16 * pngs.length;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0); // width  (0 would mean 256)
  e.writeUInt8(sizes[i], 1); // height
  e.writeUInt8(0, 2); // palette size: not paletted
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});

const ico = join(root, 'src/app/favicon.ico');
writeFileSync(ico, Buffer.concat([header, ...entries, ...pngs]));
console.log(`wrote ${ico}`);
