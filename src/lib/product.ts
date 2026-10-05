import type { ProductImage } from './types';

export const PLACEHOLDER = '/placeholder.svg';

export function coverUrl(p: { cover_image_url: string | null; product_images: ProductImage[] }): string {
  if (p.cover_image_url) return p.cover_image_url;
  const first = [...p.product_images].sort((a, b) => a.display_order - b.display_order)[0];
  return first?.url ?? PLACEHOLDER;
}

export const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
