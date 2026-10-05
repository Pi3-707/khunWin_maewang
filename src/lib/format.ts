import type { Availability } from './types';

export function formatPrice(p: number | string | null): string {
  if (p === null || p === '') return 'สอบถามราคา';
  const n = Number(p);
  if (!Number.isFinite(n)) return 'สอบถามราคา';
  return `฿${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
}

export const availabilityLabel = (a: Availability) =>
  a === 'ready' ? 'พร้อมส่ง' : 'สั่งทำล่วงหน้า';
