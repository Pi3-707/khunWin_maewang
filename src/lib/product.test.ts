import { describe, expect, test } from 'vitest';
import { coverUrl, isUuid } from './product';

describe('coverUrl', () => {
  test('uses the cover when set', () => {
    expect(coverUrl({ cover_image_url: 'a.webp', product_images: [] })).toBe('a.webp');
  });
  test('falls back to the first gallery image by display_order', () => {
    const imgs = [{ url: 'b.webp', display_order: 2 }, { url: 'c.webp', display_order: 1 }];
    expect(coverUrl({ cover_image_url: null, product_images: imgs })).toBe('c.webp');
  });
  test('falls back to the placeholder when there is nothing', () => {
    expect(coverUrl({ cover_image_url: null, product_images: [] })).toBe('/placeholder.svg');
  });
});

describe('isUuid', () => {
  test('accepts a uuid, rejects other strings', () => {
    expect(isUuid('3f2b8c1e-9a4d-4e7a-8b1c-2d3e4f5a6b7c')).toBe(true);
    expect(isUuid('abc')).toBe(false);
    expect(isUuid("1' or '1'='1")).toBe(false);
  });
});
