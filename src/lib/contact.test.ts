import { describe, expect, test } from 'vitest';
import { buildLineLink, buildMessengerLink, buildTelLink } from './contact';

describe('contact links', () => {
  test('LINE link keeps Thai, & and ? inside the text parameter', () => {
    const url = buildLineLink('@abc', 'ตุ๊กตา & ช้าง?');
    expect(url.startsWith('https://line.me/R/oaMessage/@abc/?text=')).toBe(true);
    expect(new URL(url).searchParams.get('text')).toBe('สนใจสินค้า: ตุ๊กตา & ช้าง?');
  });
  test('LINE link adds the @ when missing', () => {
    expect(buildLineLink('abc')).toBe('https://line.me/R/oaMessage/@abc/');
  });
  test('blank product name is ignored', () => {
    expect(buildLineLink('@abc', '   ')).toBe('https://line.me/R/oaMessage/@abc/');
  });
  test('messenger and tel', () => {
    expect(buildMessengerLink('khunwin')).toBe('https://m.me/khunwin');
    expect(buildTelLink('081-234 5678')).toBe('tel:0812345678');
  });
});

test('LINE text prefix in English', () => {
  const url = buildLineLink('@abc', 'Ayara fabric', 'en');
  expect(new URL(url).searchParams.get('text')).toBe('Interested in: Ayara fabric');
});
