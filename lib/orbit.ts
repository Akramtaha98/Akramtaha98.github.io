/**
 * Orbiting particle halo drawn around a circular portrait. Particles ride a
 * ring at 40% of the canvas' short side, breathe radially, and connect to
 * neighbours closer than LINK_DIST with faint white lines.
 */
import { prefersReducedMotion } from './random';
import { getTheme } from './theme';

const colors = () => getTheme().palette;
const PER_COLOR = 9;
const LINK_DIST = 46;

interface Mote {
  angle: number;
  radius: number;
  speed: number;
  color: string;
  size: number;
  phase: number;
}

export function startOrbit(canvas: HTMLCanvasElement): () => void {
  const reduced = prefersReducedMotion();
  let raf = 0;
  let w = 0;
  let h = 0;
  let ctx: CanvasRenderingContext2D;
  let motes: Mote[] = [];

  const setup = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ring = 0.4 * Math.min(w, h);
    motes = Array.from({ length: colors().length * PER_COLOR }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      radius: ring + (Math.random() - 0.2) * 22,
      speed: (0.0016 + 0.0022 * Math.random()) * (Math.random() < 0.5 ? 1 : -1),
      color: colors()[i % colors().length],
      size: 1.2 + 1.6 * Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));
  };

  const draw = (time: number) => {
    ctx.clearRect(0, 0, w, h);
    const pts = motes.map((m) => {
      const r = m.radius + 7 * Math.sin(0.001 * time + m.phase);
      return { x: w / 2 + Math.cos(m.angle) * r, y: h / 2 + Math.sin(m.angle) * r, m };
    });
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d >= LINK_DIST) continue;
        ctx.strokeStyle = `rgba(255,255,255,${0.16 * (1 - d / LINK_DIST)})`;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 0.9;
    for (const p of pts) {
      ctx.fillStyle = p.m.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.m.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const loop = (time: number) => {
    for (const m of motes) m.angle += m.speed;
    draw(time);
    raf = requestAnimationFrame(loop);
  };

  const onResize = () => {
    setup();
    if (reduced) draw(0);
  };

  setup();
  if (reduced) draw(0);
  else raf = requestAnimationFrame(loop);
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
  };
}
