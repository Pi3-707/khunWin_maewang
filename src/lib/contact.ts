import type { Lang } from '../i18n/lang';

const LINE_PREFIX = { th: 'สนใจสินค้า:', en: 'Interested in:' };

export function buildLineLink(oaId: string, productName?: string, lang: Lang = 'th'): string {
  const id = oaId.startsWith('@') ? oaId : `@${oaId}`;
  const base = `https://line.me/R/oaMessage/${id}/`;
  const name = productName?.trim();
  return name ? `${base}?text=${encodeURIComponent(`${LINE_PREFIX[lang]} ${name}`)}` : base;
}

export const buildMessengerLink = (page: string) => `https://m.me/${page}`;

export const buildTelLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
