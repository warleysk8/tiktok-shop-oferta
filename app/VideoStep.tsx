'use client';

import { useEffect, useRef, useState } from 'react';

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

const isEmbed = (src: string) => /^https?:\/\//.test(src) && !/\.mp4($|\?)/i.test(src);

/**
 * Player de depoimento (intersticiais do quiz e inline no resultado).
 * Panda Video entra como iframe; arquivo .mp4 ainda funciona no <video>.
 * Como o iframe não reporta tempo assistido, o botão de avançar só é
 * destacado depois de `unlockAfter` segundos na tela — e o "pular" fica
 * sempre disponível (prender o usuário derruba a conclusão).
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
  const embed = isEmbed(src);

  /* iframe: libera o botão por tempo de tela. */
  useEffect(() => {
    if (!embed || !onContinue) return;
    const t = window.setTimeout(() => setWatched(unlockAfter), unlockAfter * 1000);
    return () => window.clearTimeout(t);
  }, [embed, onContinue, unlockAfter]);

  const unlocked = watched >= unlockAfter;

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {
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

      {embed ? (
        <div className="video-frame video-frame-embed">
          <iframe
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
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
      )}

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
