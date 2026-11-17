'use client';

import { useEffect } from 'react';

const STEP_MS = { text: 90, card: 70 } as const;
type Kind = keyof typeof STEP_MS;

/**
 * Reveals every `[data-reveal]` element as it scrolls into view.
 * Elements entering in the same frame are staggered in DOM order
 * (`data-reveal="text"` → 90 ms apart, `"card"` → 70 ms apart).
 * Hidden styling lives in globals.css and only applies under `html.js`.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => els.indexOf(a) - els.indexOf(b));
        const counters: Record<Kind, number> = { text: 0, card: 0 };
        for (const el of entering) {
          const kind = (el.dataset.reveal as Kind) in STEP_MS ? (el.dataset.reveal as Kind) : 'text';
          el.style.setProperty('--reveal-delay', `${STEP_MS[kind] * counters[kind]++}ms`);
          el.classList.add('is-shown');
          io.unobserve(el);
          // Drop the delay afterwards so hover transitions stay snappy.
          window.setTimeout(() => el.style.removeProperty('--reveal-delay'), 1200);
        }
      },
      // Fire when the element's top passes ~90% of the viewport height.
      { rootMargin: '0px 0px -10% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
