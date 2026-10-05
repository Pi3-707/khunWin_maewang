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

export interface ProductImage { url: string; display_order: number }

export interface ProductListItem extends Product {
  product_images: ProductImage[];
  product_materials: { materials: { name: string } | null }[];
}

export interface Story {
  id: string; title: string;
  introduction: string | null; origin_story: string | null; value_story: string | null;
}
export interface Material { id: string; name: string; type: string; origin: string | null; description: string | null; image_url: string | null }
export interface Process { id: string; name: string; description: string | null; image_url: string | null; video_url: string | null }
export interface Artisan { id: string; name: string; role: string; bio: string | null; image_url: string | null }
export interface Elephant { id: string; name: string; description: string | null; image_url: string | null; age_years: number | null }
export interface Channel { id: string; name: string; type: string; url: string; description: string | null }

export interface ProductDetail extends Product {
  product_images: ProductImage[];
  story: Story | null;
  materials: (Material & { note: string | null })[];
  processes: (Process & { step_order: number; note: string | null })[];
  artisans: (Artisan & { product_role: string })[];
  elephants: (Elephant & { note: string | null })[];
  channels: (Channel & { note: string | null })[];
}

export interface VisitRow { id: string; kind: 'activity' | 'hours' | 'direction' | 'map'; title: string | null; body: string; display_order: number }
