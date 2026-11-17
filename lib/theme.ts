/**
 * Visual themes. One is picked at random on every full page load (never the
 * same one twice in a row) and shared by every animated surface: the banner
 * constellation, the portrait halo/orbit, the page transition and accent
 * colours in CSS. Client-side navigation keeps the same theme; a reload
 * picks a new one.
 */
export type RGB = [number, number, number];

export interface Theme {
  name: string;
  /** Cluster colours for the constellation (also used by the portrait orbit). */
  palette: string[];
  /** Page-transition colours: base cell → glowing edge. */
  transition: { low: RGB; high: RGB };
  /** CSS accents: [primary, secondary, tertiary] used for dots, links and the band hairline. */
  accents: [string, string, string];
}

export const BAND_BG = '#07060f';

export const THEMES: Theme[] = [
  {
    name: 'spectrum',
    palette: ['#8b7bf0', '#f2683f', '#21b3a0', '#4d8df0', '#e8a33d', '#8fbf4a', '#d46fb0'],
    transition: { low: [18, 15, 36], high: [139, 123, 240] },
    accents: ['#21b3a0', '#8b7bf0', '#f2683f'],
  },
  {
    name: 'abyss',
    palette: ['#21b3a0', '#4fd8c6', '#4d8df0', '#2f6fd6', '#8be0d4', '#3aa6b9'],
    transition: { low: [7, 12, 24], high: [54, 150, 138] },
    accents: ['#4fd8c6', '#4d8df0', '#8be0d4'],
  },
  {
    name: 'ember',
    palette: ['#f2683f', '#ff9b78', '#e8a33d', '#d46fb0', '#ffcf8a', '#c44f3a'],
    transition: { low: [20, 9, 12], high: [196, 96, 58] },
    accents: ['#ff9b78', '#e8a33d', '#d46fb0'],
  },
  {
    name: 'violet',
    palette: ['#8b7bf0', '#b6a8ff', '#d46fb0', '#4d8df0', '#6a5ad8', '#e0b3ff'],
    transition: { low: [14, 10, 30], high: [140, 118, 226] },
    accents: ['#b6a8ff', '#d46fb0', '#4d8df0'],
  },
  {
    name: 'moss',
    palette: ['#8fbf4a', '#b5d86a', '#21b3a0', '#d6e07a', '#4fd8c6', '#5f9a3a'],
    transition: { low: [8, 16, 14], high: [122, 168, 74] },
    accents: ['#8fbf4a', '#4fd8c6', '#d6e07a'],
  },
  {
    name: 'steel',
    palette: ['#4d8df0', '#96b6e6', '#6fa8ff', '#21b3a0', '#b6a8ff', '#2f6fd6'],
    transition: { low: [9, 13, 24], high: [96, 150, 214] },
    accents: ['#6fa8ff', '#96b6e6', '#21b3a0'],
  },
  {
    name: 'amber',
    palette: ['#e8a33d', '#ffd27a', '#d99320', '#f2683f', '#8fbf4a', '#ffb45c'],
    transition: { low: [18, 13, 8], high: [212, 156, 52] },
    accents: ['#ffd27a', '#e8a33d', '#f2683f'],
  },
];

const STORAGE_KEY = 'site-theme-last';
let current: Theme | null = null;

/** Theme for this page load. Safe to call from any client effect. */
export function getTheme(): Theme {
  if (current) return current;
  if (typeof window === 'undefined') return THEMES[0];
  let last = -1;
  try {
    last = Number(sessionStorage.getItem(STORAGE_KEY) ?? -1);
  } catch {
    /* storage unavailable: any theme is fine */
  }
  let index = Math.floor(Math.random() * THEMES.length);
  if (index === last) index = (index + 1 + Math.floor(Math.random() * (THEMES.length - 1))) % THEMES.length;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    /* ignore */
  }
  current = THEMES[index];
  return current;
}
