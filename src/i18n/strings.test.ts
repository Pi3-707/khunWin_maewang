import { expect, test } from 'vitest';
import { S, translate } from './strings';

test('every string has non-empty Thai and English', () => {
  for (const [key, v] of Object.entries(S)) {
    expect(v.th.trim(), `${key}.th`).not.toBe('');
    expect(v.en.trim(), `${key}.en`).not.toBe('');
  }
});

test('translate picks the language', () => {
  expect(translate('nav.products', 'th')).toBe('สินค้า');
  expect(translate('nav.products', 'en')).toBe('Products');
});
