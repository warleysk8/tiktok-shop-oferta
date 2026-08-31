/**
 * Config do Meta (Pixel + Conversions API).
 * O Pixel ID NÃO é segredo (vai no HTML do cliente).
 * O token da CAPI é segredo e vive só em process.env.META_CAPI_TOKEN (Vercel).
 */
export const META_PIXEL_ID = '1112975824634059';

/** Versão da Graph API usada pela CAPI. */
export const META_GRAPH_VERSION = 'v21.0';

/** Eventos padrão do Meta. Fora dessa lista, usamos trackCustom. */
export const META_STANDARD_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'Lead',
  'InitiateCheckout',
  'Purchase',
  'CompleteRegistration',
  'Contact',
  'Search',
  'AddToCart',
  'AddPaymentInfo',
]);
