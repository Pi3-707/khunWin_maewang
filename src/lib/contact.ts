import type { Lang } from '../i18n/lang';

// Public contact details from the community enterprise. Env vars override them for testing.
export const LINE_ID = import.meta.env.VITE_LINE_OA_ID || 'dear_nrt2545';
export const PHONE = import.meta.env.VITE_PHONE || '093-302-9448';
export const FB_PAGE = import.meta.env.VITE_FB_PAGE ?? '';

const LINE_PREFIX = { th: 'สนใจสินค้า:', en: 'Interested in:' };

// An official account (@id) can open a chat with the product name typed in; a personal ID can only open the add-friend page.
export function buildLineLink(id: string, productName?: string, lang: Lang = 'th'): string {
  if (!id.startsWith('@')) return `https://line.me/ti/p/~${id}`;
  const base = `https://line.me/R/oaMessage/${id}/`;
  const name = productName?.trim();
  return name ? `${base}?text=${encodeURIComponent(`${LINE_PREFIX[lang]} ${name}`)}` : base;
}

export const buildMessengerLink = (page: string) => `https://m.me/${page}`;

export const buildTelLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
