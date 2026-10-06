export type Lang = 'th' | 'en';

const isLang = (v: unknown): v is Lang => v === 'th' || v === 'en';

// Order of precedence: ?lang= in the URL, then the saved choice, then the browser (Thai only if it asks for Thai).
export function detectLang({ search = '', stored, languages = [] }: { search?: string; stored?: string | null; languages?: readonly string[] }): Lang {
  const fromUrl = new URLSearchParams(search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  if (isLang(stored)) return stored;
  return languages.some((l) => l.toLowerCase().startsWith('th')) ? 'th' : 'en';
}

// Returns row[field_en] in English mode when it has text, otherwise the Thai row[field].
export function pick(row: Record<string, any> | null | undefined, field: string, lang: Lang): string | null {
  if (!row) return null;
  const en = row[`${field}_en`];
  if (lang === 'en' && typeof en === 'string' && en.trim()) return en;
  return row[field] ?? null;
}
