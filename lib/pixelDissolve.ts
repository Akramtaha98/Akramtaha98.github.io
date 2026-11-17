/**
 * Full-screen pixel-dissolve wipe. A per-cell threshold field mixes
 * distance-from-origin (so the wipe radiates from the click point), two
 * octaves of value noise (organic edge) and per-cell jitter (grain).
 * Sweeping a threshold over that field covers or uncovers the screen; cells
 * near the threshold glow toward the highlight colour.
 */
import { latticeHash, valueNoise } from './random';
import { getTheme } from './theme';

const CELL = 13; // CSS px per dissolve cell

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export class PixelDissolve {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly buffer = document.createElement('canvas');
  private readonly bctx = this.buffer.getContext('2d')!;
  private cols = 0;
  private rows = 0;
  private field = new Float32Array(0);
  private texture = new Float32Array(0);
  private image: ImageData | null = null;
  private raf = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  /** Rebuild the threshold field. (ox, oy) is the origin in 0–1 viewport units. */
  prepare(ox: number, oy: number, seed = Math.floor(Math.random() * 9999)) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    Object.assign(this.canvas, { width: w, height: h });
    this.cols = Math.max(2, Math.ceil(w / CELL));
    this.rows = Math.max(2, Math.ceil(h / CELL));
    const n = this.cols * this.rows;
    this.field = new Float32Array(n);
    this.texture = new Float32Array(n);
    this.buffer.width = this.cols;
    this.buffer.height = this.rows;
    this.image = this.bctx.createImageData(this.cols, this.rows);

    const px = ox * this.cols;
    const py = oy * this.rows;
    const maxD = Math.hypot(Math.max(px, this.cols - px), Math.max(py, this.rows - py)) || 1;
    let lo = Infinity;
    let hi = -Infinity;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const i = y * this.cols + x;
        const noise = 0.65 * valueNoise(0.075 * x, 0.075 * y, seed) + 0.35 * valueNoise(0.19 * x, 0.19 * y, seed + 7);
        const v = 0.52 * (Math.hypot(x - px, y - py) / maxD) + 0.36 * noise + 0.12 * latticeHash(x, y, seed + 31);
        this.field[i] = v;
        this.texture[i] = noise;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    const range = Math.max(1e-4, hi - lo);
    for (let i = 0; i < n; i++) this.field[i] = (this.field[i] - lo) / range;
  }

  /**
   * Paint one frame. mode 'cover' fills cells with field ≤ t; 'reveal' keeps
   * cells with field > t (so increasing t uncovers the page).
   */
  paint(t: number, mode: 'cover' | 'reveal') {
    if (!this.image) return;
    const { low, high } = getTheme().transition;
    const px = this.image.data;
    for (let i = 0; i < this.field.length; i++) {
      const v = this.field[i];
      const o = i * 4;
      const filled = mode === 'cover' ? v <= t : v > t;
      if (!filled) {
        px[o + 3] = 0;
        continue;
      }
      const edge = 1 - Math.max(0, Math.min(1, 3.4 * Math.abs(t - v)));
      const mix = Math.min(1.3, 0.05 + 0.1 * this.texture[i] + edge * edge * 1.2);
      px[o] = Math.min(255, low[0] + (high[0] - low[0]) * mix);
      px[o + 1] = Math.min(255, low[1] + (high[1] - low[1]) * mix);
      px[o + 2] = Math.min(255, low[2] + (high[2] - low[2]) * mix);
      px[o + 3] = 255;
    }
    this.bctx.putImageData(this.image, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);
  }

  animate(durationMs: number, mode: 'cover' | 'reveal', onDone?: () => void) {
    this.stop();
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      this.paint(easeInOutQuad(p), mode);
      if (p < 1) this.raf = requestAnimationFrame(tick);
      else {
        this.raf = 0;
        onDone?.();
      }
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}
