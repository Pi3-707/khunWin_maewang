// A random mix for "Recommended for you": shuffle the products that have a photo, then take one per
// category in turn so no single category (there are many eco-print pieces) fills the whole row.
export function pickRecommended<T extends { category: string; cover_image_url: string | null }>(
  products: T[], count = 5, random: () => number = Math.random,
): T[] {
  const shuffled = products.filter((p) => p.cover_image_url);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const groups = new Map<string, T[]>();
  for (const p of shuffled) groups.set(p.category, [...(groups.get(p.category) ?? []), p]);

  const picked: T[] = [];
  while (picked.length < count && groups.size) {
    for (const [cat, list] of groups) {
      if (picked.length === count) break;
      picked.push(list.shift()!);
      if (!list.length) groups.delete(cat);
    }
  }
  return picked;
}
