/**
 * Single source of truth for all site content.
 * Style rules for copy: no em or en dashes; sentence case; plain verbs.
 */

export interface LinkItem {
  label: string;
  href: string;
}

const EMAIL = 'akram.t.zeyad@uotechnology.edu.iq';

export const links = {
  email: `mailto:${EMAIL}`,
  github: 'https://github.com/Akramtaha98',
  scholar: 'https://scholar.google.com/citations?user=6K_BerIAAAAJ&hl=en',
  linkedin: 'https://www.linkedin.com/in/akram-t-44a095b6/',
  orcid: 'https://orcid.org/0009-0002-4020-8060',
  researchgate: 'https://www.researchgate.net/profile/Akram-Zeyad-2',
  cv: '/Akram_Taha_Zeyad_Resume.pdf',
};

// ─────────────────────────── Identity ───────────────────────────

export const site = {
  url: 'https://akramtaha98.github.io',
  name: 'Akram Taha Zeyad',
  role: 'PhD candidate in artificial intelligence and assistant lecturer',
  email: EMAIL,
  metaDescription:
    'Akram Taha Zeyad is a PhD candidate in artificial intelligence at Universiti Kebangsaan Malaysia and an assistant lecturer at the University of Technology, Baghdad. He researches retrieval-augmented generation, graph-augmented retrieval and LLM evaluation for Arabic and Malay.',
  portrait: { src: '/images/akram-portrait.webp', alt: 'Akram Taha Zeyad' },

  nav: [
    { href: '/research/', label: 'Research' },
    { href: '/projects/', label: 'Projects' },
    { href: '/certificates/', label: 'Certificates' },
    { href: '/cv/', label: 'CV' },
    { href: '/contact/', label: 'Contact' },
  ] satisfies LinkItem[],

  /** Label shown during the page transition, keyed by path without trailing slash. */
  routeLabels: {
    '/': 'Home',
    '/research': 'Research',
    '/projects': 'Projects',
    '/certificates': 'Certificates',
    '/cv': 'Curriculum vitae',
    '/contact': 'Contact',
  } as Record<string, string>,
};

// ─────────────────────────── Hero: a grounded answer ───────────────────────────

export type Lang = 'en' | 'ar' | 'ms';

export interface Source {
  id: number;
  lang: Lang;
  origin: string;
  text: string;
  href: string;
}

/**
 * The hero is written as a retrieval-augmented answer: each cited span is
 * backed by a source passage. Sources are deliberately in three languages.
 * On every load the question language changes and the sources are re-ranked.
 */
export const hero = {
  questions: {
    en: { label: 'English', text: 'Who is Akram Taha Zeyad?' },
    ar: { label: 'العربية', text: 'من هو أكرم طه زياد؟' },
    ms: { label: 'Bahasa Melayu', text: 'Siapakah Akram Taha Zeyad?' },
  } as Record<Lang, { label: string; text: string }>,
  answer: [
    { text: 'Akram Taha Zeyad', name: true },
    { text: ' is ' },
    { text: 'a PhD candidate in artificial intelligence at Universiti Kebangsaan Malaysia', cite: 1 },
    { text: '. He studies ' },
    { text: 'how language models answer from evidence, and how to tell when that evidence is enough', cite: 2 },
    { text: ', and teaches ' },
    { text: 'as an assistant lecturer at the University of Technology in Baghdad', cite: 3 },
    { text: '.' },
  ] as { text: string; cite?: number; name?: boolean }[],
  sources: [
    {
      id: 1,
      lang: 'ms',
      origin: 'Universiti Kebangsaan Malaysia',
      text: 'Calon PhD dalam bidang kecerdasan buatan, memberi tumpuan kepada penjanaan berasaskan dapatan semula (RAG) untuk bahasa Arab dan Melayu.',
      href: '/cv/',
    },
    {
      id: 2,
      lang: 'en',
      origin: 'Research statement',
      text: 'When a grounding score improves, do the answers improve too? My work tests that question across retrieval, fine-tuning and evaluation.',
      href: '/research/',
    },
    {
      id: 3,
      lang: 'ar',
      origin: 'الجامعة التكنولوجية، بغداد',
      text: 'مدرس مساعد في كلية هندسة الحاسوب، يدرّس البرمجة بلغة بايثون والذكاء الاصطناعي.',
      href: '/cv/',
    },
  ] satisfies Source[],
  actions: [
    { label: 'Read the research', href: '/research/', primary: true },
    { label: 'Download CV', href: links.cv, download: true },
    { label: 'Email me', href: links.email },
  ],
};

// ─────────────────────────── About ───────────────────────────

export const about = {
  heading: 'About',
  paragraphs: [
    'I study how AI systems answer from evidence, and how we can tell when that evidence is enough. My work connects retrieval-augmented generation, graph-augmented retrieval and the evaluation of language model outputs, including LLM-based judges.',
    'Most of it happens in Arabic and Malay, where retrieval failures and weak evaluation proxies are easy to miss and hard to measure. I build multilingual question-answering systems, fine-tune them efficiently with LoRA, and test whether the scores we optimise for actually make the answers better.',
    'Before language models, I worked on deep learning for computer vision and medical images, and I still use those methods. I teach Python and artificial intelligence at the University of Technology in Baghdad.',
  ],
  notes: [
    { k: 'Now', v: 'PhD candidate, Universiti Kebangsaan Malaysia, since 2026' },
    { k: 'Teaching', v: 'Assistant lecturer, University of Technology, Baghdad, since October 2025' },
    { k: 'Research center', v: 'Center for Artificial Intelligence Technology (CAIT), UKM' },
    { k: 'Scholarship', v: 'Malaysia International Scholarship, 2025' },
    { k: 'Languages', v: 'Arabic (native), English (professional), Malay (basic)' },
  ],
};

// ─────────────────────────── Research ───────────────────────────

export const interests = {
  heading: 'Research interests',
  items: [
    { term: 'Retrieval-augmented generation', def: 'Grounding answers in retrieved passages, and understanding the ways grounding fails.' },
    { term: 'Graph-augmented retrieval', def: 'Using links between documents and entities to retrieve evidence that belongs together.' },
    { term: 'LLM judges and evaluation', def: 'When a language model grades another model, what is it really measuring?' },
    { term: 'Large language models', def: 'Efficient fine-tuning with LoRA and PEFT, and reliability in knowledge-intensive tasks.' },
    { term: 'Multilingual NLP', def: 'Arabic and Malay question answering, and Arabic and English code-mixed text.' },
    { term: 'Deep learning and computer vision', def: 'Neural models for visual recognition and medical image analysis.' },
  ],
};

export const programme = {
  heading: 'One question, three studies',
  lede: 'Each study answers the question the previous one raised.',
  steps: [
    {
      label: 'Map the failures',
      status: 'Systematic review with pilot experiments',
      title: 'First, understand where the system breaks.',
      summary:
        'A PRISMA-guided review of 61 studies sorts RAG failures into four groups: missing context, context noise, formatting errors, and hallucination despite retrieval. Pilot experiments in Arabic and Malay frame the next questions.',
      href: '/papers/rag-failure-modes-systematic-review.pdf',
      linkLabel: 'Read the review',
    },
    {
      label: 'Test the reward',
      status: 'Controlled experiments, manuscript',
      title: 'A stronger score is not always a better answer.',
      summary:
        'Five-seed experiments on Qwen3 and T5Gemma 2 separate an NLI faithfulness reward from fine-tuning itself. Once answer length is matched, the reward adds no reliable benefit in the tested setting.',
      href: '/papers/nli-faithfulness-lora-arabic-malay.pdf',
      linkLabel: 'Read the study',
    },
    {
      label: 'Fix it under pressure',
      status: 'Planned work, research proposal',
      title: 'Test mitigation when the evidence is imperfect.',
      summary:
        'The next study compares length-controlled preference optimisation and evidence-grounded training with distractors, missing evidence and retrieval noise. Better performance is the question, not the assumption.',
      href: '/papers/research-proposal-akram-taha.pdf',
      linkLabel: 'Read the proposal',
    },
  ],
};

export interface Paper {
  title: string;
  status: string;
  summary: string;
  pages: string;
  href: string;
}

export const papers = {
  heading: 'Papers and manuscripts',
  lede: 'Manuscripts under preparation and my research proposal. Each one states its status.',
  items: [
    {
      title:
        'Formalizing Retrieval-Augmented Generation Failure Modes and LoRA-Based Mitigation: A PRISMA-Guided Systematic Review with Pilot Closed-Passage Question Answering Experiments on Arabic and Malay',
      status: 'Manuscript, systematic review',
      summary:
        'A review of 61 studies, a four-part failure taxonomy, and preliminary closed-passage QA experiments. The proposed adapter mapping remains a hypothesis.',
      pages: '21 pages',
      href: '/papers/rag-failure-modes-systematic-review.pdf',
    },
    {
      title:
        'An NLI Faithfulness Reward Added Nothing to LoRA Fine-Tuning of Qwen3 and T5Gemma 2 in Arabic and Malay Question Answering: A Controlled Null Result with a Length-Matched Analysis',
      status: 'Manuscript, controlled experiments',
      summary:
        'A five-seed study finds no reliable added benefit from the NLI reward after length matching, and separates proxy scores from answer quality.',
      pages: '57 pages',
      href: '/papers/nli-faithfulness-lora-arabic-malay.pdf',
    },
    {
      title:
        'Proxy Validity and Controlled Mitigation in Evidence-Grounded Training for Low-Resource Multilingual Retrieval-Augmented Generation: Evidence from Arabic and Malay Question Answering',
      status: 'PhD research proposal',
      summary:
        'Three linked studies: a systematic review, a controlled reward evaluation, and planned mitigation with length-controlled DPO and retrieval robustness.',
      pages: '50 pages',
      href: '/papers/research-proposal-akram-taha.pdf',
    },
  ] satisfies Paper[],
  other: [
    'Co-author of an APO-DRL framework for IoT and 5G optimisation, in revision (2025).',
    'Co-author of a study on PII redaction in Arabic and English code-mixed text with XLM-RoBERTa, LoRA and rules (2026).',
    'Three peer-reviewed publications on AI in healthcare and education (University of Technology, 2023 to 2025).',
  ],
};

// ─────────────────────────── Projects ───────────────────────────

export interface Project {
  title: string;
  what: string;
  stack: string[];
  href?: string;
  status?: string;
}

export const projects = {
  heading: 'Projects',
  lede: 'Research systems and tools I have built, most of them open source.',
  items: [
    {
      title: 'UACT-RAG',
      what: 'Question answering that estimates the state of its retrieved evidence alongside each answer.',
      stack: ['RAG', 'Evidence estimation', 'Python'],
      href: 'https://github.com/Akramtaha98/UACT-RAG',
    },
    {
      title: 'WATAN AI',
      what: 'A multi-agent pipeline and dataset studio for building and curating AI datasets.',
      stack: ['Multi-agent', 'LLMs', 'Datasets'],
      status: 'In development',
    },
    {
      title: 'Multilingual RAG dialogue system',
      what: 'My PhD prototype: mT5 fine-tuned with LoRA for Arabic and Malay retrieval-augmented dialogue.',
      stack: ['mT5', 'LoRA / PEFT', 'FAISS'],
      status: 'PhD prototype',
    },
    {
      title: 'PaperBrief',
      what: 'Turns research PDFs into structured summaries, key findings and plain-English explanations.',
      stack: ['React', 'Node.js', 'Gemini'],
      href: 'https://github.com/Akramtaha98/paperbrief',
    },
    {
      title: 'Arabic and English PII redactor',
      what: 'Redacts personal information from code-mixed Arabic and English text with LoRA-tuned models and rules.',
      stack: ['XLM-R', 'LoRA', 'Python'],
      href: 'https://github.com/Akramtaha98/PII-redactor-ar-en-codemix',
    },
    {
      title: 'Hybrid CDN simulator',
      what: 'Reproducible simulation of edge caching, compute offloading and Q-learning, with CSV results and plots.',
      stack: ['Python', 'Q-learning', 'Edge computing'],
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
  file: string;
  verify?: string;
}

export const certificates = {
  heading: 'Certificates',
  lede: 'Courses I have completed in AI tools, language models and reasoning. Claude Academy badges link to their public verification page.',
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

export interface TimelineEntry {
  when: string;
  title: string;
  org: string;
  points?: string[];
}

export const cv = {
  heading: 'Curriculum vitae',
  lede: 'Experience, education and skills. The full CV is available as a PDF.',
  experience: [
    {
      when: 'Oct 2025 to now',
      title: 'Assistant lecturer',
      org: 'University of Technology, Baghdad',
      points: [
        'Teach Python programming and artificial intelligence, and build lab exercises in machine learning and deep learning.',
        'Mentor students on AI capstone projects and contribute to the computer science curriculum.',
      ],
    },
    {
      when: 'Apr 2023 to Oct 2025',
      title: 'Assistant engineer',
      org: 'University of Technology, Baghdad',
      points: ['Built Python applications and data pipelines for research and teaching, and supported engineering projects.'],
    },
    {
      when: 'Dec 2021 to Sep 2022',
      title: 'Technical support engineer',
      org: 'HRINS Company, Baghdad',
      points: ['Resolved customer technical issues and introduced a ticketing system that cut response time by 30%.'],
    },
    {
      when: 'Nov 2019 to Sep 2020',
      title: 'Telephone and medical equipment technician',
      org: 'Al-Wahj Company, Baghdad',
    },
  ] satisfies TimelineEntry[],
  education: [
    {
      when: '2026 to now',
      title: 'PhD, Information Science and Technology (NLP and AI)',
      org: 'Universiti Kebangsaan Malaysia',
      points: [
        'Multilingual retrieval-augmented question answering and dialogue for Arabic and Malay.',
        'Supervised by Dr. Lailatul Qadri Zakaria and Dr. Saidah Saad. Supported by the Malaysia International Scholarship (2025).',
      ],
    },
    {
      when: 'Sep 2022 to Mar 2024',
      title: 'Master of Artificial Intelligence',
      org: 'Universiti Kebangsaan Malaysia',
      points: ['Deep learning models for medical image analysis and education-focused AI tools.'],
    },
    {
      when: 'Dec 2016 to Sep 2021',
      title: 'BSc, Computer Engineering',
      org: 'University of Technology, Baghdad',
      points: ['Capstone: a real-time object detection system with a lightweight CNN on low-power hardware.'],
    },
  ] satisfies TimelineEntry[],
  skills: [
    { group: 'Languages and frameworks', items: ['Python', 'PyTorch', 'TensorFlow', 'Hugging Face Transformers', 'Django', 'Flask'] },
    { group: 'NLP and LLMs', items: ['RAG systems', 'LoRA / PEFT', 'mT5', 'XLM-RoBERTa', 'LangGraph', 'CrewAI', 'AutoGen', 'FAISS'] },
    { group: 'Machine learning', items: ['Computer vision', 'OpenCV', 'scikit-learn', 'Data analysis', 'SQL and NoSQL'] },
  ],
  pages: ['/images/cv/page-1.webp', '/images/cv/page-2.webp', '/images/cv/page-3.webp'],
};

// ─────────────────────────── Contact ───────────────────────────

export const contact = {
  heading: 'Contact',
  lede: 'I welcome research collaborations, questions about my work, and invitations to talk about RAG, LLM evaluation and multilingual AI.',
  profiles: [
    { label: 'Google Scholar', href: links.scholar },
    { label: 'GitHub', href: links.github },
    { label: 'LinkedIn', href: links.linkedin },
    { label: 'ORCID', href: links.orcid, detail: '0009-0002-4020-8060' },
    { label: 'ResearchGate', href: links.researchgate },
  ],
  places: [
    { name: 'Center for Artificial Intelligence Technology (CAIT)', where: 'Universiti Kebangsaan Malaysia, Bangi, Malaysia' },
    { name: 'College of Computer Engineering', where: 'University of Technology, Baghdad, Iraq' },
  ],
};
