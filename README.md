# Portfolio

A software-engineering portfolio built to a supplied style reference — dark
atmospheric canvas, poster-scale display typography, flat Haze cards on black,
and a single handwritten accent word breaking an otherwise upright headline.

Next.js (App Router) · Tailwind CSS v4 · TypeScript · fully static.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## Making it yours

**Everything you need to edit lives in one file: [`src/content/site.ts`](src/content/site.ts).**

No copy is hard-coded in the markup. Change a string there and it appears on the
page — name, role, hero headline, projects, jobs, skills, links, footer.

Placeholder text is wrapped in square brackets. To find what is left to replace:

```bash
grep -n "\[" src/content/site.ts
```

A few things worth knowing as you edit:

| What | Where | Note |
|------|-------|------|
| Hero headline | `hero.headline` | An array of parts. Set `accent: true` on **one** word to give it the handwritten cut. More than one dilutes the effect. |
| Poster statement | `statement.lines` | Renders at up to 259px. Two or three short words — anything longer stops reading as a poster. |
| Project filters | `projects.items[].tag` | Filter chips are derived from the tags you use. Add a project with a new tag and its chip appears automatically. |
| Work card imagery | `work.items[].art` | Picks a generated background: `clouds`, `glass`, `ridge`, `orbit`. To use a real screenshot instead, set `image: '/work/name.png'` and drop the file in `public/work/` — the card then ignores `art`. |
| Portrait | `about.portrait` | Empty by default, which falls back to generated artwork. Set it to `/portrait.jpg` after adding the file to `public/`. |
| Résumé link | `nav.actions` | Points at `/resume.pdf`. Add that file to `public/` or change the link. |

### Turning on the contact form

The form ships inert on purpose — an unwired form that silently swallows
messages is worse than no form. Set `contact.formEndpoint` in `site.ts` to a
form-handler URL (Formspree, Basin, Web3Forms, or your own API route) and it
goes live. Until then the fields render disabled with a note pointing at your
email address.

## How the design system works

Design tokens from the style reference live at the top of
[`src/app/globals.css`](src/app/globals.css) in a Tailwind v4 `@theme` block —
colors, the type scale, radii, and layout constants. Change a value there and it
propagates everywhere; nothing downstream repeats a raw hex or pixel value.

Below the tokens, `@layer components` implements the reference's component
inventory as classes: `.btn-ghost`, `.btn-haze`, `.pill`, `.link-underline`,
`.card-haze`, `.card-image`, `.input`, `.display-headline`, `.accent-cursive`.

The rules the reference is strict about, and that the code follows:

- Buttons are ghost (transparent + 1px border) or haze (light fill). Never a
  solid saturated fill.
- No shadows anywhere. Surfaces separate by background contrast and 1px strokes.
- Radii are fixed: 4px inputs, 8px buttons, 11px images, 12px cards. Pills are
  for filter toggles only.
- Body text is 16px minimum at weight 500; long-form prose drops to 400.
- Signal Blue is for links and tags — never a button or background.

### Two deliberate departures

Both are contrast fixes, and both derive from the original tokens rather than
introducing new brand colors, so re-theming still flows through:

- **`.text-twilight-soft`** — the raw Twilight Blue (`#426188`) measures 3.2:1
  on the black canvas. That passes WCAG AA for large text, so section headings
  could use it as-is, but every place it actually appears is 13–20px eyebrow
  text, which needs 4.5:1. This is the same hue lightened to clear that bar.
- **`.text-signal-on-light`** — Signal Blue passes comfortably on black (5.6:1)
  but only reaches 3.4:1 on a Haze card. Text on Haze uses a darkened mix.

All 27 distinct text styles on the page pass WCAG AA.

## Typography

The reference specifies a proprietary family called *Control* in four cuts. This
uses the open substitutes named in the style guide, self-hosted from
`public/fonts` — no Google Fonts request, no third-party CDN, no layout shift
from a blocked stylesheet:

| Reference cut | Substitute | Used for |
|---|---|---|
| Control | Inter | Body, nav, buttons, links |
| Control TNT | Inter | Upright headlines |
| Control Compressed | Anton | The poster-scale statement |
| Control Cursive | Caveat | The handwritten accent word |

If you license the real Control family, drop the `.woff2` files into
`public/fonts`, update the `src` paths and family names in
[`src/app/fonts.css`](src/app/fonts.css), and point the four `--font-control-*`
tokens at them. Nothing else in the codebase refers to a font file.

## Imagery

The reference carries its emotion through full-bleed cloud photography and
sculptural glass forms. Rather than ship stock photos, [`src/components/Artwork.tsx`](src/components/Artwork.tsx)
generates that imagery as self-contained SVG — turbulence-based cloud fields,
a refractive glass sculpture, hazy ridgelines, an orbital form. No binary
assets, no network requests, and every parameter is a number you can edit.

Gradients and blurs appear only inside these compositions, standing in for
photography. The UI chrome around them stays flat, as the style guide requires.

Swap in real photography any time via the `image` field on a work item.

## Project structure

```
src/
  app/
    globals.css      Design tokens (@theme) + component layer
    fonts.css        Self-hosted @font-face declarations
    layout.tsx       Metadata, font preloads
    page.tsx         Section composition — reorder or delete sections here
  content/
    site.ts          ← all editable content
  components/        One file per section, plus Artwork.tsx and SectionHeader.tsx
public/fonts/        Inter, Anton, Caveat (latin + latin-ext subsets)
```

## Deploying

Static and portable — any Node host or static platform works. On Vercel, import
the repo and accept the defaults. Set `identity.url` in `site.ts` to your real
domain first so Open Graph metadata resolves.

## A note on `npm audit`

`npm audit` reports 3 high-severity advisories in `postcss` and `sharp`. Both
are transitive dependencies that Next pins; there is no non-breaking upgrade for
them, and neither is reachable at runtime for a static site — they are build and
image-optimization tooling. They will clear when Next ships a release that bumps
them. The Next.js advisory that *did* matter (CVE-2025-66478) is patched: this
project is on 15.5.23.
