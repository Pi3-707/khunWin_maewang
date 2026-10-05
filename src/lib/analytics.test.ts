import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { setConsent, track } from './analytics';

const gtag = vi.fn();
beforeEach(() => {
  gtag.mockClear();
  (globalThis as any).window = { gtag };
  setConsent(false);
});
afterEach(() => {
  delete (globalThis as any).window;
});

test('no event is sent before consent', () => {
  track('click_line');
  expect(gtag).not.toHaveBeenCalled();
});

test('event is sent after consent', () => {
  setConsent(true);
  track('click_line', { product_name: 'x' });
  expect(gtag).toHaveBeenCalledWith('event', 'click_line', { product_name: 'x' });
});

test('event stops again when consent is withdrawn', () => {
  setConsent(true);
  setConsent(false);
  track('click_line');
  expect(gtag).not.toHaveBeenCalled();
});
