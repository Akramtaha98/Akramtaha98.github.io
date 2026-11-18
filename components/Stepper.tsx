'use client';

import { useEffect, useRef, useState } from 'react';
import { A } from './doc';
import styles from './Stepper.module.css';

interface Step {
  label: string;
  status: string;
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
}

const DWELL_MS = 6000;

/**
 * The three studies as an auto-advancing sequence. Each step owns a progress
 * bar; when it fills, the next step becomes current, looping back to the
 * first. Pointing at, focusing or clicking a step makes it current and holds
 * the loop there until the pointer or focus leaves.
 */
export default function Stepper({ steps }: { steps: Step[] }) {
  const [current, setCurrent] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [auto, setAuto] = useState(false);
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setAuto(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  const running = auto && onScreen && !held;
  const next = () => setCurrent((c) => (c + 1) % steps.length);

  return (
    <ol
      ref={rootRef}
      className={styles.steps}
      data-auto={auto ? '1' : undefined}
      onPointerLeave={() => setHeld(false)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
      }}
    >
      {steps.map((s, i) => {
        const state = i === current ? 'current' : i < current ? 'done' : 'next';
        return (
          <li
            key={s.label}
            className={styles.step}
            data-state={state}
            aria-current={i === current ? 'step' : undefined}
            onPointerEnter={() => {
              setCurrent(i);
              setHeld(true);
            }}
            onFocusCapture={() => {
              setCurrent(i);
              setHeld(true);
            }}
            onClick={() => {
              setCurrent(i);
              setHeld(true);
            }}
          >
            <span className={styles.track} aria-hidden="true">
              <span
                // Re-mount the fill whenever this step becomes current so it restarts from zero.
                key={i === current ? `run-${current}` : 'idle'}
                className={styles.fill}
                style={{
                  animationDuration: `${DWELL_MS}ms`,
                  animationPlayState: running ? 'running' : 'paused',
                }}
                onAnimationEnd={i === current ? next : undefined}
              />
            </span>
            <span className={styles.no} aria-hidden="true">
              {i + 1}
            </span>
            <p className={styles.label}>
              {s.label}
              <span>{s.status}</span>
            </p>
            <h3>{s.title}</h3>
            <p className={styles.text}>{s.summary}</p>
            <A href={s.href} className="link">
              {s.linkLabel}
            </A>
          </li>
        );
      })}
    </ol>
  );
}
