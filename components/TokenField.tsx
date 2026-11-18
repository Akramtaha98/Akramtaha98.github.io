'use client';

import { useEffect, useRef } from 'react';

/**
 * A quiet grid of dots behind the hero. Wherever the query goes (the
 * pointer, or an automatic probe when there is no pointer), nearby dots
 * resolve into Latin and Arabic letters and lean toward it, like tokens
 * pulled out of an embedding space. A tap sends a "re-retrieval" ripple that
 * reshuffles the letters it passes.
 */

const CELL = 30;
const RADIUS = 140;
const LATIN = 'abcdefghijklmnopqrstuvwxyz';
const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
const POINTER_IDLE_MS = 2500;

const pick = () => {
  const pool = Math.random() < 0.45 ? ARABIC : LATIN;
  return pool[Math.floor(Math.random() * pool.length)];
};

interface Ripple {
  x: number;
  y: number;
  born: number;
}

export default function TokenField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const host = canvas.parentElement!;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let glyphs: string[] = [];
    let flash = new Float32Array(0);
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -1e4, y: -1e4, at: -1e4 };
    const probe = { x: 0, y: 0 };
    const ripples: Ripple[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      glyphs = Array.from({ length: cols * rows }, pick);
      flash = new Float32Array(cols * rows);
      if (!running) draw(performance.now());
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // The query point: live pointer if recent, otherwise a looping probe.
      const live = t - pointer.at < POINTER_IDLE_MS;
      probe.x = w * (0.62 + 0.3 * Math.sin(t * 0.00021)) ;
      probe.y = h * (0.5 + 0.38 * Math.sin(t * 0.00033 + 1.3));
      const qx = live ? pointer.x : probe.x;
      const qy = live ? pointer.y : probe.y;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = c * CELL + CELL / 2;
          const y = r * CELL + CELL / 2;
          const d = Math.hypot(x - qx, y - qy);
          let s = d < RADIUS ? (1 - d / RADIUS) ** 2 : 0;

          // Ripple fronts flash the cells they pass and reshuffle them.
          for (const rp of ripples) {
            const front = (t - rp.born) * 0.55;
            const gap = Math.abs(Math.hypot(x - rp.x, y - rp.y) - front);
            if (gap < 18) {
              if (flash[i] < 0.5) glyphs[i] = pick();
              flash[i] = 1;
            }
          }
          if (flash[i] > 0) {
            s = Math.max(s, flash[i] * 0.8);
            flash[i] = Math.max(0, flash[i] - 0.03);
          }

          // A slow diagonal shimmer keeps the field alive.
          const wave = Math.max(0, Math.sin(t * 0.0007 - (x + y) * 0.011));
          if (s < 0.04) {
            ctx.globalAlpha = 0.14 + 0.12 * wave;
            ctx.fillStyle = '#5b6478';
            ctx.fillRect(x - 1, y - 1, 2, 2);
            continue;
          }
          const pull = 7 * s;
          const ang = Math.atan2(qy - y, qx - x);
          ctx.globalAlpha = Math.min(0.75, 0.18 + 0.62 * s);
          ctx.fillStyle = s > 0.45 ? '#2747d9' : '#5b6478';
          ctx.font = `500 ${Math.round(11 + 10 * s)}px "IBM Plex Sans", "IBM Plex Sans Arabic", sans-serif`;
          ctx.fillText(glyphs[i], x + Math.cos(ang) * pull, y + Math.sin(ang) * pull);
        }
      }
      ctx.globalAlpha = 1;
      for (let k = ripples.length - 1; k >= 0; k--) if (t - ripples[k].born > 2600) ripples.splice(k, 1);
    };

    const frame = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      const go = visible && !document.hidden && !reduced;
      if (go && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!go && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const [x, y] = local(e);
      Object.assign(pointer, { x, y, at: performance.now() });
    };
    const onLeave = () => (pointer.at = -1e4);
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest?.('a,button,input,[role="button"]')) return;
      const [x, y] = local(e);
      ripples.push({ x, y, born: performance.now() });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);
    document.addEventListener('visibilitychange', sync);
    resize();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="token-field" />;
}
