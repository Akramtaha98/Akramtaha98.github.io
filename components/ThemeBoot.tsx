'use client';

import { useEffect } from 'react';
import { getTheme } from '@/lib/theme';

/** Applies the per-load theme's accent colours as CSS variables on <html>. */
export default function ThemeBoot() {
  useEffect(() => {
    const theme = getTheme();
    const root = document.documentElement;
    root.dataset.theme = theme.name;
    theme.accents.forEach((c, i) => root.style.setProperty(`--accent-${i + 1}`, c));
  }, []);
  return null;
}
