/**
 * Single source of truth for all site content.
 * Edit this file to update text, links, papers, projects or certificates.
 * Style rule: no em or en dashes in visible copy.
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
const CV_PDF = '/Akram_Taha_Zeyad_Resume.pdf';

export const links = {
  email: `mailto:${EMAIL}`,
  github: 'https://github.com/Akramtaha98',
  scholar: 'https://scholar.google.com/citations?user=6K_BerIAAAAJ&hl=en',
  linkedin: 'https://www.linkedin.com/in/akram-t-44a095b6/',
  orcid: 'https://orcid.org/0009-0002-4020-8060',
  researchgate: 'https://www.researchgate.net/profile/Akram-Zeyad-2',
  cv: CV_PDF,
};

// ─────────────────────────── Identity ───────────────────────────

export const site = {
  url: 'https://akramtaha98.github.io',
  name: 'Dr. Akram Taha Zeyad',
  shortName: 'Akram Taha',
  role: 'Ph.D. in Artificial Intelligence | Researcher & Lecturer',
  email: EMAIL,
  metaDescription:
    'Dr. Akram Taha Zeyad is an AI researcher and lecturer working on large language models, retrieval-augmented generation, graph-augmented retrieval, LLM evaluation, and deep learning for computer vision.',
  portrait: { src: '/images/akram-portrait.webp', alt: 'Portrait of Dr. Akram Taha Zeyad' },

  affiliations: [
    {
      org: 'University of Technology',
      unit: 'College of Computer Engineering',
      place: 'Baghdad, Iraq',
    },
    {
      org: 'Universiti Kebangsaan Malaysia (UKM)',
      unit: 'Center for Artificial Intelligence Technology (CAIT)',
      place: 'Bangi, Malaysia',
    },
  ],

  nav: [
    { href: '/', label: 'About' },
    { href: '/research/', label: 'Research' },
    { href: '/projects/', label: 'Projects' },
    { href: '/certificates/', label: 'Certificates' },
    { href: '/cv/', label: 'CV' },
  ] satisfies LinkItem[],
  navCta: { href: '/contact/', label: 'Contact' } satisfies LinkItem,

  /** Labels shown on the page-transition overlay, keyed by path (no trailing slash). */
  routeLabels: {
    '/': 'About',
    '/research': 'Research',
    '/projects': 'Projects',
    '/certificates': 'Certificates',
    '/cv': 'Curriculum Vitae',
    '/contact': 'Contact',
  } as Record<string, string>,

  /** Every page opens on a dark banner. */
  darkBannerRoutes: ['/', '/about', '/research', '/projects', '/certificates', '/cv', '/contact'],
};

// ─────────────────────────── Home / About ───────────────────────────

export const home = {
  eyebrow: '/ about',
  lede:
    'I research how large language models retrieve, reason over and justify evidence. I build retrieval-augmented and graph-augmented systems, and the evaluation methods that show when we can trust them.',
  actions: [
    { label: 'Explore the research', href: '/research/', variant: 'primary', icon: '→' },
    { label: 'Get in touch', href: '/contact/', variant: 'ghost' },
    { label: 'Download CV', href: CV_PDF, variant: 'ghost', icon: '↓', download: true },
  ] as const,

  story: {
    heading: 'Making language models grounded and accountable.',
    paragraphs: [
      {
        lead: 'My work is driven by one question: ',
        emphasis: 'how can AI systems answer from evidence, and show us when that evidence is enough?',
        tail: ' It connects my research on retrieval-augmented generation, graph-augmented retrieval and LLM-based evaluation.',
      },
      {
        lead: 'I hold a Ph.D. in Artificial Intelligence. I teach and research at the College of Computer Engineering, University of Technology in Baghdad, and I am affiliated with the Center for Artificial Intelligence Technology (CAIT) at Universiti Kebangsaan Malaysia.',
      },
      {
        lead: 'Much of my recent work studies reliable question answering in Arabic and Malay, where retrieval failures and weak evaluation proxies are easy to miss. Alongside language models, I work on deep learning for computer vision and build open research tools.',
      },
    ],
  },

  glance: [
    { k: 'Degree', v: 'Ph.D., Artificial Intelligence' },
    { k: 'Role', v: 'Researcher & Lecturer' },
    { k: 'Institution', v: 'University of Technology, Baghdad' },
    { k: 'Research center', v: 'CAIT, UKM' },
    { k: 'Languages', v: 'Arabic · English · Malay' },
  ],
};

// ─────────────────────────── Research ───────────────────────────

export const interests = {
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
      detail: 'LLM-as-a-judge methods, faithfulness metrics and the validity of evaluation proxies.',
    },
    {
      title: 'Deep Learning & Computer Vision',
      accent: 'amber',
      detail: 'Deep neural models for visual recognition and image understanding.',
    },
    {
      title: 'Multilingual NLP',
      accent: 'green',
      detail: 'Arabic and Malay question answering, code-mixed text and efficient fine-tuning with LoRA.',
    },
  ] satisfies { title: string; accent: Accent; detail: string }[],
};

export const programme = {
  eyebrow: '/ research programme',
  heading: 'Follow the question.',
  lede: 'From identifying failure modes to testing what actually changes answer quality.',
  steps: [
    {
      step: '01',
      label: 'Map the failures',
      status: 'Systematic review + pilot experiments',
      title: 'First, understand where the system breaks.',
      summary:
        'A PRISMA-guided review of 61 studies organizes RAG failures into four groups: missing context, context noise, formatting errors, and hallucination despite retrieval. Pilot Arabic and Malay experiments help frame the next questions.',
      href: '/papers/rag-failure-modes-systematic-review.pdf',
      linkLabel: 'Read the review',
    },
    {
      step: '02',
      label: 'Test the reward',
      status: 'Controlled experiments · manuscript',
      title: 'A stronger score is not always a better answer.',
      summary:
        'Five-seed experiments on Qwen3 and T5Gemma 2 isolate an NLI reward from fine-tuning and its surrounding machinery. After length matching, the reward provides no reliable additional benefit in the tested setting.',
      href: '/papers/nli-faithfulness-lora-arabic-malay.pdf',
      linkLabel: 'Read the controlled study',
    },
    {
      step: '03',
      label: 'What comes next',
      status: 'Planned work · research proposal',
      title: 'Test mitigation under imperfect evidence.',
      summary:
        'The next study compares length-controlled preference optimization and evidence-grounded training under distractors, missing evidence, and retrieval variation. Improved performance is a question to test, not an assumed result.',
      href: '/papers/research-proposal-akram-taha.pdf',
      linkLabel: 'Read the proposal',
    },
  ],
};

export const papers = {
  eyebrow: '/ writing',
  heading: 'Papers & manuscripts.',
  lede: 'Research manuscripts and a research proposal. The status of each document is shown on its card.',
  scholarLabel: 'Full record on Google Scholar',
  items: [
    {
      title:
        'Formalizing Retrieval-Augmented Generation Failure Modes and LoRA-Based Mitigation: A PRISMA-Guided Systematic Review with Pilot Closed-Passage Question Answering Experiments on Arabic and Malay',
      status: 'Manuscript · Systematic review',
      summary:
        'A review of 61 studies, a four-part failure taxonomy, and preliminary closed-passage QA experiments. The proposed adapter mapping remains a hypothesis.',
      tags: ['PRISMA review', 'RAG failure modes', 'Arabic · Malay'],
      pages: '21 pages',
      href: '/papers/rag-failure-modes-systematic-review.pdf',
      accent: 'teal',
    },
    {
      title:
        'An NLI Faithfulness Reward Added Nothing to LoRA Fine-Tuning of Qwen3 and T5Gemma 2 in Arabic and Malay Question Answering: A Controlled Null Result with a Length-Matched Analysis',
      status: 'Manuscript · Controlled experiments',
      summary:
        'A controlled five-seed study finds no reliable additional benefit from the NLI reward after length matching. The work distinguishes proxy scores from answer quality.',
      tags: ['LoRA', 'Faithfulness', 'Controlled null result'],
      pages: '57 pages',
      href: '/papers/nli-faithfulness-lora-arabic-malay.pdf',
      accent: 'violet',
    },
    {
      title:
        'Proxy Validity and Controlled Mitigation in Evidence-Grounded Training for Low-Resource Multilingual Retrieval-Augmented Generation: Evidence from Arabic and Malay Question Answering',
      status: 'Research proposal',
      summary:
        'Three linked studies: a systematic review, a controlled reward evaluation, and planned mitigation with length-controlled DPO and retrieval robustness.',
      tags: ['Proxy validity', 'Planned mitigation', 'DPO'],
      pages: '50 pages',
      href: '/papers/research-proposal-akram-taha.pdf',
      accent: 'coral',
    },
  ] satisfies {
    title: string;
    status: string;
    summary: string;
    tags: string[];
    pages: string;
    href: string;
    accent: Accent;
  }[],
};

// ─────────────────────────── Projects ───────────────────────────

export interface Project {
  title: string;
  category: string;
  summary: string;
  tags: string[];
  accent: Accent;
  href?: string;
  featured?: boolean;
}

export const projects = {
  eyebrow: '/ projects',
  heading: 'Things I have built.',
  lede: 'Research systems and tools for language, retrieval and intelligent networks.',
  items: [
    {
      title: 'UACT-RAG',
      category: 'Question answering · Evidence-state estimation',
      summary:
        'A retrieval-augmented question-answering system that estimates the state of the retrieved evidence alongside its answers.',
      tags: ['RAG', 'Question answering', 'Evidence estimation'],
      accent: 'teal',
      href: 'https://github.com/Akramtaha98/UACT-RAG',
      featured: true,
    },
    {
      title: 'WATAN AI',
      category: 'Multi-agent pipeline · Dataset studio',
      summary: 'A multi-agent pipeline and dataset studio for building and curating AI datasets.',
      tags: ['Multi-agent', 'LLMs', 'Datasets'],
      accent: 'violet',
      featured: true,
    },
    {
      title: 'PaperBrief',
      category: 'AI research tool',
      summary: 'A web app that turns PDFs into structured summaries, key findings, and plain-English explanations.',
      tags: ['React', 'Node.js', 'Gemini'],
      accent: 'green',
      href: 'https://github.com/Akramtaha98/paperbrief',
    },
    {
      title: 'Arabic & English PII Redactor',
      category: 'Multilingual NLP',
      summary:
        'Combines LoRA-tuned language models and rules to redact personal information from mixed Arabic and English text.',
      tags: ['Python', 'XLM-R', 'LoRA'],
      accent: 'blue',
      href: 'https://github.com/Akramtaha98/PII-redactor-ar-en-codemix',
    },
    {
      title: 'Hybrid CDN Simulator',
      category: 'Network simulation',
      summary:
        'A reproducible simulation of edge caching, compute offloading, and Q-learning, with CSV results and plots.',
      tags: ['Python', 'Q-learning', 'Edge computing'],
      accent: 'amber',
      href: 'https://github.com/Akramtaha98/Hybrid-CDN-Simulation-Edge-Cache-MEC-Q-learning',
    },
  ] satisfies Project[],
};

// ─────────────────────────── Certificates ───────────────────────────

export interface Certificate {
  title: string;
  issuer: 'Claude Academy' | 'Hugging Face';
  course?: string;
  issued: string;
  image: string;
  /** Original file (PDF or image). */
  file: string;
  verify?: string;
}

export const certificates = {
  eyebrow: '/ certificates',
  heading: 'Courses & credentials.',
  lede: 'Completed courses in AI tools, language models, and reasoning. Claude Academy badges can be verified online.',
  items: [
    {
      title: 'Claude Code in Action',
      issuer: 'Claude Academy',
      issued: '9 November 2026',
      image: '/certificates/claude-code-in-action.webp',
      file: '/certificates/claude-academy-badge-claude-code-in-action.pdf',
      verify: 'https://academy.claude.com/verify/4f8d9be1d9ad36af915d39eb0a71dbf2',
    },
    {
      title: 'Introduction to Claude Tag',
      issuer: 'Claude Academy',
      issued: '9 November 2026',
      image: '/certificates/claude-tag.webp',
      file: '/certificates/claude-academy-badge-introduction-to-claude-tag.pdf',
      verify: 'https://academy.claude.com/verify/ea157e6fb31eedad41218e70415c31af',
    },
    {
      title: 'Claude 101',
      issuer: 'Claude Academy',
      issued: '7 November 2026',
      image: '/certificates/claude-101.webp',
      file: '/certificates/claude-academy-badge-claude-101.pdf',
      verify: 'https://academy.claude.com/verify/2744fe785c61fd69ca78b9db1524fadb',
    },
    {
      title: 'Claude Code 101',
      issuer: 'Claude Academy',
      issued: '7 November 2026',
      image: '/certificates/claude-code-101.webp',
      file: '/certificates/claude-academy-badge-claude-code-101.pdf',
      verify: 'https://academy.claude.com/verify/19f4ab2a5e89039f41792a1fd3c324d4',
    },
    {
      title: 'Introduction to Claude Cowork',
      issuer: 'Claude Academy',
      issued: '7 November 2026',
      image: '/certificates/claude-cowork.webp',
      file: '/certificates/claude-academy-badge-introduction-to-claude-cowork.pdf',
      verify: 'https://academy.claude.com/verify/a138e83bded31bf43c740bfd8be6c8bd',
    },
    {
      title: 'Fundamentals of LLMs',
      issuer: 'Hugging Face',
      course: 'The LLM Course',
      issued: '7 November 2026',
      image: '/certificates/hugging-face-llms.webp',
      file: '/certificates/hugging-face-llms.webp',
    },
    {
      title: 'Fundamentals of GRPO',
      issuer: 'Hugging Face',
      course: 'The Reasoning Course',
      issued: '7 November 2026',
      image: '/certificates/hugging-face-grpo.webp',
      file: '/certificates/hugging-face-grpo.webp',
    },
  ] satisfies Certificate[],
};

// ─────────────────────────── CV ───────────────────────────

export const cv = {
  eyebrow: '/ curriculum vitae',
  lede: 'Positions, education, research and credentials. The full CV is available as a PDF.',
  /** Page images of the CV PDF for the inline preview (regenerate when the PDF changes). */
  pages: ['/images/cv/page-1.webp', '/images/cv/page-2.webp', '/images/cv/page-3.webp'],
  positions: [
    {
      title: 'Lecturer',
      org: 'College of Computer Engineering, University of Technology',
      place: 'Baghdad, Iraq',
      detail: 'Teaching and research in artificial intelligence and computer engineering.',
    },
    {
      title: 'Researcher',
      org: 'Center for Artificial Intelligence Technology (CAIT), Universiti Kebangsaan Malaysia',
      place: 'Bangi, Malaysia',
      detail:
        'Research on reliable retrieval-augmented generation for Arabic and Malay, supervised by Dr. Lailatul Qadri Zakaria and Dr. Saidah Saad.',
    },
  ],
  education: [
    {
      when: 'Ph.D.',
      title: 'Doctor of Philosophy in Artificial Intelligence',
      org: 'Universiti Kebangsaan Malaysia',
    },
    {
      when: '2025',
      title: 'Malaysia International Scholarship (MIS)',
      org: 'Scholarship recipient',
    },
    {
      when: '2024',
      title: 'Master of Artificial Intelligence',
      org: 'Universiti Kebangsaan Malaysia',
    },
  ],
  skills: [
    { group: 'Research methods', items: ['Systematic reviews (PRISMA)', 'Controlled experiments', 'LLM evaluation', 'Faithfulness metrics'] },
    { group: 'Models & training', items: ['LoRA / PEFT', 'Qwen3', 'T5Gemma 2', 'XLM-R', 'Preference optimization'] },
    { group: 'Engineering', items: ['Python', 'React', 'Node.js', 'Q-learning', 'Simulation'] },
  ],
};

// ─────────────────────────── Contact ───────────────────────────

export const contact = {
  eyebrow: '/ contact',
  heading: "Let's work together.",
  lede: 'Research collaborations, student supervision and invitations to speak on LLMs, RAG and AI evaluation are always welcome.',
  profiles: [
    { label: 'Email', detail: EMAIL, href: links.email, icon: '@' },
    { label: 'Google Scholar', detail: 'Publications & citations', href: links.scholar, icon: 'G' },
    { label: 'GitHub', detail: 'Code & experiments', href: links.github, icon: '⌘' },
    { label: 'LinkedIn', detail: 'Professional network', href: links.linkedin, icon: 'in' },
    { label: 'ORCID', detail: '0009-0002-4020-8060', href: links.orcid, icon: 'iD' },
    { label: 'ResearchGate', detail: 'Research & collaboration', href: links.researchgate, icon: 'R' },
  ],
};

export const footer = {
  note: 'Built with Next.js · hosted on GitHub Pages',
  links: [
    { label: 'Scholar', href: links.scholar },
    { label: 'GitHub', href: links.github },
    { label: 'LinkedIn', href: links.linkedin },
    { label: 'ORCID', href: links.orcid },
  ] satisfies LinkItem[],
};
