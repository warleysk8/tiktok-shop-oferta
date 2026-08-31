'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ProofShots from './ProofShots';
import { TESTIMONIALS, type ProofShot } from './funnel-config';

/**
 * Carrossel de depoimentos da landing: prints e um vídeo no mesmo trilho.
 * Usa scroll-snap nativo — arrasta no dedo sem biblioteca nenhuma. As setas
 * existem só para quem está no desktop e não pensa em arrastar.
 */
type Props = {
  shots: ProofShot[];
  label: string;
  /** Uso no hero: botão que começa o funil. */
  onStart?: () => void;
  /** Uso na página final: link direto pro checkout no rodapé do carrossel. */
  cta?: { label: string; href: string; onClick?: () => void };
  /** true = o vídeo abre o carrossel (prova em vídeo primeiro). */
  videoFirst?: boolean;
};

export default function Testimonials({ onStart, shots, label, cta, videoFirst }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft < 8);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
  }, []);

  useEffect(syncArrows, [syncArrows]);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.tm-card');
    const step = card ? card.getBoundingClientRect().width + 14 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  /* Monta o trilho: vídeo primeiro (videoFirst) ou intercalado entre os prints. */
  const cards = shots.map((shot) => ({ kind: 'shot' as const, shot }));
  const videoPos = videoFirst ? 0 : TESTIMONIALS.video.after;
  const items: Array<{ kind: 'shot'; shot: ProofShot } | { kind: 'video' }> = [
    ...cards.slice(0, videoPos),
    { kind: 'video' },
    ...cards.slice(videoPos),
  ];

  return (
    <section className="testimonials" aria-label="Depoimentos">
      <div className="tm-head">
        <div>
          <span className="tm-label">{label}</span>
          <h2>{TESTIMONIALS.title}</h2>
          <p>{TESTIMONIALS.lead}</p>
        </div>
        <div className="tm-arrows">
          <button type="button" onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Anterior">←</button>
          <button type="button" onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Próximo">→</button>
        </div>
      </div>

      <div className="tm-track" ref={trackRef} onScroll={syncArrows}>
        {items.map((item) =>
          item.kind === 'video' ? (
            <div className="tm-card tm-card-video" key="video">
              {/* #t=0.5 faz o navegador exibir um quadro real em vez de tela preta. */}
              <video
                src={`${TESTIMONIALS.video.src}#t=0.5`}
                controls
                playsInline
                preload="metadata"
              />
              <p className="tm-caption">{TESTIMONIALS.video.caption}</p>
            </div>
          ) : (
            <div className="tm-card" key={item.shot.id}>
              <ProofShots shots={[item.shot]} variant="card" />
              <p className="tm-caption">{item.shot.claim}</p>
            </div>
          ),
        )}
      </div>

      <div className="tm-foot">
        {cta ? (
          <a className="primary-button" href={cta.href} onClick={cta.onClick}>
            {cta.label} <span aria-hidden="true">→</span>
          </a>
        ) : (
          <button className="primary-button" onClick={onStart}>
            {TESTIMONIALS.cta} <span aria-hidden="true">→</span>
          </button>
        )}
        {TESTIMONIALS.ctaNote && <small className="cta-note">{TESTIMONIALS.ctaNote}</small>}
      </div>
    </section>
  );
}
