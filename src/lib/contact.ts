export function buildLineLink(oaId: string, productName?: string): string {
  const id = oaId.startsWith('@') ? oaId : `@${oaId}`;
  const base = `https://line.me/R/oaMessage/${id}/`;
  const name = productName?.trim();
  return name ? `${base}?text=${encodeURIComponent(`สนใจสินค้า: ${name}`)}` : base;
}

export const buildMessengerLink = (page: string) => `https://m.me/${page}`;

export const buildTelLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
