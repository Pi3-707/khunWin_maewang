import type { Lang } from '../i18n/lang';
import type { Availability } from './types';

const ASK = { th: 'สอบถามราคา', en: 'Price on request' };
const AVAILABILITY = {
  ready: { th: 'พร้อมส่ง', en: 'Ready to ship' },
  made_to_order: { th: 'สั่งทำล่วงหน้า', en: 'Made to order' },
};

export function formatPrice(p: number | string | null, lang: Lang = 'th'): string {
  if (p === null || p === '') return ASK[lang];
  const n = Number(p);
  if (!Number.isFinite(n)) return ASK[lang];
  return `฿${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
}

export const availabilityLabel = (a: Availability, lang: Lang = 'th') => AVAILABILITY[a][lang];
