'use client';

import { useEffect, useRef } from 'react';
import { Constellation } from '@/lib/constellation';

/** Absolutely-positioned canvas that fills the closest `.dark-band` parent. */
export default function ConstellationField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const band = (host.closest('[data-dark-band]') as HTMLElement | null) ?? host;
    const engine = new Constellation(host, canvasRef.current!, { interactionTarget: band });
    engine.start();
    return () => engine.destroy();
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--band)' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
