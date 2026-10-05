import { supabase } from './supabase';

async function toWebP(file: File, maxWidth = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bmp.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('แปลงรูปไม่สำเร็จ'))), 'image/webp', 0.85),
  );
}

export async function uploadPhoto(productId: string, file: File): Promise<{ url: string; path: string }> {
  const blob = await toWebP(file);
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage.from('product-photos').upload(path, blob, { contentType: 'image/webp' });
  if (error) throw error;
  return { url: supabase.storage.from('product-photos').getPublicUrl(path).data.publicUrl, path };
}

export async function removePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from('product-photos').remove([path]);
  if (error) throw error;
}
