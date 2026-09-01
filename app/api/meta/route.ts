import type { NextRequest } from 'next/server';
import { META_GRAPH_VERSION, META_PIXEL_ID } from '../../meta-config';

/**
 * Conversions API (server-side). Recebe o evento do cliente (com o event_id
 * gerado lá) e reenvia pro Meta. O Pixel manda o mesmo event_id, então o Meta
 * deduplica. O token vive só em process.env.META_CAPI_TOKEN (nunca no repo).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Incoming = {
  event?: string;
  params?: Record<string, unknown>;
  eventId?: string;
  url?: string;
  /** Opcional: força o evento pra Events Manager → Test Events. */
  testCode?: string;
};

export async function POST(req: NextRequest) {
  const token = process.env.META_CAPI_TOKEN;

  let body: Incoming;
  try {
    body = (await req.json()) as Incoming;
  } catch {
    return Response.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.event) {
    return Response.json({ ok: false, error: 'no event' }, { status: 400 });
  }
  if (!token) {
    // Sem token configurado: não quebra o funil, só não envia server-side.
    return Response.json({ ok: false, skipped: 'META_CAPI_TOKEN ausente' });
  }

  const h = req.headers;
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || undefined;
  const ua = h.get('user-agent') || undefined;
  const fbp = req.cookies.get('_fbp')?.value;
  const fbc = req.cookies.get('_fbc')?.value;

  // Test Events: aceita o código pelo corpo da requisição (útil pra testar
  // com curl) OU pela env var META_TEST_EVENT_CODE (tagueia TODO o tráfego
  // enquanto estiver setada — lembrar de remover depois).
  const testCode = body.testCode || process.env.META_TEST_EVENT_CODE;

  const payload = {
    ...(testCode ? { test_event_code: testCode } : {}),
    data: [
      {
        event_name: body.event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.eventId,
        action_source: 'website',
        event_source_url: body.url,
        user_data: {
          ...(ip ? { client_ip_address: ip } : {}),
          ...(ua ? { client_user_agent: ua } : {}),
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        },
        ...(body.params && Object.keys(body.params).length
          ? { custom_data: body.params }
          : {}),
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    const fb = await res.json().catch(() => ({}));
    return Response.json({ ok: res.ok, fb }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: 'fetch failed' }, { status: 200 });
  }
}
