import type { Category } from './types';

export const CATEGORY_LABEL: Record<Category, string> = {
  ecoprint: 'ผ้าพิมพ์ลายใบไม้',
  ayara: 'ผ้าย้อมสีมูลช้าง',
  dung_pot: 'กระถางต้นไม้มูลช้าง',
  dung_sculpture: 'งานปั้นมูลช้าง',
};

export const DUNG_GROUP: Category[] = ['ayara', 'dung_pot', 'dung_sculpture'];

// A filter is one category, or 'dung' for every elephant-dung product.
export type Filter = Category | 'dung';

export const categoryLabel = (c: Category) => CATEGORY_LABEL[c] ?? c;

export function filterCategories(f: Filter | undefined): Category[] | undefined {
  if (!f) return undefined;
  return f === 'dung' ? DUNG_GROUP : [f];
}

export function parseFilter(raw: string | null): Filter | undefined {
  if (raw === 'dung') return 'dung';
  return raw && raw in CATEGORY_LABEL ? (raw as Category) : undefined;
}
