'use client';

import { useEffect, useState } from 'react';
import type { ProofShot } from './funnel-config';

type Props = {
  shots: ProofShot[];
  /** grid = bloco do resultado · single = tela do quiz · card = carrossel */
  variant: 'grid' | 'single' | 'card';
};

/**
 * Prints de conversa com alunos. A miniatura é ilegível de propósito — ela
 * funciona como sinal de prova; quem quiser ler abre no lightbox.
 */
export default function ProofShots({ shots, variant }: Props) {
  const [open, setOpen] = useState<ProofShot | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className={`proof-shots proof-${variant}`}>
        {shots.map((shot) => (
          <button
            key={shot.id}
            type="button"
            className="proof-shot"
            onClick={() => setOpen(shot)}
            aria-label={`Ampliar print: ${shot.claim}`}
          >
            {/* <img> puro: os prints já saem otimizados (~120 KB) e o alvo de
                deploy não garante o otimizador do next/image. */}
            <img src={shot.src} alt={shot.alt} loading={variant === 'single' ? 'eager' : 'lazy'} />
            {variant === 'grid' && (
              <span className="proof-caption">
                <b>{shot.claim}</b>
                <small>{shot.kills}</small>
              </span>
            )}
          </button>
        ))}
      </div>

      {open && (
        <div className="proof-lightbox" role="dialog" aria-modal="true" aria-label={open.claim}>
          <button type="button" className="proof-backdrop" onClick={() => setOpen(null)} aria-label="Fechar" />
          <figure>
            <img src={open.src} alt={open.alt} />
            <figcaption>{open.claim}</figcaption>
          </figure>
          <button type="button" className="proof-close" onClick={() => setOpen(null)} aria-label="Fechar">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
