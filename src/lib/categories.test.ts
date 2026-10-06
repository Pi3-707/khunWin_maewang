import { describe, expect, test } from 'vitest';
import { categoryLabel, filterCategories, parseFilter } from './categories';

describe('categories', () => {
  test('Thai labels for every category', () => {
    expect(categoryLabel('ecoprint')).toBe('ผ้าพิมพ์ลายใบไม้');
    expect(categoryLabel('ayara')).toBe('ผ้าย้อมสีมูลช้าง');
    expect(categoryLabel('dung_pot')).toBe('กระถางต้นไม้มูลช้าง');
    expect(categoryLabel('dung_sculpture')).toBe('งานปั้นมูลช้าง');
  });

  test('the dung group expands to its three categories', () => {
    expect(filterCategories('dung')).toEqual(['ayara', 'dung_pot', 'dung_sculpture']);
    expect(filterCategories('ecoprint')).toEqual(['ecoprint']);
    expect(filterCategories(undefined)).toBeUndefined();
  });

  test('unknown URL values mean no filter', () => {
    expect(parseFilter('dung')).toBe('dung');
    expect(parseFilter('dung_pot')).toBe('dung_pot');
    expect(parseFilter('bogus')).toBeUndefined();
    expect(parseFilter(null)).toBeUndefined();
  });
});
