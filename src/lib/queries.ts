import { supabase } from './supabase';
import { isUuid } from './product';
import type { Category, Material, Process, ProductDetail, ProductListItem, VisitRow } from './types';

// products has two links to stories (products.story_id and stories.product_id), so the embed needs an FK hint.
const DETAIL_SELECT = `*,
  product_images(url, display_order),
  stories!products_story_id_fkey(*),
  product_materials(note, materials(*)),
  product_processes(step_order, note, processes(*)),
  product_artisans(role, artisans(*)),
  product_elephants(note, elephants(*)),
  product_purchase_channels(note, purchase_channels(*))`;

const one = <T,>(x: T | T[] | null): T | null => (Array.isArray(x) ? (x[0] ?? null) : x);

export async function fetchProducts(categories?: Category[]): Promise<ProductListItem[]> {
  let q = supabase
    .from('products')
    .select('*, product_images(url, display_order), product_materials(materials(name, name_en))')
    .order('created_at');
  if (categories) q = q.in('category', categories);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as ProductListItem[];
}

export async function fetchProduct(by: { id: string } | { qr: string }): Promise<ProductDetail | null> {
  if ('id' in by && !isUuid(by.id)) return null;
  const col = 'id' in by ? 'id' : 'qr_code';
  const val = 'id' in by ? by.id : by.qr;
  const { data, error } = await supabase.from('products').select(DETAIL_SELECT).eq(col, val).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const d = data as any;
  return {
    ...d,
    story: one(d.stories),
    materials: d.product_materials.map((r: any) => ({ ...r.materials, note: r.note })),
    processes: [...d.product_processes]
      .sort((a: any, b: any) => a.step_order - b.step_order)
      .map((r: any) => ({ ...r.processes, step_order: r.step_order, note: r.note })),
    artisans: d.product_artisans.map((r: any) => ({ ...r.artisans, product_role: r.role })),
    elephants: d.product_elephants.map((r: any) => ({ ...r.elephants, note: r.note })),
    channels: d.product_purchase_channels.map((r: any) => ({ ...r.purchase_channels, note: r.note })),
  } as ProductDetail;
}

export async function fetchHomeStory(): Promise<{ processes: Process[]; materials: Material[] }> {
  const [p, m] = await Promise.all([
    supabase.from('processes').select('*').limit(6),
    supabase.from('materials').select('*').limit(4),
  ]);
  if (p.error) throw p.error;
  if (m.error) throw m.error;
  return { processes: (p.data ?? []) as Process[], materials: (m.data ?? []) as Material[] };
}

export async function fetchVisitInfo(): Promise<VisitRow[]> {
  const { data, error } = await supabase.from('visit_info').select('*').order('display_order');
  if (error) throw error;
  return (data ?? []) as VisitRow[];
}

export interface Maker {
  id: string;
  kind: 'artisan' | 'elephant';
  name: string; name_en: string | null;
  role?: string | null; role_en?: string | null;
  text: string | null; text_en: string | null;
  image_url: string | null;
  age_years?: number | null;
  works: { id: string; name: string; name_en: string | null }[];
}

export async function fetchMakers(): Promise<Maker[]> {
  const [a, e] = await Promise.all([
    supabase.from('artisans').select('*, product_artisans(products(id, name, name_en))'),
    supabase.from('elephants').select('*, product_elephants(products(id, name, name_en))'),
  ]);
  if (a.error) throw a.error;
  if (e.error) throw e.error;
  const works = (rows: any[]) => rows.map((r) => r.products).filter(Boolean);
  return [
    ...(a.data ?? []).map((r: any) => ({ ...r, kind: 'artisan' as const, text: r.bio, text_en: r.bio_en, works: works(r.product_artisans) })),
    ...(e.data ?? []).map((r: any) => ({ ...r, kind: 'elephant' as const, text: r.description, text_en: r.description_en, works: works(r.product_elephants) })),
  ];
}
