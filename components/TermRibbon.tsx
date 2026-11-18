'use client';

import { useEffect, useRef } from 'react';
import styles from './TermRibbon.module.css';

/** Each concept in the three languages the research works across. */
const TERMS: { en: string; ar: string; ms: string }[] = [
  { en: 'Question', ar: 'سؤال', ms: 'Soalan' },
  { en: 'Retrieval', ar: 'الاسترجاع', ms: 'Dapatan semula' },
  { en: 'Evidence', ar: 'الدليل', ms: 'Bukti' },
  { en: 'Answer', ar: 'الإجابة', ms: 'Jawapan' },
  { en: 'Evaluation', ar: 'التقييم', ms: 'Penilaian' },
  { en: 'Large language models', ar: 'نماذج اللغة الكبيرة', ms: 'Model bahasa besar' },
];

const BASE_SPEED = 0.035; // px per ms

/**
 * Two rows of terms that loop in opposite directions. Scrolling speeds them
 * up and can reverse them; hovering a row holds it still so a term can be read.
 */
export default function TermRibbon() {
  const rowRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const rows = rowRefs.map((r) => r.current!);
    const offsets = [0, 0];
    const held = [false, false];
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;

    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      boost = Math.max(-3, Math.min(3, boost + dy * 0.02));
    };
    const handlers = rows.map((row, i) => {
      const on = () => (held[i] = true);
      const off = () => (held[i] = false);
      row.addEventListener('pointerenter', on);
      row.addEventListener('pointerleave', off);
      return [on, off] as const;
    });

    const frame = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      boost *= Math.exp(-dt / 600);
      rows.forEach((row, i) => {
        if (held[i]) return;
        const dir = i === 0 ? -1 : 1;
        const half = row.scrollWidth / 2;
        // Scrolling down speeds the loop up; scrolling up can reverse it.
        offsets[i] += dir * dt * BASE_SPEED * (1 + boost);
        if (offsets[i] <= -half) offsets[i] += half;
        if (offsets[i] > 0) offsets[i] -= half;
        row.style.transform = `translate3d(${offsets[i]}px,0,0)`;
      });
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      rows.forEach((row, i) => {
        row.removeEventListener('pointerenter', handlers[i][0]);
        row.removeEventListener('pointerleave', handlers[i][1]);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const row = (key: string, langs: ('en' | 'ar' | 'ms')[]) =>
    // Content is duplicated so the loop is seamless.
    [0, 1].flatMap((copy) =>
      TERMS.flatMap((t) =>
        langs.map((l) => (
          <span
            key={`${key}-${copy}-${t.en}-${l}`}
            lang={l}
            className={styles.term}
            data-lang={l}
            data-copy={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {t[l]}
          </span>
        )),
      ),
    );

  return (
    <div className={styles.ribbon} aria-label="Research vocabulary in English, Arabic and Malay">
      <div ref={rowRefs[0]} className={styles.row}>
        {row('a', ['en', 'ar', 'ms'])}
      </div>
      <div ref={rowRefs[1]} className={`${styles.row} ${styles.rowB}`}>
        {row('b', ['ms', 'en', 'ar'])}
      </div>
    </div>
  );
}
