'use client';

import { useRef, useState } from 'react';

type Props = {
  src: string;
  tag: string;
  title: string;
  body: string;
  cta?: string;
  unlockAfter?: number;
  onContinue?: () => void;
  variant?: 'interstitial' | 'inline';
};

/**
 * Player de depoimento usado tanto nos intersticiais do quiz quanto na
 * página de resultado. O botão de avanço só ganha destaque depois de
 * `unlockAfter` segundos assistidos — mas o link de pular fica sempre
 * disponível, porque prender o usuário na tela derruba a conclusão.
 */
export default function VideoStep({
  src,
  tag,
  title,
  body,
  cta = 'Continuar',
  unlockAfter = 10,
  onContinue,
  variant = 'interstitial',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [watched, setWatched] = useState(0);
  const [muted, setMuted] = useState(false);

  const unlocked = watched >= unlockAfter;

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {
        // autoplay com som bloqueado pelo navegador: tenta de novo sem som
        video.muted = true;
        setMuted(true);
        video.play().catch(() => undefined);
      });
    } else {
      video.pause();
    }
  }

  return (
    <div className={`video-step fade-in ${variant === 'inline' ? 'video-step-inline' : ''}`}>
      <div className="video-copy">
        <span className="video-tag">{tag}</span>
        <h2>{title}</h2>
        <p className="video-body">{body}</p>
      </div>

      <div className={`video-frame ${playing ? 'is-playing' : ''}`}>
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          controls={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => setWatched(event.currentTarget.currentTime)}
          onEnded={() => setWatched(unlockAfter)}
        />
        {!playing && (
          <button type="button" className="video-play" onClick={togglePlay} aria-label="Reproduzir depoimento">
            <span className="video-play-icon" aria-hidden="true">▶</span>
            <span className="video-play-label">Assistir agora</span>
          </button>
        )}
        {muted && playing && (
          <button
            type="button"
            className="video-unmute"
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              video.muted = false;
              setMuted(false);
            }}
          >
            🔇 Tocar com som
          </button>
        )}
      </div>

      <p className="video-disclaimer">
        Depoimento individual. Resultados variam conforme execução, nicho e mercado.
      </p>

      {onContinue && (
        <div className="video-actions">
          <button
            type="button"
            className={`primary-button video-continue ${unlocked ? '' : 'is-dim'}`}
            onClick={onContinue}
          >
            {cta} <span aria-hidden="true">→</span>
          </button>
          {!unlocked && (
            <button type="button" className="text-button" onClick={onContinue}>
              Pular este vídeo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
