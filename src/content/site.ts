/* ============================================================================
 * SITE CONTENT — edit everything here.
 *
 * ⚠ THIS IS SAMPLE DATA, NOT YOUR RÉSUMÉ.
 *
 * Every name, company, project, metric and date below is invented, so the
 * design can be judged with realistic copy in place instead of [placeholders].
 * Replace it with your own before the site goes anywhere public — none of it
 * is true of you, and some of it (the metrics especially) reads as a claim.
 *
 * Nothing is hard-coded in the markup; this file is the whole content layer.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * IDENTITY
 * -------------------------------------------------------------------------*/
export const identity = {
  name: 'Sadiq Iqbal',
  /** Compact wordmark for the nav. */
  wordmark: 'SI',
  role: 'Backend & Platform Engineer',
  location: 'Bengaluru, India',
  email: 'hello@example.com',
  /** Canonical URL for metadata. No trailing slash. */
  url: 'https://example.com',
  /** Shown in the hero meta rail. */
  availability: 'Open to senior backend roles — from March',
};

/* ---------------------------------------------------------------------------
 * NAVIGATION
 * -------------------------------------------------------------------------*/
export const nav = {
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'About', href: '#about' },
  ],
  actions: [
    { label: 'Résumé', href: '/resume.pdf', external: true },
    { label: 'Get in touch', href: '#contact', external: false },
  ],
};

/* ---------------------------------------------------------------------------
 * HERO
 *
 * The headline is split into parts so one word can carry the handwritten cut,
 * the way the style reference italicises a single word. Set `accent: true` on
 * exactly one — a second one kills the effect.
 * -------------------------------------------------------------------------*/
export const hero = {
  /**
   * Backdrop:
   *   'stars'   — Animate UI's parallax star field, tracks the cursor.
   *   'artwork' — generated SVG cloud composition, closer to the reference.
   */
  background: 'stars' as 'stars' | 'artwork',
  headline: [
    { text: 'I build the systems', accent: false },
    { text: 'other', accent: true },
    { text: 'engineers build on.', accent: false },
  ],
  subhead:
    'Nine years on backend and platform teams, mostly in payments and developer infrastructure. I like the unglamorous parts — migrations that nobody notices, build times that halve, on-call rotations that get quiet.',
  actions: [
    { label: 'Selected work', href: '#work' },
    { label: 'Get in touch', href: '#contact' },
  ],
  /** Right-hand rail of the hero. Short, factual lines. */
  meta: [
    { label: 'Currently', value: 'Staff Engineer at Fabrikam' },
    { label: 'Based in', value: 'Bengaluru, India' },
    { label: 'Focus', value: 'Distributed systems, developer platforms' },
  ],
};

/* ---------------------------------------------------------------------------
 * LOGO BAR — monochrome wordmarks.
 * -------------------------------------------------------------------------*/
export const logoBar = {
  caption: 'Previously',
  logos: ['Fabrikam', 'Northwind', 'Contoso', 'Litware', 'Adventure Works'],
};

/* ---------------------------------------------------------------------------
 * STATS — count up when scrolled into view.
 *
 * `value` must be a number for the counter to animate; units go in `suffix`.
 * These are the easiest thing on the page to overstate. Keep them defensible.
 * -------------------------------------------------------------------------*/
export type Stat = {
  value: number;
  suffix: string;
  label: string;
  decimalPlaces?: number;
};

export const stats = {
  items: [
    { value: 9, suffix: '', label: 'Years in production engineering' },
    { value: 4, suffix: '', label: 'Platform teams built or led' },
    { value: 12, suffix: 'k', label: 'Peak requests per second served' },
    { value: 99.98, suffix: '%', label: 'Availability, trailing 12 months', decimalPlaces: 2 },
  ] satisfies Stat[],
};

/* ---------------------------------------------------------------------------
 * SELECTED WORK — an indexed list, newest first.
 *
 * `art` picks the generated thumbnail: 'clouds' | 'glass' | 'ridge' | 'orbit'.
 * For a real screenshot set `image: '/work/name.png'` and drop the file in
 * public/work/ — the row then ignores `art`.
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
    title: 'Meridian',
    summary:
      'An internal developer platform that took service provisioning from a two-week ticket queue down to a nine-minute self-serve flow. The hard part was not the tooling — it was migrating 140 existing services onto it without a scheduled freeze.',
    role: 'Tech lead',
    year: '2025',
    stack: ['Go', 'Kubernetes', 'Terraform', 'Postgres'],
    art: 'clouds',
    links: [
      { label: 'Case study', href: '#' },
      { label: 'Architecture notes', href: '#' },
    ],
  },
  {
    title: 'Tessera',
    summary:
      'Rebuilt the payment reconciliation pipeline as an event-sourced ledger, cutting end-of-day close from six hours to under twenty minutes. Ran it in shadow mode against the legacy system for three months before anyone trusted it.',
    role: 'Senior engineer',
    year: '2024',
    stack: ['Kafka', 'Postgres', 'TypeScript'],
    art: 'glass',
    links: [
      { label: 'Write-up', href: '#' },
      { label: 'Source', href: '#' },
    ],
  },
  {
    title: 'Coastline',
    summary:
      'A schema-aware ingestion layer for third-party data feeds. Vendors change their formats without warning, so it validates on read and quarantines bad batches instead of failing the pipeline — bad data stopped being a 3am problem.',
    role: 'Engineer',
    year: '2023',
    stack: ['Python', 'Airflow', 'S3'],
    art: 'ridge',
    links: [{ label: 'Write-up', href: '#' }],
  },
  {
    title: 'Foundry',
    summary:
      'Incremental build caching for a monorepo that had grown to a 40-minute CI run. Content-addressed artefacts and a remote cache brought the median pull request down to just under seven minutes.',
    role: 'Engineer',
    year: '2022',
    stack: ['Rust', 'Bazel', 'gRPC'],
    art: 'orbit',
    links: [{ label: 'Source', href: '#' }],
  },
];

export const work = {
  eyebrow: 'Selected work',
  title: 'Four things worth showing',
  subtitle:
    'A longer list exists, but these are the ones where the interesting decision is easy to explain.',
  items: workItems,
};

/* ---------------------------------------------------------------------------
 * DISPLAY STATEMENT — the poster-scale moment. Two or three short words.
 * -------------------------------------------------------------------------*/
export const statement = {
  lines: ['Boring', 'on purpose.'],
  note: 'The best systems I have worked on were unremarkable to operate. That is the goal, not a consolation prize.',
};

/* ---------------------------------------------------------------------------
 * PROJECTS — the smaller grid. Filter chips derive from the tags below, so a
 * new tag adds its own chip with no second list to maintain.
 * -------------------------------------------------------------------------*/
export type Project = {
  name: string;
  description: string;
  tag: string;
  year: string;
  href: string;
};

export const projects = {
  eyebrow: 'Side work',
  title: 'Open source and experiments',
  subtitle: 'Smaller things, built mostly to answer a question I had.',
  items: [
    {
      name: 'pgshadow',
      description: 'Runs a Postgres migration against a copy of production traffic before you ship it.',
      tag: 'Open source',
      year: '2025',
      href: '#',
    },
    {
      name: 'slowlog',
      description: 'A CLI that turns Postgres slow-query logs into a ranked, deduplicated report.',
      tag: 'Open source',
      year: '2024',
      href: '#',
    },
    {
      name: 'envelope',
      description: 'Type-safe environment variable parsing for Go services, with a startup-time report.',
      tag: 'Tools',
      year: '2024',
      href: '#',
    },
    {
      name: 'drift',
      description: 'Detects when deployed infrastructure stops matching what Terraform thinks it is.',
      tag: 'Tools',
      year: '2023',
      href: '#',
    },
    {
      name: 'On queue backpressure',
      description: 'Why most retry logic makes outages worse, with the arithmetic to show it.',
      tag: 'Writing',
      year: '2023',
      href: '#',
    },
    {
      name: 'A toy Raft',
      description: 'Consensus implemented badly on purpose, to understand where the hard parts hide.',
      tag: 'Experiments',
      year: '2022',
      href: '#',
    },
  ] satisfies Project[],
};

/* ---------------------------------------------------------------------------
 * EXPERIENCE — reverse chronological.
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
      company: 'Fabrikam',
      role: 'Staff Engineer, Developer Platform',
      period: '2022 — Present',
      summary:
        'Own the tooling that roughly 200 engineers use to ship. Small team, broad surface.',
      highlights: [
        'Cut median time-to-first-deploy for a new service from 11 days to under an hour.',
        'Led the migration off a shared monolithic database to per-service ownership, with no planned downtime.',
        'Started the internal design-review process; it is now a requirement for anything touching payments.',
      ],
    },
    {
      company: 'Northwind',
      role: 'Senior Backend Engineer',
      period: '2019 — 2022',
      summary:
        'Payments infrastructure — settlement, reconciliation, and the reporting that auditors actually read.',
      highlights: [
        'Rebuilt reconciliation as an event-sourced ledger, taking end-of-day close from six hours to twenty minutes.',
        'Introduced contract testing between services, which ended a recurring class of release-day incident.',
      ],
    },
    {
      company: 'Contoso',
      role: 'Backend Engineer',
      period: '2017 — 2019',
      summary:
        'First engineering job. Order management for a logistics product, on a team of five.',
      highlights: [
        'Wrote the idempotency layer that stopped duplicate orders during carrier API timeouts — still in production.',
      ],
    },
  ] satisfies Job[],
};

/* ---------------------------------------------------------------------------
 * SKILLS
 * -------------------------------------------------------------------------*/
export const skills = {
  eyebrow: 'Toolkit',
  title: 'What I reach for',
  groups: [
    {
      name: 'Languages',
      items: ['Go', 'TypeScript', 'Python', 'Rust', 'SQL'],
    },
    {
      name: 'Infrastructure',
      items: ['Kubernetes', 'Terraform', 'AWS', 'Postgres', 'Kafka'],
    },
    {
      name: 'Practice',
      items: [
        'Distributed systems',
        'Observability',
        'Incident response',
        'Technical writing',
        'Mentoring',
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * ABOUT — long-form, set at 400 weight.
 * -------------------------------------------------------------------------*/
export const about = {
  eyebrow: 'About',
  title: 'The longer version',
  paragraphs: [
    'I started in a logistics team where a duplicate order meant a physical van going to a physical address twice. That taught me more about idempotency than any paper did, and I have been drawn to systems with expensive failure modes ever since.',
    'Most of my work now is platform engineering: the layer other engineers stand on. I care about the boring virtues — good defaults, honest error messages, migrations that can be run twice safely, and documentation written before the thing ships rather than after.',
    'Away from the keyboard I run badly, cook ambitiously, and maintain strong opinions about Postgres that nobody asked for.',
  ],
  portraitAlt: 'Portrait',
  /** Add /public/portrait.jpg and set this to '/portrait.jpg'. */
  portrait: '',
};

/* ---------------------------------------------------------------------------
 * CONTACT
 *
 * The form posts to `formEndpoint`. It ships unset, which renders the form
 * disabled with a note — nothing silently swallows a message. Point it at a
 * Formspree / Basin / Web3Forms endpoint or your own API route to go live.
 * -------------------------------------------------------------------------*/
export const contact = {
  eyebrow: 'Contact',
  title: 'Let us talk',
  subtitle:
    'Open to senior and staff backend roles, and to short advisory work on platform or payments problems. I reply within a couple of days.',
  formEndpoint: '',
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
    { label: 'Writing', href: '#' },
  ],
};

/* ---------------------------------------------------------------------------
 * FOOTER
 * -------------------------------------------------------------------------*/
export const footer = {
  note: 'Built from scratch. Designed to stay out of the way.',
};
