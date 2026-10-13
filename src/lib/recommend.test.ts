import { describe, expect, test } from 'vitest';
import { pickRecommended } from './recommend';

const p = (id: string, category: string, photo = true) => ({ id, category, cover_image_url: photo ? `/${id}.jpg` : null });
const products = [
  p('a1', 'ecoprint'), p('a2', 'ecoprint'), p('a3', 'ecoprint'), p('a4', 'ecoprint'),
  p('b1', 'ayara'), p('b2', 'ayara'),
  p('c1', 'dung_pot'),
  p('d1', 'dung_sculpture'),
  p('e1', 'natural_dye'),
  p('x1', 'ayara', false),
];

// Deterministic stand-in for Math.random.
const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('pickRecommended', () => {
  test('returns five products that all have a photo', () => {
    const r = pickRecommended(products, 5, seeded(1));
    expect(r).toHaveLength(5);
    expect(r.every((x) => x.cover_image_url)).toBe(true);
  });

  test('covers every category before repeating one', () => {
    const r = pickRecommended(products, 5, seeded(7));
    expect(new Set(r.map((x) => x.category)).size).toBe(5);
  });

  test('fills up from the biggest categories when there are fewer categories than slots', () => {
    const r = pickRecommended(products.filter((x) => x.category === 'ecoprint' || x.category === 'ayara'), 5, seeded(3));
    expect(r).toHaveLength(5);
    expect(new Set(r.map((x) => x.id)).size).toBe(5);
  });

  test('different random sources give different picks', () => {
    const runs = new Set([1, 2, 3, 4, 5, 6].map((s) => pickRecommended(products, 5, seeded(s)).map((x) => x.id).join()));
    expect(runs.size).toBeGreaterThan(1);
  });
});
