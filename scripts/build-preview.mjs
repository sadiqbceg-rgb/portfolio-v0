/* Build a single self-contained HTML preview from the Next static export.
 *
 *   npm run preview   →  preview/index.html
 *
 * Everything is inlined — CSS, JS chunks, and fonts as data: URIs — so the
 * file runs from anywhere with zero network requests: open it directly, email
 * it, drop it on any static host. React still hydrates, so the project filter,
 * mobile menu, scroll reveals, counters and star field all work.
 *
 * Asset paths are replaced by a plain global string swap rather than by
 * rewriting tags. Next serialises the same <link> elements into the RSC flight
 * payload and React recreates them during hydration, so rewriting only the tags
 * leaves the payload pointing at files that are not there. Swapping the raw
 * path string fixes both copies at once.
 *
 * Note: the output is a snapshot. Re-run it after editing src/content/site.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(REPO, '.next-export');
const OUT = path.join(REPO, 'preview', 'index.html');

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error(
    'No static export found at .next-export/.\n' +
      'Run `npm run preview`, which builds the export first.',
  );
  process.exit(1);
}

const read = (p) => fs.readFileSync(path.join(ROOT, p.replace(/^\//, '')));
const b64 = (p) => read(p).toString('base64');

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// --- Fonts: path -> data: URI (covers the CSS, the tags and the payload) ---
const fontPaths = [
  ...new Set(
    (html.match(/\/fonts\/[A-Za-z0-9._-]+\.woff2/g) || []).concat(
      fs.readdirSync(path.join(ROOT, 'fonts')).map((f) => `/fonts/${f}`),
    ),
  ),
];

// --- CSS: inline fonts into it, then expose the whole sheet as a data: URI ---
const cssPaths = [...new Set(html.match(/\/_next\/static\/css\/[^"']+\.css/g) || [])];
const cssUri = {};
for (const p of cssPaths) {
  let css = read(p).toString('utf8');
  for (const f of fontPaths) {
    css = css.split(f).join(`data:font/woff2;base64,${b64(f)}`);
  }
  cssUri[p] = `data:text/css;base64,${Buffer.from(css, 'utf8').toString('base64')}`;
}

// --- Scripts: inline in document order, before any path swapping ---
html = html.replace(
  /<script([^>]*)src="([^"]+)"([^>]*)><\/script>/g,
  (_m, a, src, b) => {
    // Minified chunks contain literal U+FFFD characters inside JS string
    // literals (a URI-decoding polyfill emits them for invalid input). They are
    // legitimate source, but a raw replacement character reads as encoding
    // corruption to anything that validates the file, so express them as the
    // equivalent � escape — identical semantics inside a string literal.
    const code = read(src)
      .toString('utf8')
      .replace(/<\/script/gi, '<\\/script')
      .replace(/�/g, '\\uFFFD');
    const attrs = (a + b)
      .replace(/\s*(async|defer|nomodule|crossorigin(="[^"]*")?)\s*/g, ' ')
      .trim();
    return `<script${attrs ? ' ' + attrs : ''}>${code}</script>`;
  },
);

// --- Lazy chunks -----------------------------------------------------------
// Code-split chunks (Three.js, via next/dynamic) are not referenced by any
// <script src> in the HTML — webpack fetches them at runtime, which a
// single-file page cannot do. Appending every remaining chunk inline makes
// webpack mark them installed, so the dynamic import() resolves from memory
// instead of hitting the network. Without this the import rejects and takes
// the whole client render down with it.
const chunkDir = path.join(ROOT, '_next', 'static', 'chunks');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full.endsWith('.js') ? [full] : [];
  });

const alreadyInlined = new Set(
  [...html.matchAll(/\/_next\/static\/chunks\/[^"']+\.js/g)].map((m) => m[0]),
);
const lazy = walk(chunkDir)
  .map((abs) => '/' + path.relative(ROOT, abs).split(path.sep).join('/'))
  .filter((rel) => !alreadyInlined.has(rel));

const lazyScripts = lazy
  .map((rel) => {
    const code = read(rel)
      .toString('utf8')
      .replace(/<\/script/gi, '<\\/script')
      .replace(/�/g, '\\uFFFD');
    return `<script>${code}</script>`;
  })
  .join('\n');

// Injected *before* the app scripts, not after. Webpack chunks self-register
// by pushing onto `self.webpackChunk_N_E`, and the runtime drains whatever is
// already in that array when it boots — so pre-registering works, but only if
// it happens first. Appended at the end of <body> the dynamic import has
// already fired and failed during hydration.
const firstScript = html.indexOf('<script');
html =
  firstScript === -1
    ? html + lazyScripts
    : html.slice(0, firstScript) + lazyScripts + '\n' + html.slice(firstScript);

// --- Global path swaps ---
for (const [p, uri] of Object.entries(cssUri)) html = html.split(p).join(uri);
for (const f of fontPaths) {
  html = html.split(f).join(`data:font/woff2;base64,${b64(f)}`);
}
html = html.replace(/<link[^>]*rel="preload"[^>]*_next[^>]*>/g, '');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);

const remaining = ['/_next/static/css', '/_next/static/chunks', '/fonts/'].filter(
  (pat) => html.includes(pat),
);

console.log(`preview/index.html — ${(html.length / 1e6).toFixed(2)} MB`);
console.log(`  lazy chunks pre-registered: ${lazy.length}`);
console.log(
  remaining.length
    ? `WARNING: unresolved asset paths remain: ${remaining.join(', ')}`
    : 'All assets embedded; the file makes no network requests.',
);
