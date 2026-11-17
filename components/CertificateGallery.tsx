'use client';

import { useEffect, useRef, useState } from 'react';
import type { Certificate } from '@/content/site';
import styles from './CertificateGallery.module.css';

interface Props {
  items: Certificate[];
  /** Show the issuer filter (full page) or a compact strip (home preview). */
  filters?: boolean;
  limit?: number;
}

/** Certificate cards with an issuer filter and a full-size viewer (native <dialog>). */
export default function CertificateGallery({ items, filters = true, limit }: Props) {
  const issuers = ['All', ...Array.from(new Set(items.map((c) => c.issuer)))];
  const [issuer, setIssuer] = useState('All');
  const [open, setOpen] = useState<Certificate | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const shown = items.filter((c) => issuer === 'All' || c.issuer === issuer).slice(0, limit);

  return (
    <>
      {filters && (
        <div className={styles.filters} role="group" aria-label="Filter certificates by issuer">
          {issuers.map((name) => {
            const count = name === 'All' ? items.length : items.filter((c) => c.issuer === name).length;
            return (
              <button
                key={name}
                type="button"
                className={styles.chip}
                aria-pressed={issuer === name}
                onClick={() => setIssuer(name)}
              >
                {name} <span>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.grid}>
        {shown.map((c) => (
          <article key={c.title} className={styles.card}>
            <button type="button" className={styles.thumb} onClick={() => setOpen(c)} aria-label={`View ${c.title} certificate`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" />
              <span className={styles.zoom} aria-hidden="true">
                View
              </span>
            </button>
            <div className={styles.body}>
              <span className={styles.issuer}>{c.issuer}</span>
              <h3>{c.title}</h3>
              {c.course && <p className={styles.course}>{c.course}</p>}
              <p className={styles.date}>Issued {c.issued}</p>
              <div className={styles.actions}>
                {c.verify && (
                  <a href={c.verify} target="_blank" rel="noopener noreferrer">
                    Verify ↗
                  </a>
                )}
                <a href={c.file} target="_blank" rel="noopener noreferrer">
                  {c.file.endsWith('.pdf') ? 'PDF ↗' : 'Full size ↗'}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
      >
        {open && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.image} alt={`${open.title} certificate`} />
            <figcaption>
              <span>
                <strong>{open.title}</strong> · {open.issuer} · {open.issued}
              </span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close">
                ✕
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
