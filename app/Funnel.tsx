'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VideoStep from './VideoStep';
import ProofShots from './ProofShots';
import Testimonials from './Testimonials';
import { getAudience, type AudienceId } from './audiences';
import {
  ANALYZING_STEPS,
  COMPANY,
  companyLine,
  DELIVERABLES,
  FAQ,
  LEARN,
  LEAD_ENDPOINT,
  LEGAL,
  META_DISCLAIMER,
  METHOD,
  OFFER,
  PLANS,
  PROOF_BLOCK,
  PROOF_SCREEN,
  SOCIAL_PROOF,
  Question,
  VideoSlot,
  audienceMessage,
  getResult,
  proofForFear,
  proofForObstacle,
  questions,
  videoSlots,
} from './funnel-config';

type AnswerMap = Record<string, string>;
type Phase = 'hero' | 'quiz' | 'analyzing' | 'result';

type Screen =
  | { kind: 'question'; question: Question; questionIndex: number }
  | { kind: 'bridge' }
  | { kind: 'proof'; source: 'obstacle' | 'fear' }
  | { kind: 'video'; slot: VideoSlot };

/**
 * Monta a sequência do quiz. Cada print entra logo depois da pergunta que
 * revela a objeção que ele mata — é onde a prova convence mais e custa menos
 * tempo que um vídeo.
 */
function buildScreens(quizQuestions: Question[]): Screen[] {
  const list: Screen[] = [];
  quizQuestions.forEach((question, questionIndex) => {
    list.push({ kind: 'question', question, questionIndex });
    if (question.id === 'obstacle') list.push({ kind: 'proof', source: 'obstacle' });
    if (question.id === 'fear') list.push({ kind: 'proof', source: 'fear' });
    if (question.id === 'age') list.push({ kind: 'bridge' });
    const slot = videoSlots.find((item) => item.enabled && item.afterQuestionId === question.id);
    if (slot) list.push({ kind: 'video', slot });
  });
  return list;
}

async function submitAnswers(payload: Record<string, unknown>) {
  if (!LEAD_ENDPOINT) {
    try {
      window.localStorage.setItem('comissao-em-cena:respostas', JSON.stringify(payload));
    } catch {
      // storage indisponível (aba anônima, cookies bloqueados) — segue o fluxo
    }
    return;
  }
  try {
    await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // falha de rede não pode travar a entrega do resultado
  }
}

export default function Funnel({ audienceId = 'geral' }: { audienceId?: AudienceId }) {
  const audience = getAudience(audienceId);
  const HERO = audience.hero;

  /* A pergunta 1 é o espelho da dor — é ela que muda por público.
     Memoizado por `audienceId` (primitivo) e não pelo objeto: `screens` precisa
     ser estável, senão o listener de teclado é remontado a cada render. */
  const quizQuestions = useMemo<Question[]>(
    () =>
      questions.map((question) => {
        const override = getAudience(audienceId).quiz[question.id];
        return override ? { ...question, ...override } : question;
      }),
    [audienceId],
  );
  const screens = useMemo(() => buildScreens(quizQuestions), [quizQuestions]);

  const [phase, setPhase] = useState<Phase>('hero');
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [echo, setEcho] = useState<string | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const screen = screens[cursor];
  const answeredCount = Object.keys(answers).length;
  /* A barra acompanha o rótulo (pergunta atual inclusa) para nunca abrir em 0%. */
  const displayStep = Math.min(quizQuestions.length, answeredCount + (screen?.kind === 'question' ? 1 : 0));
  const progress = Math.min(100, (displayStep / quizQuestions.length) * 100);
  const bridgeCopy = useMemo(() => audienceMessage(answers.age), [answers.age]);
  const fullPlan = useMemo(() => PLANS.find((plan) => plan.id === 'completo') ?? PLANS[0], []);
  const partialPlan = useMemo(() => PLANS.find((plan) => plan.id === 'parcial'), []);
  const checkoutButton = (className: string) =>
    fullPlan.url ? (
      <a className={`primary-button ${className}`} href={fullPlan.url}>
        {OFFER.cta} <span aria-hidden="true">→</span>
      </a>
    ) : (
      <button className={`primary-button ${className}`} type="button" disabled>
        {OFFER.cta}
      </button>
    );
  const fearProof = useMemo(() => proofForFear(answers.fear), [answers.fear]);
  const obstacleProof = useMemo(() => proofForObstacle(answers.obstacle), [answers.obstacle]);
  /* Ordem dos prints no carrossel: o mais relevante para o público primeiro. */
  const orderedProof = useMemo(
    () =>
      getAudience(audienceId)
        .proofOrder.map((id) => SOCIAL_PROOF.find((shot) => shot.id === id))
        .filter((shot) => !!shot)
        .concat(SOCIAL_PROOF.filter((shot) => !getAudience(audienceId).proofOrder.includes(shot.id))),
    [audienceId],
  );

  const advance = useCallback(() => {
    setCursor((value) => {
      if (value + 1 >= screens.length) {
        setPhase('analyzing');
        return value;
      }
      return value + 1;
    });
  }, [screens.length]);

  const choose = useCallback(
    (question: Question, value: string) => {
      const option = question.options.find((item) => item.value === value);
      setAnswers((current) => ({ ...current, [question.id]: value }));
      setEcho(option?.echo ?? null);
      advance();
    },
    [advance],
  );

  /* Atalhos 1–4 no teclado: acelera muito o teste e ajuda quem usa desktop. */
  useEffect(() => {
    if (phase !== 'quiz' || screen?.kind !== 'question') return;
    function onKey(event: KeyboardEvent) {
      const index = Number(event.key) - 1;
      if (screen.kind !== 'question') return;
      const option = screen.question.options[index];
      if (option) choose(screen.question, option.value);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, screen, choose]);

  /* Envia as respostas uma única vez, quando a análise começa. */
  const sentRef = useRef(false);
  useEffect(() => {
    if (phase !== 'analyzing' || sentRef.current) return;
    sentRef.current = true;
    void submitAnswers({
      answers,
      route: getResult(answers).route,
      audience: audience.id,
      createdAt: new Date().toISOString(),
    });
  }, [phase, answers, audience.id]);

  /* Tela de análise: percebida como trabalho real e aumenta o valor do resultado. */
  useEffect(() => {
    if (phase !== 'analyzing') return;
    /* O primeiro timer tem delay 0, então ele mesmo reseta a lista para o passo 0. */
    const timers = ANALYZING_STEPS.map((_, index) =>
      window.setTimeout(() => setAnalyzeStep(index), index * 850),
    );
    const done = window.setTimeout(() => setPhase('result'), ANALYZING_STEPS.length * 850 + 500);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'quiz' || phase === 'result') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, cursor]);

  function startQuiz() {
    setPhase('quiz');
  }

  function goBack() {
    if (cursor === 0) {
      setPhase('hero');
      return;
    }
    setEcho(null);
    setCursor((value) => Math.max(0, value - 1));
  }

  const showChrome = phase === 'quiz';
  const year = new Date().getFullYear();

  return (
    <main className="quiz-shell">
      <div className="ambient ambient-cyan" />
      <div className="ambient ambient-pink" />

      {phase === 'hero' && (
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><i /> {HERO.eyebrow}</span>
            <h1>
              {HERO.headline}
              {HERO.headlineAccent && <span className="accent-title">{HERO.headlineAccent}</span>}
            </h1>
            <p className="hero-lead">{HERO.lead}</p>
            <button className="primary-button" onClick={startQuiz}>
              {HERO.cta} <span aria-hidden="true">→</span>
            </button>
            <small className="cta-note">{HERO.ctaNote}</small>
            <div className="trust-row" aria-label="Vantagens">
              {HERO.trust.map((item) => <span key={item}>{item}</span>)}
            </div>
            {HERO.note && <p className="hero-note">{HERO.note}</p>}
          </div>

          <aside className="preview-card teaser-card" id="quiz">
            <div className="preview-topline"><span>Sem cadastro</span><b>2 min</b></div>
            <div className="progress"><span style={{ width: '14%' }} /></div>
            <p className="question-kicker">Comece pelo que está travando</p>
            <h2>{HERO.teaserTitle}</h2>
            <div className="teaser-stack">
              {HERO.teaserItems.map((item) => <span key={item}>{item}</span>)}
            </div>
            <button className="secondary-cta" onClick={startQuiz}>{HERO.teaserCta}</button>
            <small>Sem cadastro. Sem e-mail.</small>
          </aside>
        </section>
      )}

      {phase === 'hero' && <Testimonials onStart={startQuiz} shots={orderedProof} label={HERO.proofLabel} />}

      {phase !== 'hero' && phase !== 'result' && (
        <section className="quiz-stage" id="quiz" aria-live="polite">
          <div className="quiz-frame">
            {showChrome && (
              <div className="quiz-head">
                <button className="back-button" onClick={goBack} aria-label="Voltar">←</button>
                <div className="progress"><span style={{ width: `${progress}%` }} /></div>
              </div>
            )}

            {phase === 'quiz' && screen?.kind === 'question' && (
              <div className="question-screen fade-in" key={screen.question.id}>
                {echo && <p className="echo-chip"><b>Anotado:</b> {echo}</p>}
                <p className="question-kicker">{screen.question.kicker}</p>
                <h2>{screen.question.title}</h2>
                {screen.question.subtitle && <p className="question-subtitle">{screen.question.subtitle}</p>}
                <div className="answer-list">
                  {screen.question.options.map((option, index) => (
                    <button key={option.value} onClick={() => choose(screen.question, option.value)}>
                      <span className="answer-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="answer-copy">
                        <strong>{option.label}</strong>
                        {option.detail && <small>{option.detail}</small>}
                      </span>
                      <span className="answer-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === 'quiz' && screen?.kind === 'bridge' && (
              <div className="bridge-screen fade-in">
                <span className="bridge-tag">{bridgeCopy.tag}</span>
                <h2>{bridgeCopy.title}</h2>
                <p>{bridgeCopy.body}</p>
                <button className="primary-button" onClick={advance}>
                  Continuar <span aria-hidden="true">→</span>
                </button>
              </div>
            )}

            {phase === 'quiz' && screen?.kind === 'proof' && (() => {
              const shot = screen.source === 'obstacle' ? obstacleProof : fearProof;
              return (
                <div className="proof-screen fade-in" key={shot.id}>
                  <span className="bridge-tag">
                    {screen.source === 'obstacle' ? PROOF_SCREEN.tagObstacle : PROOF_SCREEN.tagFear}
                  </span>
                  <h2>{shot.claim}</h2>
                  <ProofShots shots={[shot]} variant="single" />
                  <button className="primary-button" onClick={advance}>
                    {PROOF_SCREEN.cta} <span aria-hidden="true">→</span>
                  </button>
                </div>
              );
            })()}

            {phase === 'quiz' && screen?.kind === 'video' && (
              <VideoStep
                key={screen.slot.src}
                src={screen.slot.src}
                tag={screen.slot.tag}
                title={screen.slot.title}
                body={screen.slot.body}
                cta={screen.slot.cta}
                unlockAfter={screen.slot.unlockAfter}
                onContinue={advance}
              />
            )}

            {phase === 'analyzing' && (
              <div className="analyzing-screen fade-in">
                <div className="analyzing-ring" aria-hidden="true" />
                <span className="result-code">Processando</span>
                <h2>Analisando…</h2>
                <ul className="analyzing-list">
                  {ANALYZING_STEPS.map((item, index) => (
                    <li key={item} className={index <= analyzeStep ? 'is-done' : ''}>
                      <span aria-hidden="true">{index < analyzeStep ? '✓' : '•'}</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </section>
      )}

      {phase === 'result' && (
        <section className="result-page fade-in">
          <div className="offer-head">
            <h2>{OFFER.title}</h2>
            <p className="offer-lead">{OFFER.body}</p>
          </div>

          {/* 1 — o que você vai aprender */}
          <section className="learn">
            <span className="deliverables-eyebrow">{LEARN.eyebrow}</span>
            <h3>{LEARN.title}</h3>
            <p className="learn-lead">{LEARN.body}</p>
            <div className="learn-grid">
              {METHOD.pillars.map((pillar) => (
                <div className="learn-card" key={pillar.letter}>
                  <span className="learn-letter">{pillar.letter}</span>
                  <b>{pillar.title}</b>
                  <small>{pillar.body}</small>
                </div>
              ))}
            </div>
            {checkoutButton('result-cta')}
          </section>

          <div className="deliverables">
            <span className="deliverables-eyebrow">{DELIVERABLES.eyebrow}</span>
            <h3>{DELIVERABLES.title}</h3>
            <p className="deliverables-summary">{DELIVERABLES.summary}</p>

            <div className="deliverables-group">
              <span>{DELIVERABLES.method.label}</span>
              <ul className="deliverables-list">
                {DELIVERABLES.method.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div className="deliverables-bonus">
              {DELIVERABLES.bonuses.map((bonus) => (
                <div key={bonus.title}>
                  <i>{bonus.tag}</i>
                  <b>{bonus.title}</b>
                  <small>{bonus.body}</small>
                </div>
              ))}
            </div>

            <p className="deliverables-note">{DELIVERABLES.note}</p>
          </div>

          {/* 2 — o valor: âncora → oferta → CTA */}
          <div className="offer-box">
            {fullPlan.badge && <span className="plan-badge">{fullPlan.badge}</span>}
            <p className="offer-box-name">{OFFER.product} · {fullPlan.name}</p>

            <div className="offer-price">
              <s>{OFFER.anchor.fromLabel} {OFFER.anchor.from}</s>
              <span className="offer-price-to">{OFFER.anchor.toLabel}</span>
              <b>{OFFER.anchor.price}</b>
              <span className="offer-price-inst">{OFFER.anchor.installments}</span>
              <span className="offer-price-methods">{OFFER.anchor.methods}</span>
            </div>

            <ul className="offer-recap">
              {OFFER.recap.map((item) => <li key={item}>{item}</li>)}
            </ul>

            {checkoutButton('offer-cta')}
            {!fullPlan.url && (
              <small className="dev-note">
                Falta o link do checkout em <code>OFFER_URL</code> / <code>PLANS</code>.
              </small>
            )}
            <small className="cta-note">{OFFER.ctaNote}</small>

            <p className="offer-box-guarantee">
              <b>{OFFER.guaranteeLabel}.</b> {OFFER.guarantee}
            </p>
          </div>

          <p className="offer-reason">{OFFER.reasonWhy}</p>

          {partialPlan?.url && (
            <a className="offer-downsell" href={partialPlan.url}>{OFFER.downsell}</a>
          )}

          {/* 3 — prova: depoimentos em vídeo e print */}
          <section className="result-proof">
            <Testimonials
              shots={orderedProof}
              label={PROOF_BLOCK.title}
              cta={fullPlan.url ? { label: OFFER.cta, href: fullPlan.url } : undefined}
              videoFirst
            />
            <p className="result-proof-disclaimer">{PROOF_BLOCK.disclaimer}</p>
          </section>

          {/* 4 — perguntas frequentes */}
          <section className="faq">
            <span className="deliverables-eyebrow">Perguntas frequentes</span>
            <div className="faq-list">
              {FAQ.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.q}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      {item.q} <span aria-hidden="true">+</span>
                    </button>
                    {isOpen && <p>{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5 — última chamada */}
          <div className="result-final-cta">
            {checkoutButton('result-cta')}
            <small className="cta-note">{OFFER.ctaNote}</small>
          </div>

        </section>
      )}

      <footer>
        <p>{LEGAL}</p>
        <p>{META_DISCLAIMER}</p>
        <p className="footer-links">
          <a href="/privacidade" target="_blank" rel="noopener">Política de Privacidade</a>
          <span aria-hidden="true"> · </span>
          <a href="/termos" target="_blank" rel="noopener">Termos de Uso</a>
        </p>
        <p>© {year} {COMPANY.brand}{companyLine && ` · ${companyLine}`}</p>
      </footer>
    </main>
  );
}
