export type Availability = 'ready' | 'made_to_order';
export type Category = 'ayara' | 'ecoprint';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string | null;
  story_summary: string | null;
  qr_code: string | null;
  cover_image_url: string | null;
  product_code: string;
  reference_price: number | string | null;
  availability: Availability;
}
