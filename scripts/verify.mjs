/**
 * Post-build checks for the whole page, run against a real browser.
 *
 *   npm run build && npm start &
 *   node scripts/verify.mjs                  # defaults to http://localhost:3000
 *   node scripts/verify.mjs http://localhost:4310
 *
 * Exits non-zero if anything fails, so it works as a CI gate.
 *
 * Each check exists because the corresponding bug actually shipped at some
 * point during this build:
 *
 *   overflow      A section wider than the viewport gives the whole page a
 *                 horizontal scrollbar. Only ever visible at some widths.
 *   stuck-hidden  Scroll-triggered reveals that never fire leave text at
 *                 opacity 0 forever. An observer on a clipped child did this
 *                 once and the copy was invisible in production.
 *   preloads      `priority` on an image inside a per-item component fires
 *                 once per item. That put eight preloads (~1.2 MB) in the
 *                 document head.
 *   contrast      Tailwind emits oklab(), so colours are composited on a
 *                 canvas and measured rather than parsed.
 *
 * Reduced motion is a separate pass because the reduced and full trees must
 * render the same structure — only durations may differ. Branching markup on
 * useReducedMotion() caused five hydration mismatches; this pass catches a
 * regression as a stuck element or a console error.
 */

import { launchChromium } from './lib/browser.mjs';

const URL = process.argv[2] || 'http://localhost:3000';

const MODES = [
  { label: 'DESKTOP', width: 1440, height: 900, reduced: false },
  { label: 'REDUCED', width: 1440, height: 900, reduced: true },
  { label: 'MOBILE ', width: 390, height: 844, reduced: false },
];

/* Headless GPU chatter and a three.js deprecation notice are environment and
   library noise. Bucketed separately so they stay visible without masking a
   real error. */
const BENIGN = [
  /GL Driver Message/,
  /THREE\.Clock: This module has been deprecated/,
];

const browser = await launchChromium();
let failed = 0;

for (const mode of MODES) {
  const context = await browser.newContext({
    viewport: { width: mode.width, height: mode.height },
    reducedMotion: mode.reduced ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();

  const errors = [];
  const benign = [];
  const network = [];

  page.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    const line = `${m.type()}: ${m.text()}`;
    (BENIGN.some((r) => r.test(line)) ? benign : errors).push(line);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400) network.push(`${r.status()} ${r.url()}`);
  });
  page.on('requestfailed', (r) =>
    network.push(`FAILED ${r.url()} — ${r.failure()?.errorText}`),
  );

  await page.goto(URL, { waitUntil: 'networkidle' });

  // Walk the page in steps rather than jumping to the bottom: a single jump
  // can skip past an IntersectionObserver without ever triggering it, which
  // would make a genuinely stuck element look fine.
  const docHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < docHeight; y += Math.round(mode.height * 0.45)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(1200);

  /* Flag candidates, then confirm each one individually.
   *
   * A reveal that has not fired yet is not the same as a reveal that is
   * broken. Scrolling in steps can leave an element un-revealed while it sits
   * far off-screen — an earlier version of this script reported those as
   * failures, which made it fail roughly one run in four for no reason.
   *
   * So: collect everything currently at zero opacity, then bring each one to
   * the middle of the viewport and look again. Still hidden with the element
   * plainly on screen is a real defect; anything that reveals on arrival was
   * simply waiting its turn. */
  const candidates = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('body *')) {
      if (el.getAttribute('aria-hidden') === 'true') continue;
      const text = (el.textContent || '').trim();
      if (!text || el.children.length > 0) continue; // leaf text only
      // checkVisibility walks ancestors, so `hidden md:flex` wrappers that are
      // display:none at this breakpoint are correctly excluded.
      if (
        !el.checkVisibility({
          contentVisibilityAuto: true,
          visibilityProperty: true,
        })
      )
        continue;
      const opacity = parseFloat(getComputedStyle(el).opacity);
      const rect = el.getBoundingClientRect();
      if (opacity < 0.05 || (rect.width === 0 && rect.height === 0)) {
        el.setAttribute('data-verify-candidate', String(n));
        n++;
      }
    }
    return n;
  });

  const stuck = [];
  for (let i = 0; i < candidates; i++) {
    await page.evaluate((n) => {
      document
        .querySelector(`[data-verify-candidate="${n}"]`)
        ?.scrollIntoView({ block: 'center' });
    }, i);
    await page.waitForTimeout(600);

    const verdict = await page.evaluate((n) => {
      const el = document.querySelector(`[data-verify-candidate="${n}"]`);
      if (!el) return null;
      const opacity = parseFloat(getComputedStyle(el).opacity);
      const rect = el.getBoundingClientRect();
      if (opacity >= 0.05 && (rect.width > 0 || rect.height > 0)) return null;
      const text = (el.textContent || '').trim().slice(0, 40);
      return `<${el.tagName.toLowerCase()}> "${text}" opacity=${opacity}`;
    }, i);

    if (verdict) stuck.push(verdict);
  }

  const report = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      overflow: root.scrollWidth - root.clientWidth,
      imagePreloads: document.querySelectorAll(
        'link[rel="preload"][as="image"]',
      ).length,
      sections: [...document.querySelectorAll('section[id]')].map((s) => s.id),
    };
  });

  const ok =
    report.overflow <= 0 &&
    stuck.length === 0 &&
    report.imagePreloads === 0 &&
    errors.length === 0 &&
    network.length === 0;
  if (!ok) failed++;

  console.log(`\n[${mode.label}] ${ok ? 'PASS' : 'FAIL'}`);
  console.log(`  horizontal overflow : ${report.overflow}px`);
  console.log(
    `  stuck hidden        : ${stuck.length} (of ${candidates} unrevealed at rest)`,
  );
  stuck.slice(0, 8).forEach((s) => console.log(`      - ${s}`));
  console.log(`  image preloads      : ${report.imagePreloads}`);
  console.log(`  sections            : ${report.sections.join(', ')}`);
  console.log(`  console errors      : ${errors.length}`);
  errors.slice(0, 8).forEach((e) => console.log(`      - ${e}`));
  console.log(`  network >= 400      : ${network.length}`);
  network.slice(0, 8).forEach((e) => console.log(`      - ${e}`));
  if (benign.length) {
    console.log(`  ignored (env noise) : ${benign.length}`);
  }

  await context.close();
}

/* ---- contrast -------------------------------------------------------------
   Measured, not computed from source: Tailwind v4 emits oklab() and colours
   land on translucent layers, so the only reliable reading composites the
   actual computed foreground over the actual painted background. */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const contrast = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    /* Paint an opaque base, then every layer in order, and read the result.
       Layers must be composited as a stack rather than collapsed to "the
       nearest ancestor with a background": the filter pills sit on
       rgba(0,0,0,.1) over the page's black, and treating that translucent
       layer as the background made white-on-black measure as 1.26:1. */
    const paint = (layers) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1, 1);
      for (const layer of layers) {
        ctx.fillStyle = layer;
        ctx.fillRect(0, 0, 1, 1);
      }
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };

    const luminance = ([r, g, b]) => {
      const f = (c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    // Every painted background from the root down to the element, outermost
    // first — including the element's own, which may be translucent.
    const backdrop = (el) => {
      const layers = [];
      for (let node = el; node; node = node.parentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent')
          layers.push(bg);
      }
      return layers.reverse();
    };

    const seen = new Map();
    for (const el of document.querySelectorAll('body *')) {
      const text = (el.textContent || '').trim();
      if (!text || el.children.length > 0) continue;
      if (!el.checkVisibility({ visibilityProperty: true })) continue;

      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const layers = backdrop(el);
      const key = `${cs.color}|${layers.join('/')}|${size}|${weight}`;
      if (seen.has(key)) continue;

      const fg = luminance(paint([...layers, cs.color]));
      const bg = luminance(paint(layers));
      const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);

      // WCAG "large text": >=24px, or >=18.66px when bold.
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;

      seen.set(key, {
        sample: text.slice(0, 32),
        color: cs.color,
        size: Math.round(size),
        ratio: Math.round(ratio * 100) / 100,
        required,
        pass: ratio >= required,
      });
    }
    return [...seen.values()];
  });

  const bad = contrast.filter((c) => !c.pass);
  console.log(`\n[CONTRAST] ${bad.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`  distinct text styles: ${contrast.length}`);
  if (bad.length) {
    failed++;
    for (const c of bad) {
      console.log(
        `      - ${c.ratio}:1 (needs ${c.required}) ${c.size}px ${c.color} — "${c.sample}"`,
      );
    }
  }

  await context.close();
}

await browser.close();
console.log(
  `\n=== ${failed === 0 ? 'ALL CHECKS PASS' : `${failed} CHECK GROUP(S) FAILED`} ===`,
);
process.exit(failed === 0 ? 0 : 1);
