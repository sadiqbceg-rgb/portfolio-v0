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
  url: 'https://github.com/gauthamnholla',
};

/* ---------------------------------------------------------------------------
 * NAVIGATION
 * -------------------------------------------------------------------------*/

export const nav = {
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Projects', href: '#projects' },
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
   * Backdrop: 'stars' (interactive parallax field) or any generated canvas
   * composition — 'contour', 'flow', 'lattice', 'orbit'.
   */
  background: 'contour' as 'stars' | ArtVariant,

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
 * LOGO BAR
 * -------------------------------------------------------------------------*/

export const logoBar = {
  caption: 'Worked with',

  logos: [
    'Cognimuse',
    'Digichakra 360',
    'Nextleap',
  ],
};

/* ---------------------------------------------------------------------------
 * SELECTED WORK
 * -------------------------------------------------------------------------*/

export type WorkItem = {
  title: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  art: ArtVariant;
  image?: string;
  links: {
    label: string;
    href: string;
  }[];
};

const workItems: WorkItem[] = [
  {
    title: 'Sketch to Image Conversion',

    summary:
      'An AI-powered tool that converts hand-drawn sketches into realistic images using deep learning techniques and generative adversarial networks.',

    role: 'ML Engineer',

    year: 'Date not specified',

    stack: [
      'Python',
      'TensorFlow',
      'GANs',
      'Computer Vision',
    ],

    art: 'contour',

    links: [
      {
        label: 'Live site',
        href: 'https://sketch-to-image-demo.vercel.app',
      },
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

    role: 'ML Engineer',

    year: 'Date not specified',

    stack: [
      'Python',
      'OpenCV',
      'TensorFlow',
      'Machine Learning',
    ],

    art: 'lattice',

    links: [
      {
        label: 'Live site',
        href: 'https://face-recognition-demo.vercel.app',
      },
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

    role: 'Product Designer',

    year: 'Date not specified',

    stack: [
      'Wireframing',
      'UX Design',
      'Information Architecture',
    ],

    art: 'flow',

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

    role: 'Product Manager',

    year: 'Date not specified',

    stack: [
      'Product Management',
      'System Design',
      'User Retention',
      'Anti-Bot Security',
      'High-Traffic Optimization',
    ],

    art: 'orbit',

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

    role: 'Product Strategist',

    year: 'Date not specified',

    stack: [
      'Market Research',
      'Satellite Applications',
      'Product Strategy',
      'Space Tech',
      'Disaster Management',
    ],

    art: 'contour',

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

    role: 'Product Analyst',

    year: 'Date not specified',

    stack: [
      'Product Teardown',
      'Referral Program',
      'Growth Strategy',
      'User Acquisition',
      'Incentive Design',
    ],

    art: 'lattice',

    links: [
      {
        label: 'Case study',
        href: 'https://assets.nextleap.app/submissions/Rapido-503e3311-4cbe-44da-a94e-7508d1536296.pdf',
      },
    ],
  },
];

export const work = {
  eyebrow: 'Selected work',

  title: 'Things I have built and explored',

  subtitle:
    'A collection of machine learning projects, product case studies, UX explorations, and market research.',

  items: workItems,
};

/* ---------------------------------------------------------------------------
 * DISPLAY STATEMENT
 * -------------------------------------------------------------------------*/

export const statement = {
  lines: [
    'Build',
    'with purpose.',
  ],

  note:
    'Combining technology, product thinking, and curiosity to solve meaningful problems.',
};

/* ---------------------------------------------------------------------------
 * PROJECTS
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

  title: 'More things I have explored',

  subtitle:
    'Product teardowns, UX research, market analysis, and technology experiments.',

  items: [
    {
      name: 'Breaking Down Notifications on Discord',

      description:
        'A focused teardown of how Discord uses push and in-app notifications to keep users engaged, from server alerts to personalized mentions.',

      tag: 'Product Teardown',

      year: 'Date not specified',

      href:
        'https://assets.nextleap.app/submissions/Discord-87bc25ca-31da-439e-a0e9-619912f59a27.pdf',
    },

    {
      name: 'Analyzing UX for Google Pay Using Heuristics',

      description:
        "A detailed teardown of Google Pay's user experience using Nielsen's usability heuristics to identify strengths and areas for improvement.",

      tag: 'Product Teardown',

      year: 'Date not specified',

      href:
        'https://assets.nextleap.app/submissions/AnalyzingUserExperienceforGooglePay-ecd6707f-6c02-40e3-b22f-486c1bb8519c.pdf',
    },

    {
      name: 'AI Travel Planning Assistant',

      description:
        'Wireframes for a travel planning assistant focused on user flow optimization, information architecture, accessibility, and intuitive UX.',

      tag: 'Wireframes',

      year: 'Date not specified',

      href:
        'https://assets.nextleap.app/submissions/ProductTeardown-BuildingWireframe-859a5510-940a-42f5-8028-2e1cab29a8ec.pdf',
    },

    {
      name: 'Indian Space Economy',

      description:
        'Market research exploring the Indian space economy, major players, investment trends, and satellite-powered disaster management opportunities.',

      tag: 'Market Research',

      year: 'Date not specified',

      href:
        'https://assets.nextleap.app/submissions/IndianSpaceEconomy-41e90cda-c434-432c-95f4-11e2b2784910.pdf',
    },

    {
      name: "Rapido's Referral Engine",

      description:
        "A product teardown of Rapido's referral system with recommendations for incentives, contextual prompts, sharing, and user acquisition.",

      tag: 'Product Teardown',

      year: 'Date not specified',

      href:
        'https://assets.nextleap.app/submissions/Rapido-503e3311-4cbe-44da-a94e-7508d1536296.pdf',
    },

    {
      name: 'Smart Queue System',

      description:
        'A case study exploring an intelligent queueing system for high-demand event booking and methods to improve fairness, trust, and retention.',

      tag: 'Case Study',

      year: 'Date not specified',

      href:
        'https://assets.nextleap.app/submissions/NLBookMyShow-4749a972-3cdd-45b4-b98a-a5ed74579865.pdf',
    },
  ] satisfies Project[],
};

/* ---------------------------------------------------------------------------
 * EXPERIENCE
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
  ],
};

/* ---------------------------------------------------------------------------
 * ABOUT
 * -------------------------------------------------------------------------*/

export const about = {
  eyebrow: 'About',

  title: 'A little more context',

  paragraphs: [
    'I have completed my engineering in Computer Science and have had the opportunity to work with an early-stage startup, contributing to real-world problems through technology-driven solutions.',

    'Over time, I have developed a strong interest in machine learning and product management. I am especially curious about how AI models work and how they can be used to build smarter and more efficient products.',

    'With a background in Computer Science, I enjoy bridging the gap between technical feasibility and product thinking. I like turning ideas into functional, user-centric technology.',

    'Outside of technology, I enjoy playing games, hiking, exploring new places, and shooting and editing videos as a creative outlet.',
  ],

  portraitAlt: 'Portrait of Gautham N Holla',

  portrait: '',
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
  note:
    'ML Engineer | Product Manager | Developer',

  name: 'Gautham N Holla',

  copyright:
    '© Gautham N Holla. All rights reserved.',
};
