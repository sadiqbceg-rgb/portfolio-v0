/* ============================================================================
 * SITE CONTENT
 * ============================================================================
 * Portfolio content for Gautham N Holla
 * ==========================================================================*/

import type { ArtVariant } from '@/components/Artwork';

/* ---------------------------------------------------------------------------
 * IDENTITY
 * -------------------------------------------------------------------------*/

export const identity = {
  name: 'Gautham N Holla',
  wordmark: 'GNH',
  role: 'ML Engineer | Product Manager | Developer',
  location: 'Riyadh, Saudi Arabia',
  email: 'gauthamnholla@gmail.com',

  /** Your GitHub profile. Not where this site is hosted — that is `siteUrl`. */
  url: 'https://github.com/gauthamnholla',

  /**
   * The public origin this site is served from, e.g. 'https://gauthamnholla.com'.
   * No trailing slash.
   *
   * This is what social previews are resolved against. It used to fall back to
   * `url` above, which made og:image point at
   * github.com/gauthamnholla/opengraph-image.png — a 404, so every shared link
   * previewed with no image.
   *
   * Leave it empty and the deploy platform is asked instead: Vercel sets
   * VERCEL_URL on every deployment, and NEXT_PUBLIC_SITE_URL overrides
   * everything if you set it yourself. Filling this in is still the clearest
   * option once you have a domain.
   */
  siteUrl: '',

  /**
   * Availability line for the hero. Rendered with a pulsing indicator dot;
   * omitted entirely when empty, so clear this the moment it stops being true.
   *
   * This is not a new claim — `contact.subtitle` already says you are open to
   * freelance work and full-time positions. It only says it at the very bottom
   * of the page, which is a long way to scroll for the one fact a recruiter
   * opens a portfolio to find.
   */
  availability: 'Available for freelance and full-time work',
};

/* ---------------------------------------------------------------------------
 * NAVIGATION
 * -------------------------------------------------------------------------*/

export const nav = {
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'About', href: '#about' },
  ],

  actions: [
    {
      label: 'Résumé',
      href: '/resume.pdf',
      external: true,
    },
    {
      label: 'Get in touch',
      href: '#contact',
      external: false,
    },
  ],
};

/* ---------------------------------------------------------------------------
 * HERO
 * -------------------------------------------------------------------------*/

export const hero = {
  /**
   * Backdrop:
   *   '3d'      — scroll-driven Three.js wireframe (loads Three only if chosen)
   *   'stars'   — interactive parallax star field
   *   'contour' | 'flow' | 'lattice' | 'orbit' — generated canvas compositions
   */
  background: '3d' as '3d' | 'stars' | ArtVariant,

  eyebrow: 'ML Engineer · Product Manager · Developer',

  headline: [
    {
      text: 'I build intelligent products',
      accent: false,
    },
    {
      text: 'that solve real problems.',
      accent: true,
    },
  ],

  subhead:
    'I build intelligent systems and user-centric products that solve real-world problems using machine learning, technology, and product thinking.',

  actions: [
    {
      label: 'See selected work',
      href: '#work',
    },
    {
      label: 'Get in touch',
      href: '#contact',
    },
  ],

  /** Right-hand rail of the hero. Short, factual lines. */
  meta: [
    { label: 'Role', value: 'ML Engineer · Product Manager' },
    { label: 'Based in', value: 'Riyadh, Saudi Arabia' },
    { label: 'Focus', value: 'Machine learning, product thinking' },
  ],
};

/* ---------------------------------------------------------------------------
 * INTRO — the light panel that rises over the hero.
 *
 * Two movements: what gets built, then how it gets built. The panel is the
 * first thing a visitor reads after the hero, so it stays to two short blocks.
 *
 * `steps` are rendered joined by arrows, so the line reads
 * "Research → Prototype → Build → Test → Ship". Keeping them as separate
 * strings rather than one baked sentence is what lets each stage reveal in
 * sequence as the section scrolls past.
 * -------------------------------------------------------------------------*/

export const intro = {
  build: {
    eyebrow: 'What I build',
    statement: 'I turn complex ideas into simple, useful digital products.',
  },

  process: {
    eyebrow: 'How I work',
    steps: ['Research', 'Prototype', 'Build', 'Test', 'Ship'],
  },
};

/* ---------------------------------------------------------------------------
 * LOGO BAR — consumed by the Intro panel.
 * -------------------------------------------------------------------------*/

export const logoBar = {
  caption: 'Worked with',

  logos: ['Cognimuse', 'Digichakra 360', 'Nextleap'],
};

/* ---------------------------------------------------------------------------
 * SELECTED WORK
 * -------------------------------------------------------------------------*/

export type WorkItem = {
  title: string;
  summary: string;
  /** Filter category. Drives the pill filters — reuse existing values. */
  tag: string;
  /** Your role. Optional: omitted rather than invented where unknown. */
  role?: string;
  /** Tools/methods. Optional for the same reason as `role`. */
  stack?: string[];
  art: ArtVariant;
  /**
   * Optional path under /public — see the note above `workItems`. When absent,
   * the generative `Artwork` canvas renders instead, keyed to `art`.
   */
  image?: string;
  links: {
    label: string;
    href: string;
  }[];
};

/**
 * HOW TO ATTACH AN IMAGE TO A PROJECT
 *
 * Put the file in `public/work/`, then set `image` on that item to the path
 * WITHOUT the `public` prefix:
 *
 *     public/work/it-solutions.jpg   ->   image: '/work/it-solutions.jpg'
 *
 * `public` is the web root, so it never appears in the URL. That is the whole
 * rule, and getting it wrong is the usual reason an image "does not show".
 *
 * These files arrived as `public/Work/It solutions.jpg` and were renamed on
 * the way in, for two reasons worth remembering before adding more:
 *
 *   - The directory was `Work`, the code asks for `/work/`. Windows and macOS
 *     ignore that difference; Linux, which is what nearly every host runs,
 *     does not. It works locally and 404s in production.
 *   - The filename had a space and a capital, so the URL needed
 *     `/work/It%20solutions.jpg`. Encoded spaces survive a dev server but not
 *     reliably every CDN.
 *
 * So: lowercase, hyphens, no spaces, and match the extension exactly — a
 * `.jpg` file referenced as `.jpeg` is still a 404.
 *
 * Leave `image` off and the generative `Artwork` canvas renders instead, keyed
 * to `art`. If a file is named here but missing at runtime, the card falls
 * back to that same canvas rather than showing a broken image — check the
 * browser console, where the failure is logged with the path it tried.
 */
const workItems: WorkItem[] = [
  {
    title: 'Building Complete IT Systems',
    summary:
      'Planning, configuring, and supporting complete IT environments — from network infrastructure and security systems to storage, connectivity, and workplace technology.',
    tag: 'Complete IT Solutions',
    stack: [
      'Networking',
      'CCTV',
      'Firewall',
      'NAS',
      'Access Control',
      'IT Support',
    ],
    art: 'lattice',
    image: '/work/it-solutions.jpg',
    links: [
      { label: 'Project Details', href: '#' },
      { label: 'View Solutions', href: '#' },
    ],
  },

  {
    title: 'Sketch to Image Conversion',
    summary:
      'An AI-powered tool that converts hand-drawn sketches into realistic images using deep learning techniques and generative adversarial networks.',
    tag: 'Machine Learning',
    role: 'ML Engineer',
    stack: ['Python', 'TensorFlow', 'GANs', 'Computer Vision'],
    art: 'flow',
    image: '/work/sketch-to-image.jpg',
    links: [
      { label: 'Live site', href: 'https://sketch-to-image-demo.vercel.app' },
      {
        label: 'Source',
        href: 'https://github.com/gauthamnholla/Sketch-to-Image-via-Neural-Network-',
      },
    ],
  },

  {
    title: 'Face Recognition using ML',
    summary:
      'A machine learning application that detects and recognizes faces in images and video streams with high accuracy using convolutional neural networks.',
    tag: 'Machine Learning',
    role: 'ML Engineer',
    stack: ['Python', 'OpenCV', 'TensorFlow', 'Machine Learning'],
    art: 'lattice',
    image: '/work/face-recognition.jpg',
    links: [
      { label: 'Live site', href: 'https://face-recognition-demo.vercel.app' },
      {
        label: 'Source',
        href: 'https://github.com/gauthamnholla/Face_recogniation',
      },
    ],
  },

  {
    title: 'AI Travel Planning Assistant',
    summary:
      'Comprehensive wireframes for a travel planning assistant focusing on intuitive user experience and clean layout, with emphasis on user flows, information architecture, and accessibility.',
    tag: 'Wireframes',
    role: 'Product Designer',
    stack: ['Wireframing', 'UX Design', 'Information Architecture'],
    art: 'contour',
    image: '/work/travel-assistant.jpg',
    links: [
      {
        label: 'Project document',
        href: 'https://assets.nextleap.app/submissions/ProductTeardown-BuildingWireframe-859a5510-940a-42f5-8028-2e1cab29a8ec.pdf',
      },
    ],
  },

  {
    title: 'Smart Queue System for High-Demand Event Booking',
    summary:
      'Designed and implemented an intelligent queueing system for high-traffic ticket sales that reduced booking drop-offs by 35%, improved user satisfaction and trust through identity verification, and addressed fairness with anti-bot protections.',
    tag: 'Case Study',
    role: 'Product Manager',
    stack: [
      'Product Management',
      'System Design',
      'User Retention',
      'Anti-Bot Security',
      'High-Traffic Optimization',
    ],
    art: 'orbit',
    image: '/work/smart-queue.jpg',
    links: [
      {
        label: 'Case study',
        href: 'https://assets.nextleap.app/submissions/NLBookMyShow-4749a972-3cdd-45b4-b98a-a5ed74579865.pdf',
      },
    ],
  },

  {
    title: 'Indian Space Economy: Market Analysis & Opportunities',
    summary:
      "An analysis of India's emerging space economy, uncovering key trends, rising startups, investment opportunities, and a product proposal focused on satellite-powered disaster management solutions.",
    tag: 'Market Research',
    role: 'Product Strategist',
    stack: [
      'Market Research',
      'Satellite Applications',
      'Product Strategy',
      'Space Tech',
      'Disaster Management',
    ],
    art: 'contour',
    image: '/work/space-economy.jpg',
    links: [
      {
        label: 'Research',
        href: 'https://assets.nextleap.app/submissions/IndianSpaceEconomy-41e90cda-c434-432c-95f4-11e2b2784910.pdf',
      },
    ],
  },

  {
    title: "Rapido's Referral Engine: A Growth Ride",
    summary:
      "A teardown of Rapido's 'Refer a Friend' feature, exploring how incentives, seamless sharing, and contextual prompts can drive user acquisition, along with recommendations for improving reward structure and conversion.",
    tag: 'Product Teardown',
    role: 'Product Analyst',
    stack: [
      'Product Teardown',
      'Referral Program',
      'Growth Strategy',
      'User Acquisition',
      'Incentive Design',
    ],
    art: 'lattice',
    image: '/work/rapido-referral.webp',
    links: [
      {
        label: 'Case study',
        href: 'https://assets.nextleap.app/submissions/Rapido-503e3311-4cbe-44da-a94e-7508d1536296.pdf',
      },
    ],
  },

  {
    title: 'Breaking Down Notifications on Discord',
    summary:
      'A focused teardown of how Discord uses push and in-app notifications to keep users engaged, from server alerts to personalized mentions.',
    tag: 'Product Teardown',
    role: 'Product Manager',
    art: 'orbit',
    image: '/work/discord-notifications.jpg',
    links: [
      {
        label: 'Teardown',
        href: 'https://assets.nextleap.app/submissions/Discord-87bc25ca-31da-439e-a0e9-619912f59a27.pdf',
      },
    ],
  },

  {
    title: 'Analyzing UX for Google Pay Using Heuristics',
    summary:
      "A detailed teardown of Google Pay's user experience using Nielsen's usability heuristics to identify strengths and areas for improvement.",
    tag: 'Product Teardown',
    role: 'Product Manager',
    art: 'flow',
    image: '/work/gpay-heuristic.webp',
    links: [
      {
        label: 'Teardown',
        href: 'https://assets.nextleap.app/submissions/AnalyzingUserExperienceforGooglePay-ecd6707f-6c02-40e3-b22f-486c1bb8519c.pdf',
      },
    ],
  },
];

export const work = {
  /**
   * Filter pills are derived from the `tag` values above — adding an item with
   * a new tag creates its chip automatically, with no second list to maintain.
   *
   * There is no date field. The source data had none, and the sequence is
   * numbered instead, which carries the same "there is a body of work here"
   * signal without asserting a timeline.
   */
  eyebrow: 'Selected work',

  title: 'Things I have built and explored',

  subtitle:
    'A collection of IT solutions, digital projects, website content, technical explorations, and product-focused work.',

  items: workItems,
};

/* ---------------------------------------------------------------------------
 * DISPLAY STATEMENT
 * -------------------------------------------------------------------------*/

export const statement = {
  lines: ['Build', 'with purpose.'],

  note: 'Combining technology, product thinking, and curiosity to solve meaningful problems.',
};

/* ---------------------------------------------------------------------------
 * EXPERIENCE
 * -------------------------------------------------------------------------*/

export type Job = {
  company: string;
  role: string;
  /** Where the work happened. Omitted rather than guessed on older roles. */
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
};

export const experience = {
  eyebrow: 'Experience',

  title: 'Where I have worked',

  items: [
    {
      company: 'Freelance / Contract',

      role: 'Contract IT Technician',

      location: 'Mumbai, India',

      period: 'Jun 2025 – Jan 2026',

      summary:
        'Provided hands-on IT support across multiple client environments, including PC setup, troubleshooting, network configuration, and on-site technical support.',

      highlights: [
        'Assembled and configured PC workstations for office environments.',
        'Provided on-site technical support during corporate events and client engagements.',
        'Assisted with network configuration and infrastructure setup for large office spaces.',
        'Troubleshot hardware and software issues to ensure smooth system operation.',
        'Delivered field-based IT support across multiple contract assignments.',
      ],
    },

    {
      company: 'Digichakra 360',

      role: 'Web Developer',

      period: 'Jan 2025 – Mar 2025',

      summary:
        'Built responsive websites using Wix, WordPress, and React while working with designers to create clean and user-friendly interfaces across devices.',

      highlights: [
        'Built responsive websites using React, Wix, and WordPress.',
        'Worked closely with designers to create clean and user-friendly interfaces.',
        'Focused on responsive design and cross-device usability.',
      ],
    },

    {
      company: 'Cognimuse',

      role: 'Product Management Intern',

      period: 'March 2024 – July 2024',

      summary:
        'Assisted in product planning, feature definition, and cross-functional team coordination.',

      highlights: [
        'Contributed to product planning and feature definition.',
        'Supported user research and product strategy activities.',
        'Worked with teams on roadmapping and Agile processes.',
      ],
    },

    {
      company: 'Cognimuse',

      role: 'Machine Learning Intern',

      period: 'Jan 2024 – Feb 2024',

      summary:
        'Worked on developing and optimizing machine learning models for multimedia data analysis.',

      highlights: [
        'Developed and optimized machine learning models.',
        'Worked with Python and TensorFlow.',
        'Applied data analysis and computer vision techniques to multimedia data.',
      ],
    },
  ] satisfies Job[],
};

/* ---------------------------------------------------------------------------
 * SKILLS
 * -------------------------------------------------------------------------*/

export const skills = {
  eyebrow: 'Capabilities',

  title: 'What I work with',

  groups: [
    {
      name: 'Machine Learning',

      items: [
        'Python',
        'Machine Learning',
        'TensorFlow',
        'Computer Vision',
        'GANs',
      ],
    },

    {
      name: 'Development',

      items: [
        'React',
        'JavaScript',
        'HTML',
        'CSS',
        'Tailwind CSS',
        'Wix',
        'WordPress',
      ],
    },

    {
      name: 'Product & Design',

      items: [
        'Product Management',
        'Product Strategy',
        'UI/UX Design',
        'Wireframing',
        'User Research',
        'PRDs',
        'Data Analysis',
      ],
    },

    {
      name: 'IT Infrastructure & Solutions',

      items: [
        'CCTV',
        'Networking',
        'Firewall',
        'NAS',
        'Servers',
        'IP PBX',
        'Access Control',
        'IT Support',
      ],
    },

    {
      name: 'AI & Technology',

      items: [
        'AI Tools',
        'Automation',
        'Generative AI',
        'AI-Assisted Development',
        'Computer Vision',
        'Machine Learning',
      ],
    },

    {
      name: 'Digital Content',

      items: [
        'Website Content',
        'Technical Writing',
        'Company Profiles',
        'Service Pages',
        'Project Documentation',
        'Digital Content',
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * ABOUT
 * -------------------------------------------------------------------------*/

export const about = {
  eyebrow: 'About',

  title: 'A little more context',

  /**
   * `**double asterisks**` mark emphasis and render as <strong>. Everything
   * else is literal text — this is not full Markdown, deliberately. One
   * inline rule is enough for body copy, and a real parser would be a
   * dependency plus an HTML-injection surface for no gain.
   */
  paragraphs: [
    'I have completed my engineering in Computer Science and have built experience across **IT infrastructure, web development, AI technologies, digital content, and product-focused technology solutions**.',

    'Based in **Riyadh, Saudi Arabia**, I work across both technical and creative areas — from configuring **CCTV and network infrastructure** to developing websites, exploring AI tools, and creating digital and technical content.',

    'Over time, I have developed a strong interest in **AI, machine learning, automation, and modern web technologies**. I enjoy understanding how technology works and finding practical ways to use it to build smarter, more efficient solutions.',

    'With a background in Computer Science, I like working across the gap between **technical implementation and product thinking**. My experience includes **IT infrastructure, networking, CCTV systems, web development, UI/UX, product thinking, AI-assisted development, and digital content creation**.',

    'Outside of technology, I enjoy **playing games, hiking, exploring new places, and shooting and editing videos** as a creative outlet.',
  ],

  portraitAlt: 'Portrait of Gautham N Holla',

  portrait: '/portrait.webp',
};

/* ---------------------------------------------------------------------------
 * CONTACT
 * -------------------------------------------------------------------------*/

export const contact = {
  eyebrow: 'Contact',

  title: 'Let us build something',

  subtitle:
    'I am currently available for freelance work and full-time positions. If you have a project, opportunity, or simply want to connect, feel free to get in touch.',

  formEndpoint: '',

  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/gauthamnholla',
    },

    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/gauthamnholla/',
    },

    {
      label: 'X',
      href: 'https://x.com/GauthamHolla',
    },

    {
      label: 'Instagram',
      href: 'https://www.instagram.com/eagleheart_14/',
    },
  ],
};

/* ---------------------------------------------------------------------------
 * FOOTER
 * -------------------------------------------------------------------------*/

export const footer = {
  eyebrow: "Let's connect",

  /** Set as two lines so each can be uncovered separately. */
  statement: ['Have an idea', 'worth building?'],

  ctaLabel: "Let's talk",

  note: 'ML Engineer | Product Manager | Developer',

  name: 'Gautham N Holla',

  copyright: '© Gautham N Holla. All rights reserved.',
};
