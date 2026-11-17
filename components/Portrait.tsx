'use client';

import { useEffect, useRef } from 'react';
import { startOrbit } from '@/lib/orbit';
import styles from './Portrait.module.css';

interface PortraitProps {
  src: string;
  alt: string;
}

/** Circular portrait with a spinning conic halo and an orbiting particle ring. */
export default function Portrait({ src, alt }: PortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => startOrbit(canvasRef.current!), []);

  return (
    <div className={styles.portrait}>
      <span className={styles.halo} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.orbit} aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.face} src={src} alt={alt} />
    </div>
  );
}
