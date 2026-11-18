'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { hero, site, type Lang, type Source } from '@/content/site';
import styles from './GroundedHero.module.css';
import TokenField from './TokenField';

const LANGS: Lang[] = ['en', 'ar', 'ms'];
const LANG_NAME: Record<Lang, string> = { en: 'English', ar: 'Arabic', ms: 'Malay' };
const TYPE_MS = 38;
/** How long a finished answer stays before the next language is asked. */
const DWELL_MS = 7000;
const TICK_MS = 100;
const STORAGE_KEY = 'hero-last-lang';

const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** A different question language than last time, so every reload asks anew. */
function pickLang(): Lang {
  let last: string | null = null;
  try {
    last = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
  const options = LANGS.filter((l) => l !== last);
  const lang = options[Math.floor(Math.random() * options.length)];
  try {
    sessionStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  return lang;
}

/** Random, distinct relevance scores; sources are listed best first. */
function rank(sources: Source[]) {
  const scored = sources.map((s) => ({ ...s, score: 0.72 + Math.random() * 0.24 }));
  return scored.sort((a, b) => b.score - a.score);
}

type Ranked = ReturnType<typeof rank>[number];
interface Thread {
  id: number;
  d: string;
  x: number;
  y: number;
}

export default function GroundedHero() {
  const [lang, setLang] = useState<Lang>('en');
  const [ranked, setRanked] = useState<Ranked[]>(() => hero.sources.map((s, i) => ({ ...s, score: 0.93 - i * 0.07 })));
  const [typed, setTyped] = useState<number | null>(null); // null = show full question
  const [run, setRun] = useState(0); // remount key for the animation
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [progress, setProgress] = useState(0); // 0..1 toward the next question
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const sectionRef = useRef<HTMLElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const markRefs = useRef(new Map<number, HTMLElement>());
  const cardRefs = useRef(new Map<number, HTMLElement>());

  const question = hero.questions[lang];

  /** Ask the question again in a language: re-rank, retype, replay. */
  const ask = useCallback((next: Lang) => {
    setLang(next);
    setRanked(rank(hero.sources));
    setActive(null);
    setRun((r) => r + 1);
    setTyped(reducedMotion() ? null : 0);
  }, []);

  // First load: a random language, then arm the CSS sequence.
  useEffect(() => {
    ask(pickLang());
    setArmed(true);
  }, [ask]);

  // Type the question one character at a time.
  useEffect(() => {
    if (typed === null) return;
    const total = Array.from(question.text).length;
    if (typed >= total) {
      const t = window.setTimeout(() => setTyped(null), 80);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setTyped(typed + 1), TYPE_MS);
    return () => window.clearTimeout(t);
  }, [typed, question.text]);

  // Loop: when an answer has finished, wait, then ask in the next language.
  // Pauses while the visitor is pointing at or focused inside the hero,
  // when the hero is off screen, and when the tab is hidden.
  useEffect(() => {
    if (!armed || reducedMotion()) return;
    const sequenceMs = Array.from(hero.questions[lang].text).length * TYPE_MS + 150 + 3 * 140 + 250 + 3 * 480 + 1100;
    const started = Date.now();
    let elapsed = 0;
    setProgress(0);
    const id = window.setInterval(() => {
      if (Date.now() - started < sequenceMs) return;
      if (pausedRef.current || !visibleRef.current || document.hidden) return;
      elapsed += TICK_MS;
      setProgress(Math.min(1, elapsed / DWELL_MS));
      if (elapsed >= DWELL_MS) {
        window.clearInterval(id);
        ask(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]);
      }
    }, TICK_MS);
    // Re-measure once cards have settled after their entrance.
    const settle = window.setTimeout(() => measureRef.current(), sequenceMs - 900);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(settle);
    };
  }, [armed, run, lang, ask]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hold = (on: boolean) => {
    pausedRef.current = on;
    setPaused(on);
  };

  // Draw threads from each citation (at the answer column's edge) to its source card.
  const measure = useCallback(() => {
    const grid = gridRef.current;
    const answer = answerRef.current;
    if (!grid || !answer) return;
    const g = grid.getBoundingClientRect();
    const a = answer.getBoundingClientRect();
    if (window.innerWidth < 900) return setThreads([]);
    const startX = a.right - g.left + 14;
    const next: Thread[] = [];
    for (const [id, mark] of markRefs.current) {
      const card = cardRefs.current.get(id);
      if (!card) continue;
      const m = mark.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const y1 = m.top + m.height / 2 - g.top;
      const x2 = c.left - g.left - 6;
      const y2 = c.top + Math.min(36, c.height / 2) - g.top;
      const mid = startX + (x2 - startX) * 0.5;
      next.push({ id, x: startX, y: y1, d: `M ${startX} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}` });
    }
    setThreads(next);
  }, []);
  const measureRef = useRef(measure);
  measureRef.current = measure;

  useEffect(() => {
    measure();
  }, [measure, ranked, lang, run]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const typing = typed !== null;
  const shownQuestion = typing ? Array.from(question.text).slice(0, typed).join('') : question.text;
  const order = new Map(ranked.map((s, i) => [s.id, i]));
  // Highlights start after typing and retrieval.
  const typeDuration = reducedMotion() ? 0 : Array.from(question.text).length * TYPE_MS;
  const retrieveAt = typeDuration + 150;
  const highlightAt = retrieveAt + 3 * 140 + 250;

  return (
    <section
      ref={sectionRef}
      onPointerEnter={() => hold(true)}
      onPointerLeave={() => hold(false)}
      onFocusCapture={() => hold(true)}
      onBlurCapture={() => hold(false)}
      className={`${styles.hero} page`}
      data-armed={armed ? '1' : undefined}
      aria-labelledby="hero-answer"
      style={
        {
          '--retrieve-at': `${retrieveAt}ms`,
          '--highlight-at': `${highlightAt}ms`,
        } as React.CSSProperties
      }
    >
      <TokenField />

      {/* ── The question ── */}
      <div className={styles.ask}>
        <div className={styles.query} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
          <svg className={styles.queryIcon} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={styles.queryText}>
            {shownQuestion}
            <span className={styles.caret} data-typing={typing ? '1' : '0'} aria-hidden="true" />
          </span>
        </div>
        <div className={styles.switcher}>
        <div className={styles.langs} role="group" aria-label="Ask this question in another language">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              lang={l}
              aria-pressed={l === lang}
              onClick={() => l !== lang && ask(l)}
            >
              {hero.questions[l].label}
            </button>
          ))}
        </div>
        <p className={styles.cycle} aria-live="off" data-paused={paused ? '1' : undefined}>
          <span className={styles.cycleBar}>
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
          <span>
            {paused
              ? 'Paused while you read'
              : `Next, asking in ${LANG_NAME[LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]]}`}
          </span>
        </p>
        </div>
      </div>

      <div ref={gridRef} className={styles.grid} key={run}>
        {/* ── The answer ── */}
        <div ref={answerRef} className={styles.answerCol}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.photo} src={site.portrait.src} alt={site.portrait.alt} width={720} height={720} />
          <h1 id="hero-answer" className={styles.answer}>
            {hero.answer.map((part, i) => {
              if (part.name) return <strong key={i}>{part.text}</strong>;
              if (!part.cite) return <span key={i}>{part.text}</span>;
              const id = part.cite;
              const n = id - 1;
              return (
                <span
                  key={i}
                  className={styles.claim}
                  data-active={active === id ? '1' : undefined}
                  style={{ '--i': n } as React.CSSProperties}
                  onMouseEnter={() => setActive(id)}
                  onMouseLeave={() => setActive(null)}
                >
                  {part.text}
                  <a
                    href={`#source-${id}`}
                    ref={(el) => {
                      if (el) markRefs.current.set(id, el);
                    }}
                    className={styles.cite}
                    aria-label={`Source ${id}`}
                    onFocus={() => setActive(id)}
                    onBlur={() => setActive(null)}
                  >
                    {id}
                  </a>
                </span>
              );
            })}
          </h1>
          <p className={styles.provenance}>
            Answered from {hero.sources.length} sources in {new Set(hero.sources.map((s) => s.lang)).size} languages.
            Select a highlighted claim or its number to see where it comes from.
          </p>
          <div className={styles.actions}>
            {hero.actions.map((a) =>
              a.href.startsWith('/') && !a.download ? (
                <Link key={a.label} href={a.href} className={`btn ${a.primary ? 'btn-primary' : ''}`}>
                  {a.label}
                </Link>
              ) : (
                <a key={a.label} href={a.href} className="btn" download={a.download || undefined}>
                  {a.label}
                </a>
              ),
            )}
          </div>
        </div>

        {/* ── The evidence ── */}
        <div className={styles.sourcesCol}>
          <p className={styles.sourcesTitle}>Retrieved sources</p>
          <ol className={styles.sources}>
            {ranked.map((s) => (
              <li
                key={s.id}
                id={`source-${s.id}`}
                ref={(el) => {
                  if (el) cardRefs.current.set(s.id, el);
                }}
                className={styles.source}
                data-active={active === s.id ? '1' : undefined}
                data-dim={active !== null && active !== s.id ? '1' : undefined}
                style={{ '--rank': order.get(s.id) } as React.CSSProperties}
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div className={styles.sourceHead}>
                  <span className={styles.sourceId}>{s.id}</span>
                  <span className={styles.origin} lang={s.lang}>
                    {s.origin}
                  </span>
                  <span className={styles.langTag}>{LANG_NAME[s.lang]}</span>
                </div>
                <p className={styles.passage} lang={s.lang} dir={s.lang === 'ar' ? 'rtl' : 'ltr'}>
                  {s.text}
                </p>
                <div className={styles.score} aria-label={`Relevance ${s.score.toFixed(2)}`}>
                  <span className={styles.bar}>
                    <span style={{ width: `${s.score * 100}%` }} />
                  </span>
                  <span>relevance {s.score.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Citation threads ── */}
        <svg className={styles.threads} aria-hidden="true">
          {threads.map((t) => (
            <g key={t.id} data-active={active === t.id ? '1' : undefined} style={{ '--i': t.id - 1 } as React.CSSProperties}>
              <path d={t.d} pathLength={1} />
              <circle cx={t.x} cy={t.y} r={3.5} />
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
