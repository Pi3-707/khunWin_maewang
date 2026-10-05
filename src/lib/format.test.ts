import { describe, expect, test } from 'vitest';
import { availabilityLabel, formatPrice } from './format';

describe('format', () => {
  test('null price asks to inquire', () => {
    expect(formatPrice(null)).toBe('สอบถามราคา');
  });
  test('numeric and string prices', () => {
    expect(formatPrice(1200)).toBe('฿1,200');
    expect(formatPrice('1200.00')).toBe('฿1,200');
  });
  test('garbage price falls back to inquire', () => {
    expect(formatPrice('abc')).toBe('สอบถามราคา');
  });
  test('availability labels', () => {
    expect(availabilityLabel('ready')).toBe('พร้อมส่ง');
    expect(availabilityLabel('made_to_order')).toBe('สั่งทำล่วงหน้า');
  });
});
