/**
 * Single source of truth for every piece of personal content.
 * Edit this file to update the site — no component needs changing.
 */

export type Accent = 'teal' | 'coral' | 'blue' | 'violet' | 'green' | 'amber';

export const ACCENTS: Record<Accent, string> = {
  teal: '#21b3a0',
  coral: '#f2683f',
  blue: '#4d8df0',
  violet: '#8b7bf0',
  green: '#84b53a',
  amber: '#d99320',
};

export interface LinkItem {
  label: string;
  href: string;
}

const EMAIL = 'akram.t.zeyad@uotechnology.edu.iq';
const GITHUB = 'https://github.com/Akramtaha98';

export const site = {
  name: 'Dr. Akram Taha Zeyad',
  shortName: 'Dr. Akram',
  role: 'Ph.D. in Artificial Intelligence | Researcher & Lecturer',
  affiliation: 'University of Technology, Baghdad · CAIT, UKM',
  affiliations: [
    'College of Computer Engineering, University of Technology, Baghdad, Iraq',
    'Center for Artificial Intelligence Technology (CAIT), Universiti Kebangsaan Malaysia (UKM)',
  ],
  metaDescription:
    'Dr. Akram Taha Zeyad — AI researcher and lecturer working on Large Language Models, Retrieval-Augmented Generation, graph-augmented retrieval, LLM evaluation, and deep learning for computer vision.',
  email: EMAIL,
  github: GITHUB,

  // Single-page site: nav items are in-page anchors.
  nav: [
    { href: '#about', label: 'About' },
    { href: '#research', label: 'Research' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ] satisfies LinkItem[],
  navCta: { href: `mailto:${EMAIL}`, label: 'Collaborate' } satisfies LinkItem,

  about: {
    eyebrow: '/ about',
    lede:
      'I research how large language models retrieve, reason over and justify evidence — building retrieval-augmented and graph-augmented systems, and the evaluation methods that tell us when to trust them.',
    portrait: { src: '/portrait-placeholder.svg', alt: 'Dr. Akram Taha Zeyad' },
    actions: [
      { label: 'Research interests', href: '#research', variant: 'primary', icon: '→' },
      { label: 'Projects', href: '#projects', variant: 'ghost' },
      { label: 'GitHub', href: GITHUB, variant: 'ghost', icon: '↗' },
      { label: 'CV', href: '/Akram_Taha_Zeyad_Resume.pdf', variant: 'ghost', icon: '↓', download: true },
    ] as const,

    story: {
      heading: 'Making language models grounded and accountable.',
      paragraphs: [
        {
          lead: 'My work is driven by one question — ',
          emphasis: 'how can AI systems answer from evidence, and show us when that evidence is enough?',
          tail: ' It connects my research on retrieval-augmented generation, graph-augmented retrieval and LLM-based evaluation.',
        },
        {
          lead: 'I hold a Ph.D. in Artificial Intelligence and am a researcher and lecturer at the College of Computer Engineering, University of Technology, Baghdad, affiliated with the Center for Artificial Intelligence Technology (CAIT) at Universiti Kebangsaan Malaysia.',
        },
        {
          lead: 'Alongside language models, I work on deep learning and computer vision, and I build open research tooling — from question-answering pipelines with evidence-state estimation to multi-agent dataset studios.',
        },
      ],
    },

    glance: [
      { k: 'Degree', v: 'Ph.D., Artificial Intelligence' },
      { k: 'Role', v: 'Researcher & Lecturer' },
      { k: 'Institution', v: 'University of Technology, Baghdad' },
      { k: 'Research center', v: 'CAIT, UKM' },
    ],

    profiles: [
      { label: 'GitHub', href: GITHUB },
      { label: 'Email', href: `mailto:${EMAIL}` },
      { label: 'UACT-RAG', href: 'https://github.com/Akramtaha98/UACT-RAG' },
    ] satisfies LinkItem[],

    competencies: {
      id: 'research',
      eyebrow: '/ research interests',
      heading: 'What I work on.',
      items: [
        {
          title: 'Large Language Models',
          accent: 'violet',
          detail: 'Capabilities, behaviour and reliability of LLMs in knowledge-intensive tasks.',
        },
        {
          title: 'Retrieval-Augmented Generation',
          accent: 'teal',
          detail: 'Grounding generation in retrieved evidence for faithful question answering.',
        },
        {
          title: 'Graph-Augmented Retrieval',
          accent: 'blue',
          detail: 'Using graph structure over documents and entities to retrieve connected evidence.',
        },
        {
          title: 'LLM Judges & Evaluation',
          accent: 'coral',
          detail: 'LLM-as-a-judge methods and evaluation protocols for generated answers.',
        },
        {
          title: 'Deep Learning & Computer Vision',
          accent: 'amber',
          detail: 'Deep neural models for visual recognition and image understanding.',
        },
      ] satisfies { title: string; accent: Accent; detail: string }[],
    },

    projects: {
      id: 'projects',
      eyebrow: '/ projects',
      heading: 'Selected projects.',
      items: [
        {
          title: 'UACT-RAG',
          accent: 'teal',
          tag: 'Question Answering · Evidence-State Estimation',
          detail: 'A retrieval-augmented question-answering system that estimates the state of the retrieved evidence alongside its answers.',
          href: 'https://github.com/Akramtaha98/UACT-RAG',
        },
        {
          title: 'WATAN AI',
          accent: 'violet',
          tag: 'Multi-Agent Pipeline · Dataset Studio',
          detail: 'A multi-agent pipeline and dataset studio for building and curating AI datasets.',
        },
      ] satisfies { title: string; accent: Accent; tag: string; detail: string; href?: string }[],
    },

    cta: {
      id: 'contact',
      heading: "Let's collaborate.",
      body: 'Research collaborations, student supervision and invitations to speak on LLMs, RAG and AI evaluation are always welcome.',
      link: { label: 'Email me →', href: `mailto:${EMAIL}` } satisfies LinkItem,
      secondary: EMAIL,
    },
  },

  footer: {
    note: 'Built with Next.js · hosted on GitHub Pages',
    links: [
      { label: 'GitHub', href: GITHUB },
      { label: 'Email', href: `mailto:${EMAIL}` },
    ] satisfies LinkItem[],
  },

  /** Labels shown on the page-transition overlay, keyed by path (no trailing slash). */
  routeLabels: {
    '/': 'Home',
    '/about': 'About',
  } as Record<string, string>,

  /** Routes that open on a dark banner, so the nav starts transparent-dark. */
  darkBannerRoutes: ['/', '/about'],
};
