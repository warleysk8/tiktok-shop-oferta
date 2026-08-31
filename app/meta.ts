'use client';

import { META_STANDARD_EVENTS } from './meta-config';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, unknown>;

function newEventId(): string {
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Dispara o mesmo evento no Pixel (browser) e na CAPI (servidor), com o MESMO
 * event_id — o Meta deduplica os dois. `audience` entra como custom_data pra
 * dá pra segmentar por porta de entrada (clt, oportunidade, etc.) no Ads Manager.
 */
export function metaTrack(event: string, params: Params = {}, audience?: string) {
  const eventId = newEventId();
  const data = audience ? { ...params, audience } : params;

  try {
    const method = META_STANDARD_EVENTS.has(event) ? 'track' : 'trackCustom';
    window.fbq?.(method, event, data, { eventID: eventId });
  } catch {
    /* pixel ainda não carregou ou bloqueado — a CAPI cobre */
  }

  try {
    void fetch('/api/meta', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event,
        params: data,
        eventId,
        url: typeof location !== 'undefined' ? location.href : undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* sem rede — ignora */
  }
}
