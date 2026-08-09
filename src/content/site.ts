/* ============================================================================
 * SITE CONTENT — edit everything here.
 *
 * This file is the only place you need to touch to make the site yours.
 * Every string, link, project and job below is rendered by the components in
 * src/components. Nothing is hard-coded in the markup.
 *
 * Placeholders are marked with [] so you can find what's left:
 *   grep -rn "\[" src/content/site.ts
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * IDENTITY
 * -------------------------------------------------------------------------*/
export const identity = {
  /** Shown in the nav wordmark and the <title>. */
  name: '[Your Name]',
  /** Short wordmark for the nav — initials or a compact form of your name. */
  wordmark: '[YN]',
  /** One-line role, used in metadata and the footer. */
  role: '[Software Engineer]',
  location: '[City, Country]',
  email: '[you@example.com]',
  /** Used for canonical URLs and Open Graph. No trailing slash. */
  url: 'https://example.com',
};

/* ---------------------------------------------------------------------------
 * NAVIGATION
 * `href` values starting with # scroll to the section with that id.
 * -------------------------------------------------------------------------*/
export const nav = {
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
  ],
  /** Right-aligned ghost buttons. Keep to two — the reference uses two. */
  actions: [
    { label: 'Résumé', href: '/resume.pdf', external: true },
    { label: 'Get in touch', href: '#contact', external: false },
  ],
};

/* ---------------------------------------------------------------------------
 * HERO — the full-bleed atmospheric opener.
 *
 * The headline is split into parts so one word can carry the cursive italic
 * accent, exactly as the reference does with "AI". Set `accent: true` on the
 * single word you want italicised — one word, not more.
 * -------------------------------------------------------------------------*/
export const hero = {
  /**
   * Hero backdrop:
   *   'stars'   — Animate UI's parallax star field, drifting and tracking the
   *               cursor. Interactive and alive.
   *   'artwork' — the generated SVG cloud composition. Closer to the style
   *               reference, which uses full-bleed cloud photography.
   * Both are self-contained; swap the word and the hero changes.
   */
  background: 'stars' as 'stars' | 'artwork',
  eyebrow: '[Software Engineer · Available for work]',
  headline: [
    { text: 'I build software that feels', accent: false },
    { text: 'effortless', accent: true },
    { text: 'to use.', accent: false },
  ],
  subhead:
    '[One or two sentences on what you do and who you do it for. Keep it concrete — the systems you build, the problems you solve, the scale you work at.]',
  actions: [
    { label: 'See selected work', href: '#work' },
    { label: 'Get in touch', href: '#contact' },
  ],
};

/* ---------------------------------------------------------------------------
 * LOGO BAR — monochrome wordmarks on the dark canvas.
 * Text wordmarks keep the site dependency-free. Swap in <img> or SVG later.
 * -------------------------------------------------------------------------*/
export const logoBar = {
  caption: '[Trusted by teams at]',
  logos: [
    '[Company One]',
    '[Company Two]',
    '[Company Three]',
    '[Company Four]',
    '[Company Five]',
  ],
};

/* ---------------------------------------------------------------------------
 * SELECTED WORK — the flagship case studies, rendered as large Haze cards.
 *
 * `art` picks the generated background used in the card's image area:
 *   'clouds' | 'glass' | 'ridge' | 'orbit'
 * These are self-contained SVG compositions (src/components/Artwork.tsx).
 * To use a real screenshot instead, set `image: '/work/thing.png'` and drop
 * the file in /public/work/ — the card renders the image and ignores `art`.
 * -------------------------------------------------------------------------*/
export type WorkItem = {
  title: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  art: 'clouds' | 'glass' | 'ridge' | 'orbit';
  image?: string;
  links: { label: string; href: string }[];
};

const workItems: WorkItem[] = [
    {
      title: '[Project One]',
      summary:
        '[What it does and why it mattered. Lead with the outcome — the metric that moved, the thing that became possible — then the interesting technical constraint you worked against.]',
      role: '[Lead Engineer]',
      year: '[2025]',
      stack: ['[TypeScript]', '[Next.js]', '[Postgres]'],
      art: 'clouds',
      links: [
        { label: 'Live site', href: '#' },
        { label: 'Source', href: '#' },
      ],
    },
    {
      title: '[Project Two]',
      summary:
        '[What it does and why it mattered. Two or three sentences is plenty — the card is a hook, not the case study.]',
      role: '[Full-stack Engineer]',
      year: '[2024]',
      stack: ['[Go]', '[React]', '[Redis]'],
      art: 'glass',
      links: [
        { label: 'Live site', href: '#' },
        { label: 'Source', href: '#' },
      ],
    },
    {
      title: '[Project Three]',
      summary:
        '[What it does and why it mattered. If there is a number worth quoting — latency, throughput, users, revenue — put it in the first sentence.]',
      role: '[Backend Engineer]',
      year: '[2024]',
      stack: ['[Python]', '[FastAPI]', '[AWS]'],
      art: 'ridge',
      links: [{ label: 'Read the write-up', href: '#' }],
    },
    {
      title: '[Project Four]',
      summary:
        '[What it does and why it mattered. Name the hard part — that is what a reader remembers.]',
      role: '[Creator]',
      year: '[2023]',
      stack: ['[Rust]', '[WebAssembly]'],
      art: 'orbit',
      links: [{ label: 'Source', href: '#' }],
    },
];

export const work = {
  eyebrow: 'Selected work',
  title: 'Things I have shipped',
  subtitle:
    '[A line framing how you pick what to work on, or what these projects have in common.]',
  items: workItems,
};

/* ---------------------------------------------------------------------------
 * STATS — the numbers count up when they scroll into view.
 *
 * `value` must be a number, not a string, for the counter to animate. Put any
 * unit in `suffix` (e.g. '+', '%', 'M'). Keep this to three or four entries —
 * a long row of numbers stops feeling like evidence and starts feeling like
 * filler. Delete the section from src/app/page.tsx if you would rather not
 * make claims in numbers.
 * -------------------------------------------------------------------------*/
export type Stat = {
  value: number;
  suffix: string;
  label: string;
  decimalPlaces?: number;
};

export const stats = {
  items: [
    { value: 6, suffix: '+', label: '[Years shipping software]' },
    { value: 40, suffix: '+', label: '[Projects delivered]' },
    { value: 2, suffix: 'M', label: '[Users reached]' },
    { value: 99.9, suffix: '%', label: '[Uptime maintained]', decimalPlaces: 1 },
  ] satisfies Stat[],
};

/* ---------------------------------------------------------------------------
 * DISPLAY STATEMENT — the poster-scale moment. Bleeds to the viewport edges.
 * Two or three short words. It is set at up to 259px, so anything longer
 * stops reading as a poster and starts reading as a paragraph.
 * -------------------------------------------------------------------------*/
export const statement = {
  lines: ['Ship it', 'well.'],
  /** Optional footnote under the display type. Set to '' to hide. */
  note: '[A short line that earns the shout — your working principle in a sentence.]',
};

/* ---------------------------------------------------------------------------
 * PROJECTS — the smaller grid, filterable by the pill toggles.
 *
 * Filters are derived automatically from every `tag` used below, so adding a
 * project with a new tag adds the filter chip for free. No list to maintain.
 * -------------------------------------------------------------------------*/
export type Project = {
  name: string;
  description: string;
  tag: string;
  year: string;
  href: string;
};

export const projects = {
  eyebrow: 'Projects',
  title: 'Side quests and open source',
  subtitle:
    '[What you build when nobody is paying you to. Filter by category below.]',
  items: [
    {
      name: '[Project Name]',
      description: '[One sentence. What it is, who it is for.]',
      tag: 'Open source',
      year: '[2025]',
      href: '#',
    },
    {
      name: '[Project Name]',
      description: '[One sentence. What it is, who it is for.]',
      tag: 'Open source',
      year: '[2025]',
      href: '#',
    },
    {
      name: '[Project Name]',
      description: '[One sentence. What it is, who it is for.]',
      tag: 'Tools',
      year: '[2024]',
      href: '#',
    },
    {
      name: '[Project Name]',
      description: '[One sentence. What it is, who it is for.]',
      tag: 'Tools',
      year: '[2024]',
      href: '#',
    },
    {
      name: '[Project Name]',
      description: '[One sentence. What it is, who it is for.]',
      tag: 'Writing',
      year: '[2023]',
      href: '#',
    },
    {
      name: '[Project Name]',
      description: '[One sentence. What it is, who it is for.]',
      tag: 'Experiments',
      year: '[2023]',
      href: '#',
    },
  ] satisfies Project[],
};

/* ---------------------------------------------------------------------------
 * EXPERIENCE — reverse-chronological. Newest first.
 * -------------------------------------------------------------------------*/
export type Job = {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
};

export const experience = {
  eyebrow: 'Experience',
  title: 'Where I have worked',
  items: [
    {
      company: '[Company Name]',
      role: '[Senior Software Engineer]',
      period: '[2023 — Present]',
      summary:
        '[One sentence on the team, the product, and the scope you own.]',
      highlights: [
        '[An achievement with a number attached. What changed, by how much.]',
        '[A system you designed or rebuilt, and the constraint that shaped it.]',
        '[Something you did for the team — mentoring, process, hiring.]',
      ],
    },
    {
      company: '[Company Name]',
      role: '[Software Engineer]',
      period: '[2021 — 2023]',
      summary:
        '[One sentence on the team, the product, and the scope you owned.]',
      highlights: [
        '[An achievement with a number attached.]',
        '[A system you designed or rebuilt.]',
      ],
    },
    {
      company: '[Company Name]',
      role: '[Junior Software Engineer]',
      period: '[2020 — 2021]',
      summary: '[One sentence on the team and what you learned there.]',
      highlights: ['[The thing you shipped that you would still defend today.]'],
    },
  ] satisfies Job[],
};

/* ---------------------------------------------------------------------------
 * SKILLS — three columns on desktop.
 * -------------------------------------------------------------------------*/
export const skills = {
  eyebrow: 'Capabilities',
  title: 'What I work with',
  groups: [
    {
      name: 'Languages',
      items: ['[TypeScript]', '[Python]', '[Go]', '[SQL]', '[Rust]'],
    },
    {
      name: 'Frameworks',
      items: ['[React]', '[Next.js]', '[Node.js]', '[FastAPI]', '[Tailwind]'],
    },
    {
      name: 'Infrastructure',
      items: ['[AWS]', '[Docker]', '[Postgres]', '[Terraform]', '[CI/CD]'],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * ABOUT — the long-form paragraph. Set to 400 weight per the style guide.
 * -------------------------------------------------------------------------*/
export const about = {
  eyebrow: 'About',
  title: 'A little more context',
  /** Each string becomes its own paragraph. */
  paragraphs: [
    '[Who you are and how you got here. Two or three sentences — where you started, what pulled you toward engineering, what you are chasing now.]',
    '[What you care about in the craft. Testing, performance, accessibility, developer experience — whatever you would actually argue about.]',
    '[What you do when you are not at a keyboard. One sentence. It makes you a person rather than a résumé.]',
  ],
  portraitAlt: '[Portrait of you]',
  /** Drop a photo at /public/portrait.jpg and set this to '/portrait.jpg'. */
  portrait: '',
};

/* ---------------------------------------------------------------------------
 * CONTACT
 *
 * The form posts to `formEndpoint`. It ships unset, which renders the form in
 * a disabled state with a note — so nothing silently swallows a message.
 * Point it at a Formspree / Basin / Web3Forms endpoint (or your own API
 * route) and the form goes live with no other changes.
 * -------------------------------------------------------------------------*/
export const contact = {
  eyebrow: 'Contact',
  title: 'Let us build something',
  subtitle:
    '[Say what you are open to — full-time roles, contract work, advising — and how fast you reply.]',
  formEndpoint: '',
  /** Shown alongside the form. */
  socials: [
    { label: 'GitHub', href: 'https://github.com/[username]' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/[username]' },
    { label: 'X', href: 'https://x.com/[username]' },
  ],
};

/* ---------------------------------------------------------------------------
 * FOOTER
 * -------------------------------------------------------------------------*/
export const footer = {
  note: '[Built from scratch. Designed to stay out of the way.]',
};
