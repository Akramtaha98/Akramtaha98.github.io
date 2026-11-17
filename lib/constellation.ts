/**
 * Constellation field: a 3D point cloud of coloured clusters, rendered with a
 * perspective camera onto a 2D canvas. "Signals" hop between nearest
 * neighbours leaving fading trails; the pointer adds parallax, proximity links
 * and click-to-fire signals.
 *
 * Framework-agnostic: construct with a host element + canvas, call start(),
 * and destroy() on teardown.
 */
import { createRng, gaussian, hexToRgb, prefersReducedMotion } from './random';
import { BAND_BG, getTheme } from './theme';

const FORMATIONS = ['band', 'ring', 'helix', 'scatter'] as const;
type Formation = (typeof FORMATIONS)[number];

export interface ConstellationOptions {
  /** Element that receives pointer events (usually the whole banner). */
  interactionTarget?: HTMLElement;
  /** Horizontal focus of the cloud as a fraction of width (desktop). */
  focusX?: number;
  clusters?: number;
  particles?: { desktop: number; mobile: number };
  maxSignals?: number;
}

interface Cluster {
  hex: string;
  glow: HTMLCanvasElement;
  base: [number, number, number];
  amp: [number, number, number];
  spread: [number, number, number];
  freq: number;
  phase: number;
  spin: number;
  pos: [number, number, number];
  cos: number;
  sin: number;
}

interface Signal {
  path: number[];
  seen: Set<number>;
  t: number;
  stepMs: number;
  maxLen: number;
  done: boolean;
  fade: number;
  hot: boolean;
}

interface Timed {
  i: number;
  born: number;
}

const CAMERA_DIST = 860;
const POINTER_RADIUS = 150;
const INTERACTIVE = 'a,button,input,textarea,select,label,summary,[role="button"]';

function makeGlow(hex: string, core = '#ffffff'): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const [r, gr, b] = hexToRgb(hex);
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, core);
  grad.addColorStop(0.18, `rgba(${r},${gr},${b},.85)`);
  grad.addColorStop(0.5, `rgba(${r},${gr},${b},.22)`);
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export class Constellation {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly rng = createRng((Date.now() & 0xffff) + 7);
  private readonly reduced = prefersReducedMotion();
  private readonly mobile = window.innerWidth < 760;
  private readonly n: number;
  private readonly clusters: Cluster[];
  private readonly headGlow = makeGlow('#ffd9a8', '#fffaf2');
  private readonly opts: Required<Omit<ConstellationOptions, 'interactionTarget'>>;

  // Structure-of-arrays particle state.
  private readonly owner: Uint8Array;
  private readonly off: Float32Array[]; // offset from cluster centre (x,y,z)
  private readonly pos: Float32Array[]; // world position (x,y,z)
  private readonly size: Float32Array;
  private readonly alpha: Float32Array;
  private readonly heat: Float32Array;
  private readonly bob: Float32Array;
  private readonly follow: Float32Array;
  private readonly sx: Float32Array; // projected screen x
  private readonly sy: Float32Array;
  private readonly scale: Float32Array;
  private readonly depth: Float32Array;

  private w = 0;
  private h = 0;
  private focal = 1;
  private cx = 0;
  private cy = 0;
  private clock = 0;
  private cam = { yaw: 0, pitch: -0.26, parallax: 0, parallaxGoal: 0 };
  private readonly formation: Formation;
  private readonly palette: string[];
  private readonly pitchBase: number;
  private pointer = { x: 0, y: 0, inside: false, speed: 0 };

  private signals: Signal[] = [];
  private flashes: (Timed & { nb: number[] })[] = [];
  private labels: (Timed & { text: string; hex: string })[] = [];
  private rings: (Timed & { hex: string })[] = [];
  private spawnIn = 400;
  private migrateIn = 1200;

  private raf = 0;
  private last = 0;
  private running = false;
  private visible = true;
  private cleanup: (() => void)[] = [];

  constructor(
    private readonly host: HTMLElement,
    private readonly canvas: HTMLCanvasElement,
    options: ConstellationOptions = {},
  ) {
    // Every construction randomises the structure, so each reload looks different.
    const density = 0.8 + 0.4 * this.rng();
    this.opts = {
      focusX: options.focusX ?? 0.56 + 0.1 * this.rng(),
      clusters: options.clusters ?? 4 + Math.floor(this.rng() * 4),
      particles: options.particles ?? { desktop: Math.round(820 * density), mobile: Math.round(380 * density) },
      maxSignals: options.maxSignals ?? 3 + Math.floor(this.rng() * 3),
    };
    this.formation = FORMATIONS[Math.floor(this.rng() * FORMATIONS.length)];
    this.palette = getTheme().palette;
    this.pitchBase = -0.36 + 0.22 * this.rng();
    this.cam.pitch = this.pitchBase;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.n = this.mobile ? this.opts.particles.mobile : this.opts.particles.desktop;
    this.cam.yaw = this.rng() * Math.PI * 2;

    const f32 = () => new Float32Array(this.n);
    this.owner = new Uint8Array(this.n);
    this.off = [f32(), f32(), f32()];
    this.pos = [f32(), f32(), f32()];
    [this.size, this.alpha, this.heat, this.bob, this.follow] = [f32(), f32(), f32(), f32(), f32()];
    [this.sx, this.sy, this.scale, this.depth] = [f32(), f32(), f32(), f32()];

    this.clusters = this.createClusters();
    this.seedParticles();
    this.bind(options.interactionTarget ?? host);
  }

  // ───────────────────────── setup ─────────────────────────

  /** Where cluster i of k sits in world space, per formation. */
  private clusterBase(i: number, k: number): [number, number, number] {
    const r = this.rng;
    const t = (i + 0.5) / k;
    switch (this.formation) {
      case 'ring': {
        const a = t * Math.PI * 2 + r() * 0.4;
        return [Math.cos(a) * 330, (2 * r() - 1) * 90, Math.sin(a) * 330];
      }
      case 'helix': {
        const a = t * Math.PI * 3;
        return [(t * 2 - 1) * 400, Math.sin(a) * 120, Math.cos(a) * 220];
      }
      case 'scatter':
        return [(2 * r() - 1) * 420, (2 * r() - 1) * 150, (2 * r() - 1) * 320];
      default: // 'band'
        return [(t * 2 - 1) * 387 + 40 * gaussian(r), (2 * r() - 1) * 133, (2 * r() - 1) * 280];
    }
  }

  private createClusters(): Cluster[] {
    const k = this.opts.clusters;
    const r = this.rng;
    const offset = Math.floor(r() * this.palette.length);
    return Array.from({ length: k }, (_, i) => {
      const hex = this.palette[(i + offset) % this.palette.length];
      return {
        hex,
        glow: makeGlow(hex),
        base: this.clusterBase(i, k),
        amp: [40 + 70 * r(), 20 + 35 * r(), 40 + 80 * r()],
        spread: [30 + 34 * r(), 18 + 20 * r(), 30 + 34 * r()],
        freq: 5e-5 + 6e-5 * r(),
        phase: r() * Math.PI * 2,
        spin: (r() < 0.5 ? -1 : 1) * (5e-5 + 8e-5 * r()),
        pos: [0, 0, 0],
        cos: 1,
        sin: 0,
      };
    });
  }

  /** Assign particle i to cluster c with a fresh gaussian offset (7% are outliers). */
  private assign(i: number, c: number) {
    const cl = this.clusters[c];
    const outlier = this.rng() < 0.07 ? 2.6 : 1;
    this.owner[i] = c;
    for (let a = 0; a < 3; a++) this.off[a][i] = gaussian(this.rng) * cl.spread[a] * outlier;
  }

  private seedParticles() {
    for (let i = 0; i < this.n; i++) {
      this.assign(i, (this.rng() * this.clusters.length) | 0);
      const cl = this.clusters[this.owner[i]];
      for (let a = 0; a < 3; a++) this.pos[a][i] = cl.base[a] + this.off[a][i];
      this.size[i] = 1.2 + 1.6 * this.rng();
      this.alpha[i] = 0.4 + 0.45 * this.rng();
      this.bob[i] = Math.PI * 2 * this.rng();
      this.follow[i] = 1;
    }
  }

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const rect = this.host.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.max(1, this.w * dpr);
    this.canvas.height = Math.max(1, this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.focal = Math.max(0.95 * this.w, 1.5 * this.h);
    this.cx = this.w * (this.mobile ? 0.5 : this.opts.focusX);
    this.cy = this.h * 0.5;
    if (this.reduced) this.draw();
  };

  // ───────────────────────── interaction ─────────────────────────

  private bind(target: HTMLElement) {
    const local = (e: PointerEvent) => {
      const r = this.host.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = local(e);
      const p = this.pointer;
      if (p.inside) p.speed = 0.85 * p.speed + 0.15 * Math.hypot(x - p.x, y - p.y);
      Object.assign(p, { x, y, inside: true });
      this.cam.parallaxGoal = (x / this.w - 0.5) * 0.35;
    };
    const onLeave = () => {
      this.pointer.inside = false;
      this.cam.parallaxGoal = 0;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest?.(INTERACTIVE)) return;
      const [x, y] = local(e);
      this.spawnSignal(this.nearestOnScreen(x, y), true);
    };
    const onVisibility = () => this.syncRunning();

    const ro = new ResizeObserver(this.resize);
    ro.observe(this.host);
    const io = new IntersectionObserver(
      (entries) => {
        this.visible = entries.some((en) => en.isIntersecting);
        this.syncRunning();
      },
      { threshold: 0.01 },
    );
    io.observe(this.host);

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', onLeave);
    target.addEventListener('pointerdown', onDown);
    document.addEventListener('visibilitychange', onVisibility);

    this.cleanup.push(
      () => ro.disconnect(),
      () => io.disconnect(),
      () => target.removeEventListener('pointermove', onMove),
      () => target.removeEventListener('pointerleave', onLeave),
      () => target.removeEventListener('pointerdown', onDown),
      () => document.removeEventListener('visibilitychange', onVisibility),
    );
  }

  private nearestOnScreen(x: number, y: number): number {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < this.n; i++) {
      if (!this.scale[i]) continue;
      const d = (this.sx[i] - x) ** 2 + (this.sy[i] - y) ** 2;
      if (d < bestD) [bestD, best] = [d, i];
    }
    return best;
  }

  // ───────────────────────── graph helpers ─────────────────────────

  /** k nearest particles to i in world space (insertion-sorted, O(n·k)). */
  private nearest(i: number, k: number, exclude?: Set<number>): number[] {
    const [X, Y, Z] = this.pos;
    const ids: number[] = [];
    const ds: number[] = [];
    for (let j = 0; j < this.n; j++) {
      if (j === i || exclude?.has(j)) continue;
      const d = (X[j] - X[i]) ** 2 + (Y[j] - Y[i]) ** 2 + (Z[j] - Z[i]) ** 2;
      if (ids.length < k || d < ds[ds.length - 1]) {
        let at = ds.length;
        while (at > 0 && ds[at - 1] > d) at--;
        ds.splice(at, 0, d);
        ids.splice(at, 0, j);
        if (ids.length > k) (ids.pop(), ds.pop());
      }
    }
    return ids;
  }

  private nextHop(s: Signal): number {
    const tip = s.path[s.path.length - 1];
    // 14%: jump to the closest particle of a *different* cluster (bridging).
    if (this.rng() < 0.14) {
      const [X, Y, Z] = this.pos;
      let pick = -1;
      let best = Infinity;
      for (let t = 0; t < 40; t++) {
        const j = (this.rng() * this.n) | 0;
        if (this.owner[j] === this.owner[tip] || s.seen.has(j)) continue;
        const d = (X[j] - X[tip]) ** 2 + (Y[j] - Y[tip]) ** 2 + (Z[j] - Z[tip]) ** 2;
        if (d < best) [best, pick] = [d, j];
      }
      if (pick >= 0) return pick;
    }
    const nb = this.nearest(tip, 6, s.seen);
    return nb[Math.min(nb.length - 1, (this.rng() ** 1.7 * 5) | 0)];
  }

  private vectorLabel(): string {
    const v = () => {
      const x = 0.8 * gaussian(this.rng);
      return (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);
    };
    return `[${v()} ${v()} ${v()} ${v()} …]`;
  }

  /** Light up node i, link it to its neighbours and maybe attach a label. */
  private activate(i: number, hot: boolean) {
    this.heat[i] = hot ? 1.6 : 1.15;
    const nb = this.nearest(i, 5);
    for (const j of nb) this.heat[j] = Math.max(this.heat[j], 0.5);
    this.flashes.push({ i, nb, born: this.clock });

    const inLabelZone = this.mobile ? this.sy[i] > 0.62 * this.h : this.sx[i] > this.w * 0.58;
    const onCanvas = this.sx[i] < this.w - 180 && this.sy[i] > 24 && this.sy[i] < this.h - 12;
    const spaced = this.labels.every(
      (l) => Math.abs(this.sy[l.i] - this.sy[i]) > 36 || Math.abs(this.sx[l.i] - this.sx[i]) > 190,
    );
    if (inLabelZone && onCanvas && spaced && this.labels.length < 2 && this.rng() < 0.22) {
      this.labels.push({ i, text: this.vectorLabel(), hex: this.clusters[this.owner[i]].hex, born: this.clock });
    }
  }

  private spawnSignal(start?: number, hot = false) {
    if (!hot && this.signals.filter((s) => !s.done).length >= this.opts.maxSignals) return;
    if (start == null) {
      // Prefer starting points in the visible right-hand side of the banner.
      for (let t = 0; t < 30 && start == null; t++) {
        const j = (this.rng() * this.n) | 0;
        const x = this.sx[j];
        const y = this.sy[j];
        if (x > this.w * (this.mobile ? 0.05 : 0.32) && x < 0.97 * this.w && y > 0.08 * this.h && y < 0.92 * this.h) start = j;
      }
      start ??= (this.rng() * this.n) | 0;
    }
    const s: Signal = {
      path: [start],
      seen: new Set([start]),
      t: 0,
      stepMs: hot ? 170 : 230 + 120 * this.rng(),
      maxLen: hot ? 16 + ((8 * this.rng()) | 0) : 7 + ((10 * this.rng()) | 0),
      done: false,
      fade: 1,
      hot,
    };
    this.activate(start, hot);
    const next = this.nextHop(s);
    s.path.push(next);
    s.seen.add(next);
    this.signals.push(s);
  }

  // ───────────────────────── simulation ─────────────────────────

  private project() {
    const { yaw, parallax, pitch } = this.cam;
    const cy = Math.cos(yaw + parallax);
    const sy = Math.sin(yaw + parallax);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const [X, Y, Z] = this.pos;
    for (let i = 0; i < this.n; i++) {
      const x = X[i] * cy + Z[i] * sy;
      const z0 = -X[i] * sy + Z[i] * cy;
      const y = Y[i] * cp - z0 * sp;
      const z = Y[i] * sp + z0 * cp + CAMERA_DIST;
      const k = z > 60 ? this.focal / z : 0;
      this.sx[i] = this.cx + x * k;
      this.sy[i] = this.cy + y * k;
      this.scale[i] = (CAMERA_DIST * k) / this.focal;
      this.depth[i] = z;
    }
  }

  private step(dt: number) {
    this.clock += dt;
    const T = this.clock;
    const cam = this.cam;
    cam.yaw += 32e-6 * dt;
    cam.pitch = this.pitchBase + 0.07 * Math.sin(4e-5 * T);
    cam.parallax += (cam.parallaxGoal - cam.parallax) * Math.min(1, 0.003 * dt);

    for (const c of this.clusters) {
      c.pos[0] = c.base[0] + c.amp[0] * Math.sin(T * c.freq + c.phase);
      c.pos[1] = c.base[1] + c.amp[1] * Math.sin(T * c.freq * 1.3 + 2 * c.phase);
      c.pos[2] = c.base[2] + c.amp[2] * Math.cos(T * c.freq * 0.9 + c.phase);
      c.cos = Math.cos(T * c.spin);
      c.sin = Math.sin(T * c.spin);
    }

    // Particles ease toward their (rotating) slot in the owning cluster.
    const ease = 1 - Math.exp(-0.0022 * dt);
    const cool = Math.exp(-dt / 420);
    const [X, Y, Z] = this.pos;
    const [OX, OY, OZ] = this.off;
    for (let i = 0; i < this.n; i++) {
      const c = this.clusters[this.owner[i]];
      const tx = c.pos[0] + OX[i] * c.cos - OZ[i] * c.sin;
      const ty = c.pos[1] + OY[i] + 5 * Math.sin(8e-4 * T + this.bob[i]);
      const tz = c.pos[2] + OX[i] * c.sin + OZ[i] * c.cos;
      const k = ease * this.follow[i];
      X[i] += (tx - X[i]) * k;
      Y[i] += (ty - Y[i]) * k;
      Z[i] += (tz - Z[i]) * k;
      if (this.follow[i] < 1) this.follow[i] = Math.min(1, this.follow[i] + 14e-5 * dt);
      this.heat[i] *= cool;
    }

    // Occasionally migrate one particle to another cluster (slow drift across).
    if ((this.migrateIn -= dt) <= 0) {
      this.migrateIn = 700 + 600 * this.rng();
      const i = (this.rng() * this.n) | 0;
      const k = this.clusters.length;
      this.assign(i, (this.owner[i] + 1 + ((this.rng() * (k - 1)) | 0)) % k);
      this.follow[i] = 0.06;
    }

    // Pointer speed accelerates spawning.
    this.spawnIn -= dt * (1 + Math.min(4, 0.05 * this.pointer.speed));
    if (this.spawnIn <= 0) {
      this.spawnSignal();
      this.spawnIn = 600 + 900 * this.rng();
    }
    this.pointer.speed *= Math.exp(-dt / 300);

    for (const s of this.signals) {
      if (s.done) {
        s.fade -= dt / 1400;
        continue;
      }
      s.t += dt / s.stepMs;
      while (s.t >= 1 && !s.done) {
        s.t -= 1;
        const tip = s.path[s.path.length - 1];
        this.activate(tip, s.hot);
        if (s.path.length >= s.maxLen) {
          s.done = true;
          this.rings.push({ i: tip, born: T, hex: this.clusters[this.owner[tip]].hex });
        } else {
          const nx = this.nextHop(s);
          s.path.push(nx);
          s.seen.add(nx);
        }
      }
    }

    this.signals = this.signals.filter((s) => s.fade > 0);
    this.flashes = this.flashes.filter((f) => T - f.born <= 1000);
    this.labels = this.labels.filter((l) => T - l.born <= 2800);
    this.rings = this.rings.filter((r) => T - r.born <= 1300);
  }

  // ───────────────────────── rendering ─────────────────────────

  private draw() {
    const g = this.ctx;
    const T = this.clock;
    this.project();

    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
    g.fillStyle = BAND_BG;
    g.fillRect(0, 0, this.w, this.h);
    g.globalCompositeOperation = 'lighter';

    // 1. Soft nebula glow per cluster.
    const { yaw, parallax, pitch } = this.cam;
    const cy = Math.cos(yaw + parallax);
    const sy = Math.sin(yaw + parallax);
    for (const c of this.clusters) {
      const x = c.pos[0] * cy + c.pos[2] * sy;
      const z0 = -c.pos[0] * sy + c.pos[2] * cy;
      const y = c.pos[1] * Math.cos(pitch) - z0 * Math.sin(pitch);
      const z = c.pos[1] * Math.sin(pitch) + z0 * Math.cos(pitch);
      const k = this.focal / (z + CAMERA_DIST);
      const r = (c.spread[0] + c.spread[2]) * 1.5 * k;
      g.globalAlpha = 0.3;
      g.drawImage(c.glow, this.cx + x * k - r, this.cy + y * k - r, 2 * r, 2 * r);
    }

    // 2. Particles (square pixels) + glow when heated. Batched by colour.
    this.clusters.forEach((c, ci) => {
      g.fillStyle = c.hex;
      for (let i = 0; i < this.n; i++) {
        if (this.owner[i] !== ci || !this.scale[i]) continue;
        const fog = Math.max(0.3, Math.min(1, 1.45 - this.depth[i] / 1400));
        const heat = Math.min(1.6, this.heat[i]);
        const s = this.size[i] * this.scale[i] * (1 + 0.9 * heat);
        g.globalAlpha = Math.min(1, this.alpha[i] * fog + 0.55 * heat);
        g.fillRect(this.sx[i] - s / 2, this.sy[i] - s / 2, s, s);
        if (heat > 0.12) {
          const gs = s * (4 + 5 * heat);
          g.globalAlpha = Math.min(0.9, 0.55 * heat);
          g.drawImage(c.glow, this.sx[i] - gs / 2, this.sy[i] - gs / 2, gs, gs);
        }
      }
    });

    // 3. Neighbour flashes.
    g.lineWidth = 0.7;
    for (const f of this.flashes) {
      g.strokeStyle = this.clusters[this.owner[f.i]].hex;
      g.globalAlpha = 0.6 * (1 - (T - f.born) / 1000);
      g.beginPath();
      for (const j of f.nb) {
        g.moveTo(this.sx[f.i], this.sy[f.i]);
        g.lineTo(this.sx[j], this.sy[j]);
      }
      g.stroke();
    }

    // 4. Signal trails (newest segment interpolated) + glowing head.
    for (const s of this.signals) {
      const last = s.done ? s.path.length - 1 : s.path.length - 2;
      for (let back = 0; back <= last; back++) {
        const a = s.path[last - back];
        const b = s.path[last - back + 1];
        if (b == null) continue;
        const age = back / 7;
        if (age > 1) break;
        const live = !s.done && back === 0;
        const ex = live ? this.sx[a] + (this.sx[b] - this.sx[a]) * s.t : this.sx[b];
        const ey = live ? this.sy[a] + (this.sy[b] - this.sy[a]) * s.t : this.sy[b];
        g.globalAlpha = (1 - age) ** 1.4 * s.fade;
        g.strokeStyle = this.clusters[this.owner[a]].hex;
        g.lineWidth = (s.hot ? 2.2 : 1.6) * (1 - 0.5 * age);
        g.beginPath();
        g.moveTo(this.sx[a], this.sy[a]);
        g.lineTo(ex, ey);
        g.stroke();
      }
      if (!s.done) {
        const a = s.path[s.path.length - 2];
        const b = s.path[s.path.length - 1];
        const hx = this.sx[a] + (this.sx[b] - this.sx[a]) * s.t;
        const hy = this.sy[a] + (this.sy[b] - this.sy[a]) * s.t;
        const r = s.hot ? 34 : 24;
        g.globalAlpha = 0.95;
        g.drawImage(this.headGlow, hx - r / 2, hy - r / 2, r, r);
      }
    }

    // 5. Arrival rings.
    g.lineWidth = 1.2;
    for (const r of this.rings) {
      const t = (T - r.born) / 1300;
      g.globalAlpha = (1 - t) * 0.7;
      g.strokeStyle = r.hex;
      g.beginPath();
      g.arc(this.sx[r.i], this.sy[r.i], 3 + 34 * t, 0, Math.PI * 2);
      g.stroke();
    }

    // 6. Pointer proximity links.
    const p = this.pointer;
    if (p.inside) {
      const near: { i: number; d: number }[] = [];
      for (let i = 0; i < this.n; i++) {
        const d = Math.hypot(this.sx[i] - p.x, this.sy[i] - p.y);
        if (d < POINTER_RADIUS) {
          near.push({ i, d });
          this.heat[i] = Math.max(this.heat[i], 0.35 * (1 - d / POINTER_RADIUS));
        }
      }
      near.sort((a, b) => a.d - b.d);
      g.lineWidth = 0.6;
      for (const { i, d } of near.slice(0, 7)) {
        g.globalAlpha = (1 - d / POINTER_RADIUS) * 0.4;
        g.strokeStyle = this.clusters[this.owner[i]].hex;
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(this.sx[i], this.sy[i]);
        g.stroke();
      }
    }

    // 7. Embedding-vector labels.
    g.globalCompositeOperation = 'source-over';
    g.font = "500 10px 'JetBrains Mono', ui-monospace, monospace";
    for (const l of this.labels) {
      const age = T - l.born;
      g.globalAlpha = Math.min(1, age / 320) * Math.min(1, (2800 - age) / 800) * 0.8;
      g.fillStyle = l.hex;
      g.fillText(l.text, this.sx[l.i] + 9, this.sy[l.i] - 7);
    }
    g.globalAlpha = 1;
  }

  // ───────────────────────── loop ─────────────────────────

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(50, now - (this.last || now));
    this.last = now;
    this.step(dt);
    this.draw();
  };

  private syncRunning() {
    const shouldRun = this.visible && !document.hidden && !this.reduced;
    if (shouldRun && !this.running) {
      this.running = true;
      this.last = 0;
      this.raf = requestAnimationFrame(this.frame);
    } else if (!shouldRun && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  start() {
    this.resize();
    this.project();
    // Pre-roll so the first painted frame already looks "alive".
    const warmup = this.reduced ? 260 : 30;
    for (let i = 0; i < warmup; i++) this.step(16);
    this.draw();
    this.syncRunning();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.cleanup.forEach((fn) => fn());
  }
}
