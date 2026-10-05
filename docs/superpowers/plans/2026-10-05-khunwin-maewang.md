# Khunwin Mae Wang Storytelling Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Thai-language showcase and storytelling website for Khunwin Mae Wang community products, with a staff back office, reading from the existing Supabase project and deployed on Vercel.

**Architecture:** One Vite + React + TypeScript single-page app with no server code. Public pages read from Supabase with the anon key under row level security. The `/admin` routes use Supabase Auth and write products and photos. Scroll motion uses CSS scroll-driven animation, with no animation library.

**Tech Stack:** Vite, React, TypeScript, react-router-dom, @supabase/supabase-js, Vitest, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-05-khunwin-maewang-design.md`

## Global Constraints

- Thai only for v1. No English columns, no language switch.
- No cart, payment, stock counting or customer accounts.
- Product availability is exactly `ready` or `made_to_order`, never a count.
- Palette (verbatim): paper cream `#F5F0E6`, earth brown `#8B6A4A`, forest green `#3F5A3C`, charcoal `#2B2B2B`, brass accent `#C9A24B`.
- Text contrast at least 4.5:1. Mobile layout verified at 375px width.
- Chapter text on Home is at most 40 words (proxy used in tests: at most 200 characters).
- Hero video at most 3 MB, muted, looping, `playsinline`, hero only. Files are `public/hero.webm` and `public/hero.mp4`, poster `public/hero-poster.jpg`.
- Images are WebP and lazy loaded. Home loads within 3 seconds on 4G.
- No animation blocks content for more than one second. `prefers-reduced-motion` disables motion.
- GA4 must not load or send events before the visitor accepts the cookie banner (PDPA).
- Never commit `.env` or any key. The Supabase anon key lives in env vars only.
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GA_ID`, `VITE_LINE_OA_ID`, `VITE_FB_PAGE`, `VITE_PHONE`. The last two are added by this plan, because the Contact page needs them.
- Supabase project id: `orqkvfyvhuvchbtbclna`.
- Every commit message ends with the line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Commit and push after every task.
- Working directory: `C:\Users\PC\khunWin_maewang`. Use forward slashes in the bash tool.

## Review Focus

Inputs and conditions the spec implies but does not spell out, most likely to bite first:

1. A product with no cover image and no gallery images must show the placeholder, never a broken image. Tested in Task 4 (`coverUrl`).
2. A product name containing Thai characters, spaces, `&` or `?` must survive inside the LINE link text. Tested in Task 3 (`buildLineLink`).
3. A product with `reference_price` null must show "สอบถามราคา", never "฿null" or "฿NaN". Tested in Task 3 (`formatPrice`).
4. A product URL or QR path that matches nothing, or a product id that is not a UUID, must show a friendly "not found" page, not a blank screen or a database error. Tested in Task 4 (`isUuid`), checked manually.
5. An anonymous visitor must not be able to write to the database, and an unauthenticated visitor to `/admin/products` must be sent to the login page. Checked in Task 2 (SQL) and Task 8 (manual).
6. No GA4 call may happen before consent. Tested in Task 3 (`track`).

---

## File Structure

```
.env.example                      env var names, no values
.gitignore
index.html                        Thai meta, fonts
package.json, tsconfig.json, vite.config.ts, vercel.json
public/placeholder.svg            fallback image
public/hero.webm, hero.mp4, hero-poster.jpg   supplied by user (optional until launch)
supabase/migrations/001_additions.sql
src/main.tsx, src/App.tsx         entry and routes
src/vite-env.d.ts
src/lib/supabase.ts               client
src/lib/types.ts                  shared types
src/lib/contact.ts (+test)        LINE, Messenger, tel link builders
src/lib/format.ts (+test)         price and availability labels
src/lib/analytics.ts (+test)      consent-gated GA4
src/lib/product.ts (+test)        coverUrl, isUuid
src/lib/queries.ts                all Supabase reads
src/lib/useAsync.ts               tiny data hook
src/lib/usePageTitle.ts
src/lib/image.ts                  WebP conversion and upload
src/content/chapters.ts (+test)   Home chapter copy
src/content/ourStory.ts           Our Story copy
src/styles/theme.css              tokens, base, components, motion
src/components/Layout.tsx, ContactButtons.tsx, StickyContact.tsx,
  ProductCard.tsx, ThreadLine.tsx, CollageLayer.tsx, CookieBanner.tsx, RequireAuth.tsx
src/pages/Home.tsx, Products.tsx, ProductDetail.tsx, QrRedirect.tsx,
  OurStory.tsx, Visit.tsx, Contact.tsx, NotFound.tsx
src/pages/admin/Login.tsx, AdminProducts.tsx
```

---

### Task 1: Scaffold the app and connect to Supabase

**Files:**
- Create: `package.json` (via npm), `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.env.example`, `.env`, `public/placeholder.svg`, `src/vite-env.d.ts`, `src/main.tsx`, `src/App.tsx`, `src/lib/supabase.ts`
- Modify: `CLAUDE.md` (commands section)

**Interfaces:**
- Produces: `supabase` (a `SupabaseClient`) exported from `src/lib/supabase.ts`. Every later task imports it.

- [ ] **Step 1: Install dependencies**

```bash
cd /c/Users/PC/khunWin_maewang
npm init -y
npm i react react-dom react-router-dom @supabase/supabase-js
npm i -D vite @vitejs/plugin-react typescript vitest @types/react @types/react-dom
npm pkg set type=module name=khunwin-maewang
npm pkg set scripts.dev="vite" scripts.build="tsc --noEmit && vite build" scripts.preview="vite preview" scripts.test="vitest run --passWithNoTests"
```

- [ ] **Step 2: Write config files**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

`.gitignore`:
```
node_modules
dist
.env
.env.local
```

`.env.example`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GA_ID=
VITE_LINE_OA_ID=
VITE_FB_PAGE=
VITE_PHONE=
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`public/placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#E8DEC8"/><text x="200" y="155" text-anchor="middle" font-family="serif" font-size="20" fill="#8B6A4A">ขุนวินแม่วาง</text></svg>
```

`index.html`:
```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ขุนวินแม่วาง | งานคราฟต์จากชุมชน</title>
    <meta name="description" content="เรื่องราวและงานคราฟต์จากชุมชนขุนวินแม่วาง เชียงใหม่ ดูที่มา วัตถุดิบ และคนทำ แล้วทักสอบถามผ่าน LINE ได้ทันที" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Pridi:wght@400;600&family=Sarabun:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Write the Supabase client and a bare entry**

`src/lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(url, key);
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx` (replaced in Task 3):
```tsx
export default function App() {
  return <h1>ขุนวินแม่วาง</h1>;
}
```

- [ ] **Step 4: Create `.env` from the project**

Get the values with the Supabase tools `get_project_url` and `get_publishable_keys` for project `orqkvfyvhuvchbtbclna`. Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the anon (publishable) key. Leave the other four blank for now.

- [ ] **Step 5: Verify build and dev server**

Run: `npm run build`
Expected: finishes without errors and creates `dist/`.
Run: `npm test`
Expected: exits 0 with "No test files found" accepted.

- [ ] **Step 6: Update `CLAUDE.md` commands**

Replace the line starting "Added at build step 1" under `## Commands` with:
```
- `npm run dev` start dev server
- `npm run build` typecheck and build
- `npm test` run Vitest once
```

- [ ] **Step 7: Commit and push**

```bash
git add -A && git commit -m "Task 1: scaffold Vite React TS app with Supabase client" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```
Expected: `git status` shows `.env` is not tracked.

---

### Task 2: Database migration and security

**Files:**
- Create: `supabase/migrations/001_additions.sql`

**Interfaces:**
- Produces (database): `products.reference_price numeric(10,2) null`, `products.availability text` (`ready` | `made_to_order`), table `product_images(id, product_id, url, display_order)`, table `visit_info(id, kind, title, body, display_order)` where `kind` is `activity`, `hours`, `direction` or `map`, storage bucket `product-photos` (public read, authenticated write), anonymous `SELECT` on all content tables, authenticated write on `products` and `product_images`.

- [ ] **Step 1: Inspect current policies and the duplicate link**

Run with `execute_sql` on project `orqkvfyvhuvchbtbclna`:
```sql
select tablename, policyname, cmd, roles from pg_policies where schemaname = 'public' order by tablename;
```
Note any existing policy so the migration does not duplicate it.

Then check the duplicate link is safe to drop:
```sql
select p.id from public.products p
left join public.stories s on s.product_id = p.id
where p.story_id is not null and s.id is distinct from p.story_id;
```
Expected: zero rows. If any row comes back, stop and ask the user before dropping `products.story_id`.

- [ ] **Step 2: Write the migration file**

`supabase/migrations/001_additions.sql`:
```sql
alter table public.products
  add column if not exists reference_price numeric(10,2),
  add column if not exists availability text not null default 'made_to_order'
    check (availability in ('ready', 'made_to_order'));

alter table public.products drop column if exists story_id;

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  display_order int not null default 1
);

create table if not exists public.visit_info (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('activity', 'hours', 'direction', 'map')),
  title text,
  body text not null,
  display_order int not null default 1
);

alter table public.product_images enable row level security;
alter table public.visit_info enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'products','stories','materials','processes','artisans','elephants','media',
    'purchase_channels','product_materials','product_processes','product_artisans',
    'product_elephants','product_purchase_channels','product_images','visit_info'
  ] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write product_images" on public.product_images;
create policy "admin write product_images" on public.product_images
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

drop policy if exists "photos admin insert" on storage.objects;
create policy "photos admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-photos');

drop policy if exists "photos admin update" on storage.objects;
create policy "photos admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-photos');

drop policy if exists "photos admin delete" on storage.objects;
create policy "photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-photos');
```

- [ ] **Step 3: Apply it**

Call `apply_migration` with name `additions` and the file contents, on project `orqkvfyvhuvchbtbclna`.
Expected: success.

- [ ] **Step 4: Verify anonymous read works and anonymous write fails**

`execute_sql`:
```sql
begin; set local role anon; select count(*) from public.products; rollback;
```
Expected: `2`.

Second call, separately (it must error):
```sql
begin; set local role anon;
insert into public.products (name, category, product_code) values ('x', 'ayara', 'x');
rollback;
```
Expected: error containing `row-level security` or `permission denied`.

- [ ] **Step 5: Run the security advisor**

Call `get_advisors` with type `security`. Fix or report any new finding caused by this migration.

- [ ] **Step 6: Tell the user two manual dashboard settings**

In Supabase Dashboard, Authentication, Sign In / Providers: turn **off** "Allow new users to sign up", and create the staff user under Authentication, Users. Without this, anyone could sign up and become an "authenticated" writer.

- [ ] **Step 7: Commit and push**

```bash
git add -A && git commit -m "Task 2: add migration for price, availability, images, visit info, RLS" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 3: Shared libraries, theme, layout and routing

**Files:**
- Create: `src/lib/types.ts`, `src/lib/contact.ts`, `src/lib/contact.test.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`, `src/lib/analytics.ts`, `src/lib/analytics.test.ts`, `src/lib/usePageTitle.ts`, `src/styles/theme.css`, `src/components/ContactButtons.tsx`, `src/components/StickyContact.tsx`, `src/components/Layout.tsx`, `src/pages/Home.tsx`, `src/pages/NotFound.tsx`
- Modify: `src/main.tsx`, `src/App.tsx`

**Interfaces:**
- Produces: `buildLineLink(oaId: string, productName?: string): string`, `buildMessengerLink(page: string): string`, `buildTelLink(phone: string): string`, `formatPrice(p: number | string | null): string`, `availabilityLabel(a: Availability): string`, `setConsent(v: boolean): void`, `track(name: string, params?: Record<string, unknown>): void`, `usePageTitle(title: string): void`, `type LayoutContext = { setProductName: (n?: string) => void }`, component `ContactButtons({ productName?: string })`.
- Produces (types): `Availability`, `Category`, `Product`.

- [ ] **Step 1: Write the failing tests**

`src/lib/contact.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { buildLineLink, buildMessengerLink, buildTelLink } from './contact';

describe('contact links', () => {
  test('LINE link keeps Thai, & and ? inside the text parameter', () => {
    const url = buildLineLink('@abc', 'ตุ๊กตา & ช้าง?');
    expect(url.startsWith('https://line.me/R/oaMessage/@abc/?text=')).toBe(true);
    expect(new URL(url).searchParams.get('text')).toBe('สนใจสินค้า: ตุ๊กตา & ช้าง?');
  });
  test('LINE link adds the @ when missing', () => {
    expect(buildLineLink('abc')).toBe('https://line.me/R/oaMessage/@abc/');
  });
  test('blank product name is ignored', () => {
    expect(buildLineLink('@abc', '   ')).toBe('https://line.me/R/oaMessage/@abc/');
  });
  test('messenger and tel', () => {
    expect(buildMessengerLink('khunwin')).toBe('https://m.me/khunwin');
    expect(buildTelLink('081-234 5678')).toBe('tel:0812345678');
  });
});
```

`src/lib/format.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { availabilityLabel, formatPrice } from './format';

describe('format', () => {
  test('null price asks to inquire', () => {
    expect(formatPrice(null)).toBe('สอบถามราคา');
  });
  test('numeric and string prices', () => {
    expect(formatPrice(1200)).toBe('฿1,200');
    expect(formatPrice('1200.00')).toBe('฿1,200');
  });
  test('garbage price falls back to inquire', () => {
    expect(formatPrice('abc')).toBe('สอบถามราคา');
  });
  test('availability labels', () => {
    expect(availabilityLabel('ready')).toBe('พร้อมส่ง');
    expect(availabilityLabel('made_to_order')).toBe('สั่งทำล่วงหน้า');
  });
});
```

`src/lib/analytics.test.ts`:
```ts
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { setConsent, track } from './analytics';

const gtag = vi.fn();
beforeEach(() => {
  gtag.mockClear();
  (globalThis as any).window = { gtag };
  setConsent(false);
});
afterEach(() => {
  delete (globalThis as any).window;
});

test('no event is sent before consent', () => {
  track('click_line');
  expect(gtag).not.toHaveBeenCalled();
});

test('event is sent after consent', () => {
  setConsent(true);
  track('click_line', { product_name: 'x' });
  expect(gtag).toHaveBeenCalledWith('event', 'click_line', { product_name: 'x' });
});

test('event stops again when consent is withdrawn', () => {
  setConsent(true);
  setConsent(false);
  track('click_line');
  expect(gtag).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, modules `./contact`, `./format`, `./analytics` not found.

- [ ] **Step 3: Write the implementations**

`src/lib/types.ts`:
```ts
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
```

`src/lib/contact.ts`:
```ts
export function buildLineLink(oaId: string, productName?: string): string {
  const id = oaId.startsWith('@') ? oaId : `@${oaId}`;
  const base = `https://line.me/R/oaMessage/${id}/`;
  const name = productName?.trim();
  return name ? `${base}?text=${encodeURIComponent(`สนใจสินค้า: ${name}`)}` : base;
}

export const buildMessengerLink = (page: string) => `https://m.me/${page}`;

export const buildTelLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
```

`src/lib/format.ts`:
```ts
import type { Availability } from './types';

export function formatPrice(p: number | string | null): string {
  if (p === null || p === '') return 'สอบถามราคา';
  const n = Number(p);
  if (!Number.isFinite(n)) return 'สอบถามราคา';
  return `฿${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
}

export const availabilityLabel = (a: Availability) =>
  a === 'ready' ? 'พร้อมส่ง' : 'สั่งทำล่วงหน้า';
```

`src/lib/analytics.ts`:
```ts
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

let consented = false;

function loadGA() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id || typeof document === 'undefined' || document.getElementById('ga4')) return;
  const s = document.createElement('script');
  s.id = 'ga4';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

export function setConsent(v: boolean) {
  consented = v;
  if (v) loadGA();
}

export function track(name: string, params?: Record<string, unknown>) {
  if (!consented) return;
  window.gtag?.('event', name, params);
}
```

`src/lib/usePageTitle.ts`:
```ts
import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ขุนวินแม่วาง`;
  }, [title]);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 5: Write the theme**

`src/styles/theme.css`:
```css
:root {
  --cream: #F5F0E6;
  --brown: #8B6A4A;
  --green: #3F5A3C;
  --charcoal: #2B2B2B;
  --brass: #C9A24B;
  --font-head: 'Pridi', serif;
  --font-body: 'Sarabun', sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--cream); color: var(--charcoal); font: 17px/1.7 var(--font-body); }
h1, h2, h3 { font-family: var(--font-head); font-weight: 600; line-height: 1.3; }
a { color: var(--green); }
img, video { max-width: 100%; display: block; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
main { padding-bottom: 88px; }

.site-header { background: var(--cream); border-bottom: 1px solid rgba(43,43,43,.12); position: sticky; top: 0; z-index: 20; }
.site-header nav { display: flex; flex-wrap: wrap; gap: 4px 16px; padding: 10px 16px; max-width: 1100px; margin: 0 auto; }
.site-header a { text-decoration: none; color: var(--charcoal); padding: 6px 0; }
.site-header a.active { color: var(--green); border-bottom: 2px solid var(--brass); }

.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 6px; border: 0; background: var(--green); color: #fff; font: 600 16px var(--font-body); text-decoration: none; cursor: pointer; }
.btn-line { background: #06C755; color: #003d1a; }
.btn-ghost { background: transparent; color: var(--green); border: 1px solid var(--green); }

.contact-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.sticky-contact { position: fixed; left: 0; right: 0; bottom: 0; z-index: 30; background: var(--cream); border-top: 1px solid rgba(43,43,43,.15); padding: 10px 16px; display: flex; justify-content: center; }

.badge { display: inline-block; padding: 2px 10px; border-radius: 4px; background: #E8DEC8; color: var(--brown); font-size: 13px; margin: 0 6px 6px 0; }
.badge-ready { background: var(--green); color: #fff; }
.card { background: #fff; border: 1px solid rgba(43,43,43,.1); border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; display: block; }
.card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.card-body { padding: 12px 14px 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.muted { color: #5a5248; }
.error { color: #9b1c1c; }

.cookie-banner { position: fixed; left: 12px; right: 12px; bottom: 76px; z-index: 40; background: var(--charcoal); color: #fff; padding: 14px; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.cookie-banner .btn { min-height: 40px; }

/* Home story scroll */
.story { position: relative; overflow-x: clip; }
.thread { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
.thread path { fill: none; stroke: var(--charcoal); stroke-width: 2; stroke-linecap: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 0; opacity: .55; }
.hero { position: relative; min-height: 88vh; display: grid; align-items: end; color: #fff; background: linear-gradient(160deg, var(--green), var(--brown)); overflow: hidden; }
.hero video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.15)); }
.hero-inner { position: relative; z-index: 2; padding: 0 16px 56px; max-width: 1100px; margin: 0 auto; width: 100%; }
.hero h1 { font-size: clamp(34px, 7vw, 64px); margin: 0 0 8px; }
.chapter { position: relative; z-index: 2; min-height: 90vh; display: grid; align-items: center; gap: 24px; padding: 56px 16px; max-width: 1100px; margin: 0 auto; }
.chapter-text { background: rgba(245,240,230,.92); padding: 18px; border-radius: 8px; max-width: 520px; }
.chapter-text h2 { margin-top: 0; }
.collage { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
.collage img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border: 6px solid #fff; box-shadow: 0 8px 24px rgba(43,43,43,.18); }
.collage img:nth-child(2) { margin-top: 32px; }
.bw img { filter: grayscale(1) contrast(1.05); }
@media (min-width: 800px) { .chapter { grid-template-columns: 1fr 1fr; } .chapter:nth-of-type(even) .chapter-text { order: 2; } }

@supports (animation-timeline: scroll()) {
  @keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  .thread path { stroke-dashoffset: 1; animation: draw linear both; animation-timeline: scroll(root block); }
  @keyframes drift { from { transform: translateY(36px); } to { transform: translateY(-36px); } }
  .parallax { animation: drift linear both; animation-timeline: view(); }
  @keyframes reveal { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 45%; }
}
@media (prefers-reduced-motion: reduce) {
  .thread path, .parallax, .reveal { animation: none !important; stroke-dashoffset: 0; transform: none; opacity: 1; }
}
```

- [ ] **Step 6: Write components, pages and routes**

`src/components/ContactButtons.tsx`:
```tsx
import { buildLineLink, buildMessengerLink, buildTelLink } from '../lib/contact';
import { track } from '../lib/analytics';

const LINE = import.meta.env.VITE_LINE_OA_ID ?? '';
const FB = import.meta.env.VITE_FB_PAGE ?? '';
const PHONE = import.meta.env.VITE_PHONE ?? '';

export function ContactButtons({ productName }: { productName?: string }) {
  const params = productName ? { product_name: productName } : undefined;
  return (
    <div className="contact-buttons">
      <a className="btn btn-line" href={buildLineLink(LINE, productName)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_line', params)}>LINE</a>
      <a className="btn btn-ghost" href={buildMessengerLink(FB)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_facebook', params)}>Messenger</a>
      <a className="btn btn-ghost" href={buildTelLink(PHONE)} onClick={() => track('click_phone', params)}>โทร</a>
    </div>
  );
}
```

`src/components/StickyContact.tsx`:
```tsx
import { ContactButtons } from './ContactButtons';

export function StickyContact({ productName }: { productName?: string }) {
  return (
    <div className="sticky-contact">
      <ContactButtons productName={productName} />
    </div>
  );
}
```

`src/components/Layout.tsx`:
```tsx
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { StickyContact } from './StickyContact';

export type LayoutContext = { setProductName: (n?: string) => void };

const links: [string, string][] = [
  ['/', 'หน้าแรก'],
  ['/products', 'สินค้า'],
  ['/our-story', 'เรื่องราวของเรา'],
  ['/visit', 'มาเยี่ยมชุมชน'],
  ['/contact', 'ติดต่อ'],
];

export function Layout() {
  const [productName, setProductName] = useState<string>();
  return (
    <>
      <header className="site-header">
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet context={{ setProductName } satisfies LayoutContext} />
      </main>
      <StickyContact productName={productName} />
    </>
  );
}
```

`src/pages/NotFound.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';

export default function NotFound({ message = 'ไม่พบหน้าที่ต้องการ' }: { message?: string }) {
  usePageTitle('ไม่พบหน้า');
  return (
    <div className="container">
      <h1>{message}</h1>
      <Link to="/products">ดูสินค้าทั้งหมด</Link>
    </div>
  );
}
```

`src/pages/Home.tsx` (temporary, replaced in Task 5):
```tsx
export default function Home() {
  return <div className="container"><h1>ขุนวินแม่วาง</h1></div>;
}
```

`src/App.tsx`:
```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

In `src/main.tsx` add `import './styles/theme.css';` below the `App` import.

- [ ] **Step 7: Verify**

Run: `npm test` then `npm run build`.
Expected: tests pass, build succeeds.
Run `npm run dev`, open the printed URL. Expected: cream page, nav bar, sticky contact bar at the bottom, and an unknown URL such as `/xyz` shows "ไม่พบหน้าที่ต้องการ".

- [ ] **Step 8: Commit and push**

```bash
git add -A && git commit -m "Task 3: shared libs, theme, layout, routing" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 4: Products list, detail and QR redirect

**Files:**
- Create: `src/lib/product.ts`, `src/lib/product.test.ts`, `src/lib/queries.ts`, `src/lib/useAsync.ts`, `src/components/ProductCard.tsx`, `src/pages/Products.tsx`, `src/pages/ProductDetail.tsx`, `src/pages/QrRedirect.tsx`
- Modify: `src/lib/types.ts`, `src/App.tsx`

**Interfaces:**
- Consumes: `supabase`, `Product`, `Availability`, `Category`, `formatPrice`, `availabilityLabel`, `usePageTitle`, `track`, `LayoutContext`, `NotFound`.
- Produces: `coverUrl(p: { cover_image_url: string | null; product_images: ProductImage[] }): string`, `isUuid(s: string): boolean`, `fetchProducts(category?: Category): Promise<ProductListItem[]>`, `fetchProduct(by: { id: string } | { qr: string }): Promise<ProductDetail | null>`, `useAsync<T>(fn, deps)`, `ProductCard`.

- [ ] **Step 1: Write the failing tests**

`src/lib/product.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { coverUrl, isUuid } from './product';

describe('coverUrl', () => {
  test('uses the cover when set', () => {
    expect(coverUrl({ cover_image_url: 'a.webp', product_images: [] })).toBe('a.webp');
  });
  test('falls back to the first gallery image by display_order', () => {
    const imgs = [{ url: 'b.webp', display_order: 2 }, { url: 'c.webp', display_order: 1 }];
    expect(coverUrl({ cover_image_url: null, product_images: imgs })).toBe('c.webp');
  });
  test('falls back to the placeholder when there is nothing', () => {
    expect(coverUrl({ cover_image_url: null, product_images: [] })).toBe('/placeholder.svg');
  });
});

describe('isUuid', () => {
  test('accepts a uuid, rejects other strings', () => {
    expect(isUuid('3f2b8c1e-9a4d-4e7a-8b1c-2d3e4f5a6b7c')).toBe(true);
    expect(isUuid('abc')).toBe(false);
    expect(isUuid("1' or '1'='1")).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL, `./product` not found.

- [ ] **Step 3: Implement `product.ts` and extend types**

`src/lib/product.ts`:
```ts
import type { ProductImage } from './types';

export const PLACEHOLDER = '/placeholder.svg';

export function coverUrl(p: { cover_image_url: string | null; product_images: ProductImage[] }): string {
  if (p.cover_image_url) return p.cover_image_url;
  const first = [...p.product_images].sort((a, b) => a.display_order - b.display_order)[0];
  return first?.url ?? PLACEHOLDER;
}

export const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
```

Append to `src/lib/types.ts`:
```ts
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
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Write queries and the data hook**

`src/lib/queries.ts`:
```ts
import { supabase } from './supabase';
import { isUuid } from './product';
import type { Category, ProductDetail, ProductListItem } from './types';

const DETAIL_SELECT = `*,
  product_images(url, display_order),
  stories(*),
  product_materials(note, materials(*)),
  product_processes(step_order, note, processes(*)),
  product_artisans(role, artisans(*)),
  product_elephants(note, elephants(*)),
  product_purchase_channels(note, purchase_channels(*))`;

const one = <T,>(x: T | T[] | null): T | null => (Array.isArray(x) ? (x[0] ?? null) : x);

export async function fetchProducts(category?: Category): Promise<ProductListItem[]> {
  let q = supabase
    .from('products')
    .select('*, product_images(url, display_order), product_materials(materials(name))')
    .order('created_at');
  if (category) q = q.eq('category', category);
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
```

`src/lib/useAsync.ts`:
```ts
import { useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [s, set] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });
  useEffect(() => {
    let alive = true;
    set({ loading: true });
    fn().then(
      (data) => alive && set({ data, loading: false }),
      (error) => alive && set({ error, loading: false }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return s;
}
```

- [ ] **Step 6: Write the card and pages**

`src/components/ProductCard.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { availabilityLabel, formatPrice } from '../lib/format';
import { coverUrl } from '../lib/product';
import type { ProductListItem } from '../lib/types';

export function ProductCard({ p }: { p: ProductListItem }) {
  const materials = p.product_materials.map((m) => m.materials?.name).filter(Boolean) as string[];
  return (
    <Link to={`/products/${p.id}`} className="card">
      <img src={coverUrl(p)} alt={p.name} loading="lazy" />
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted">{formatPrice(p.reference_price)}</p>
        <span className={`badge ${p.availability === 'ready' ? 'badge-ready' : ''}`}>{availabilityLabel(p.availability)}</span>
        {materials.map((m) => (
          <span key={m} className="badge">{m}</span>
        ))}
      </div>
    </Link>
  );
}
```

`src/pages/Products.tsx`:
```tsx
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import type { Category } from '../lib/types';

const FILTERS: [Category | '', string][] = [['', 'ทั้งหมด'], ['ayara', 'Ayara'], ['ecoprint', 'Ecoprint']];

export default function Products() {
  usePageTitle('สินค้า');
  const [params, setParams] = useSearchParams();
  const raw = params.get('category');
  const category = raw === 'ayara' || raw === 'ecoprint' ? raw : undefined;
  const { data, error, loading } = useAsync(() => fetchProducts(category), [category]);

  return (
    <div className="container">
      <h1>สินค้า</h1>
      <p>
        {FILTERS.map(([value, label]) => (
          <button key={value} className={`btn ${category === (value || undefined) ? '' : 'btn-ghost'}`} style={{ marginRight: 8 }}
            onClick={() => setParams(value ? { category: value } : {})}>
            {label}
          </button>
        ))}
      </p>
      {loading && <p>กำลังโหลด…</p>}
      {error && <p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
      {data && data.length === 0 && <p>ยังไม่มีสินค้าในหมวดนี้</p>}
      <div className="grid">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </div>
  );
}
```

`src/pages/ProductDetail.tsx`:
```tsx
import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import type { LayoutContext } from '../components/Layout';
import { track } from '../lib/analytics';
import { availabilityLabel, formatPrice } from '../lib/format';
import { coverUrl } from '../lib/product';
import { fetchProduct } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const { setProductName } = useOutletContext<LayoutContext>();
  const { data: p, error, loading } = useAsync(() => fetchProduct({ id }), [id]);
  usePageTitle(p?.name ?? 'สินค้า');

  useEffect(() => {
    if (!p) return;
    setProductName(p.name);
    track('view_product', { product_name: p.name });
    return () => setProductName(undefined);
  }, [p, setProductName]);

  if (loading) return <div className="container"><p>กำลังโหลด…</p></div>;
  if (error) return <div className="container"><p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p></div>;
  if (!p) return <NotFound message="ไม่พบสินค้านี้" />;

  const gallery = [...p.product_images].sort((a, b) => a.display_order - b.display_order);
  return (
    <div className="container">
      <h1>{p.name}</h1>
      <img src={coverUrl(p)} alt={p.name} style={{ maxHeight: 460, objectFit: 'cover', width: '100%', borderRadius: 8 }} />
      <p>
        <strong>{formatPrice(p.reference_price)}</strong>{' '}
        <span className={`badge ${p.availability === 'ready' ? 'badge-ready' : ''}`}>{availabilityLabel(p.availability)}</span>
      </p>
      {p.description && <p>{p.description}</p>}
      {p.story && (
        <section>
          <h2>{p.story.title}</h2>
          {p.story.introduction && <p>{p.story.introduction}</p>}
          {p.story.origin_story && <p>{p.story.origin_story}</p>}
          {p.story.value_story && <p>{p.story.value_story}</p>}
        </section>
      )}
      {p.materials.length > 0 && (
        <section>
          <h2>วัตถุดิบ</h2>
          {p.materials.map((m) => (
            <p key={m.id}><strong>{m.name}</strong>{m.origin ? ` · ${m.origin}` : ''}{m.note ? ` — ${m.note}` : ''}</p>
          ))}
        </section>
      )}
      {p.processes.length > 0 && (
        <section>
          <h2>กระบวนการทำ</h2>
          <ol>
            {p.processes.map((s) => (
              <li key={s.id}><strong>{s.name}</strong>{s.description ? `: ${s.description}` : ''}{s.note ? ` (${s.note})` : ''}</li>
            ))}
          </ol>
        </section>
      )}
      {p.artisans.length > 0 && (
        <section>
          <h2>คนทำ</h2>
          {p.artisans.map((a) => (
            <p key={a.id}><strong>{a.name}</strong> · {a.product_role}{a.bio ? ` — ${a.bio}` : ''}</p>
          ))}
        </section>
      )}
      {p.elephants.length > 0 && (
        <section>
          <h2>ช้างที่อยู่เบื้องหลัง</h2>
          {p.elephants.map((e) => (
            <p key={e.id}><strong>{e.name}</strong>{e.age_years ? ` · ${e.age_years} ปี` : ''}{e.description ? ` — ${e.description}` : ''}</p>
          ))}
        </section>
      )}
      {gallery.length > 0 && (
        <section>
          <h2>ภาพสินค้า</h2>
          <div className="grid">
            {gallery.map((g) => <img key={g.url} src={g.url} alt={p.name} loading="lazy" />)}
          </div>
        </section>
      )}
      {p.channels.length > 0 && (
        <section>
          <h2>ช่องทางสั่งซื้อ</h2>
          <div className="contact-buttons">
            {p.channels.map((c) => (
              <a key={c.id} className="btn btn-ghost" href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

`src/pages/QrRedirect.tsx`:
```tsx
import { Navigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import NotFound from './NotFound';

export default function QrRedirect() {
  const { qr = '' } = useParams();
  const { data, loading, error } = useAsync(() => fetchProduct({ qr }), [qr]);
  if (loading) return <div className="container"><p>กำลังโหลด…</p></div>;
  if (error || !data) return <NotFound message="ไม่พบสินค้านี้" />;
  return <Navigate to={`/products/${data.id}`} replace />;
}
```

In `src/App.tsx` add imports and routes inside the `Layout` route, before the `*` route:
```tsx
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import QrRedirect from './pages/QrRedirect';
...
<Route path="products" element={<Products />} />
<Route path="products/:id" element={<ProductDetail />} />
<Route path="p/:qr" element={<QrRedirect />} />
```

- [ ] **Step 7: Verify**

Run: `npm test` and `npm run build`. Expected: pass.
Run `npm run dev` and check in the browser:
1. `/products` shows 2 products from the database with price text "สอบถามราคา", an availability badge and material badges.
2. Clicking a card opens `/products/<uuid>` with story, materials, process steps, artisans, elephants and channels. The sticky LINE link text contains the product name (hover the LINE button and read the URL).
3. `/products/abc` and `/products/3f2b8c1e-9a4d-4e7a-8b1c-2d3e4f5a6b7c` both show "ไม่พบสินค้านี้".
4. `/p/<a real qr_code from the products table>` redirects to that product. Read a real value with `select qr_code from products` in `execute_sql`.
5. `/products?category=ecoprint` filters.

- [ ] **Step 8: Commit and push**

```bash
git add -A && git commit -m "Task 4: products list, detail and QR redirect" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 5: Home story scroll

**Files:**
- Create: `src/content/chapters.ts`, `src/content/chapters.test.ts`, `src/components/ThreadLine.tsx`, `src/components/CollageLayer.tsx`
- Modify: `src/pages/Home.tsx`, `src/lib/queries.ts`

**Interfaces:**
- Consumes: `fetchProducts`, `ProductCard`, `useAsync`, `usePageTitle`, `Process`, `Material`, CSS classes from `theme.css`.
- Produces: `chapters` array in `src/content/chapters.ts`, `fetchHomeStory(): Promise<{ processes: Process[]; materials: Material[] }>`.

- [ ] **Step 1: Write the failing test**

`src/content/chapters.test.ts`:
```ts
import { expect, test } from 'vitest';
import { chapters } from './chapters';

test('five chapters, each short enough to read in one scroll', () => {
  expect(chapters).toHaveLength(5);
  for (const c of chapters) {
    expect(c.title.length).toBeGreaterThan(0);
    expect(c.text.length).toBeLessThanOrEqual(200);
  }
});
```

- [ ] **Step 2: Run, expect FAIL**

Run: `npm test`
Expected: FAIL, `./chapters` not found.

- [ ] **Step 3: Write chapter copy**

`src/content/chapters.ts` (draft copy, the community must confirm every line before launch):
```ts
export interface Chapter { id: string; title: string; text: string }

export const chapters: Chapter[] = [
  { id: 'place', title: 'ขุนวินแม่วางคือที่ไหน', text: 'ท่ามกลางป่าเขาและสายน้ำทางเหนือของเชียงใหม่ ชุมชนเล็ก ๆ ที่หมอกยามเช้าทักทายทุกวัน และผู้คนยังอยู่ร่วมกับธรรมชาติอย่างเรียบง่าย' },
  { id: 'people', title: 'ผู้คนและภูมิปัญญา', text: 'ความเชื่อและลวดลายที่สืบต่อกันมารุ่นสู่รุ่น ถูกถักทอลงในวิถีชีวิตและงานมือของคนในชุมชน' },
  { id: 'craft', title: 'จากธรรมชาติสู่งานคราฟต์', text: 'วัตถุดิบจากป่าและท้องถิ่น ผ่านมือผู้ทำทีละขั้นตอน จนกลายเป็นงานที่มีเรื่องราวในทุกชิ้น' },
  { id: 'artifacts', title: 'Living Artifacts', text: 'สินค้าที่เล่าเรื่องของคนทำ วัตถุดิบ และช้างที่อยู่เบื้องหลังทุกชิ้น' },
  { id: 'visit', title: 'มาเจอกันที่ชุมชน', text: 'ชวนมาเยี่ยมชม ร่วมเวิร์กชอป หรือทักมาคุยกับเราได้ทุกเมื่อ' },
];
```

- [ ] **Step 4: Run, expect PASS**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Add the home query**

Append to `src/lib/queries.ts`:
```ts
import type { Material, Process } from './types';

export async function fetchHomeStory(): Promise<{ processes: Process[]; materials: Material[] }> {
  const [p, m] = await Promise.all([
    supabase.from('processes').select('*').limit(6),
    supabase.from('materials').select('*').limit(4),
  ]);
  if (p.error) throw p.error;
  if (m.error) throw m.error;
  return { processes: (p.data ?? []) as Process[], materials: (m.data ?? []) as Material[] };
}
```
(Move the new `import type` line up beside the existing imports.)

- [ ] **Step 6: Components**

`src/components/ThreadLine.tsx`:
```tsx
export function ThreadLine() {
  return (
    <svg className="thread" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M20 0 C 80 60, 10 140, 70 220 S 15 360, 75 440 S 20 580, 80 660 S 25 800, 70 880 S 40 960, 50 1000" />
    </svg>
  );
}
```

`src/components/CollageLayer.tsx`:
```tsx
import { PLACEHOLDER } from '../lib/product';

export function CollageLayer({ srcs, bw = false }: { srcs: string[]; bw?: boolean }) {
  return (
    <div className={`collage parallax ${bw ? 'bw' : ''}`}>
      {srcs.map((s, i) => (
        <img key={i} src={s || PLACEHOLDER} alt="" loading="lazy" />
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Write the Home page**

`src/pages/Home.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { CollageLayer } from '../components/CollageLayer';
import { ProductCard } from '../components/ProductCard';
import { ThreadLine } from '../components/ThreadLine';
import { chapters } from '../content/chapters';
import { PLACEHOLDER } from '../lib/product';
import { fetchHomeStory, fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

function useShowVideo() {
  if (typeof window === 'undefined') return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as any).connection?.saveData === true;
  return !reduce && !saveData;
}

export default function Home() {
  usePageTitle('งานคราฟต์จากชุมชน');
  const showVideo = useShowVideo();
  const story = useAsync(fetchHomeStory, []);
  const products = useAsync(() => fetchProducts(), []);
  const [place, people, craft, artifacts, visit] = chapters;

  return (
    <div className="story">
      <ThreadLine />
      <section className="hero">
        {showVideo && (
          <video autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg">
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="hero-inner">
          <h1>ขุนวินแม่วาง</h1>
          <p>งานคราฟต์ที่เล่าเรื่องของป่า ผู้คน และช้าง</p>
          <Link className="btn" to="/products">ดูสินค้า</Link>
        </div>
      </section>

      <section className="chapter">
        <div className="chapter-text reveal"><h2>{place.title}</h2><p>{place.text}</p></div>
        <CollageLayer srcs={[PLACEHOLDER, PLACEHOLDER]} />
      </section>

      <section className="chapter">
        <div className="chapter-text reveal"><h2>{people.title}</h2><p>{people.text}</p></div>
        <CollageLayer srcs={[PLACEHOLDER, PLACEHOLDER]} bw />
      </section>

      <section className="chapter">
        <div className="chapter-text reveal">
          <h2>{craft.title}</h2>
          <p>{craft.text}</p>
          {story.data?.materials.map((m) => <span key={m.id} className="badge">{m.name}</span>)}
          <ol>{story.data?.processes.map((s) => <li key={s.id}>{s.name}</li>)}</ol>
          {story.error && <p className="error">โหลดข้อมูลไม่สำเร็จ</p>}
        </div>
        <CollageLayer srcs={story.data?.processes.slice(0, 2).map((s) => s.image_url ?? '') ?? [PLACEHOLDER, PLACEHOLDER]} bw />
      </section>

      <section className="chapter" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chapter-text reveal"><h2>{artifacts.title}</h2><p>{artifacts.text}</p></div>
        <div className="grid">{products.data?.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        {products.error && <p className="error">โหลดสินค้าไม่สำเร็จ</p>}
      </section>

      <section className="chapter">
        <div className="chapter-text reveal">
          <h2>{visit.title}</h2>
          <p>{visit.text}</p>
          <Link className="btn" to="/visit">ข้อมูลการเยี่ยมชม</Link>{' '}
          <Link className="btn btn-ghost" to="/products">สินค้าทั้งหมด</Link>
        </div>
        <CollageLayer srcs={[PLACEHOLDER, PLACEHOLDER]} />
      </section>
    </div>
  );
}
```

- [ ] **Step 8: Verify**

Run: `npm test` and `npm run build`. Expected: pass.
Run `npm run dev`, open `/`:
1. The thread line draws as you scroll (Chrome or Edge). In a browser without scroll-driven animation the line is fully drawn and everything is readable.
2. With no `public/hero.webm` the hero shows the green-brown gradient and the title is readable. When the user supplies a clip (at most 3 MB) it plays muted and looping with the dark overlay.
3. Turn on the OS "reduce motion" setting: nothing animates.
4. Resize to 375px: chapters stack vertically, text is not covered by images.
5. Chapter 3 lists real materials and processes from the database; chapter 4 shows product cards.

- [ ] **Step 9: Commit and push**

```bash
git add -A && git commit -m "Task 5: home story scroll with hero video and thread line" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 6: Our Story, Visit and Contact pages

**Files:**
- Create: `src/content/ourStory.ts`, `src/pages/OurStory.tsx`, `src/pages/Visit.tsx`, `src/pages/Contact.tsx`
- Modify: `src/lib/queries.ts`, `src/App.tsx`

**Interfaces:**
- Consumes: `supabase`, `VisitRow`, `useAsync`, `usePageTitle`, `track`, `ContactButtons`.
- Produces: `fetchVisitInfo(): Promise<VisitRow[]>`.

- [ ] **Step 1: Add the visit query**

Append to `src/lib/queries.ts`:
```ts
import type { VisitRow } from './types';

export async function fetchVisitInfo(): Promise<VisitRow[]> {
  const { data, error } = await supabase.from('visit_info').select('*').order('display_order');
  if (error) throw error;
  return (data ?? []) as VisitRow[];
}
```

- [ ] **Step 2: Seed one sample map row**

`execute_sql`:
```sql
insert into public.visit_info (kind, title, body, display_order)
values ('map', 'แผนที่', 'ขุนวินแม่วาง เชียงใหม่', 1);
```
This row is a sample so the page works. The community supplies the real address, activities and opening times (spec section 11).

- [ ] **Step 3: Write the pages**

`src/content/ourStory.ts` (draft copy, to be replaced by the community's text):
```ts
export const ourStory: { heading: string; body: string }[] = [
  { heading: 'ที่มาของชุมชน', body: 'ขุนวินแม่วางเป็นชุมชนบนเทือกเขาทางเหนือของเชียงใหม่ ผู้คนอาศัยอยู่ใกล้ป่าและสายน้ำ และพึ่งพาธรรมชาติมาหลายรุ่น' },
  { heading: 'ผู้คนและภูมิปัญญา', body: 'งานฝีมือของชุมชนเกิดจากความรู้ที่ถ่ายทอดกันในครอบครัว ทั้งการเลือกวัตถุดิบ การย้อมสี และลวดลายท้องถิ่น' },
  { heading: 'ช้างกับชุมชน', body: 'ชุมชนอยู่ร่วมกับช้างอย่างเคารพ และนำเรื่องราวนี้มาสู่งานคราฟต์ที่ใส่ใจสิ่งแวดล้อม' },
];
```

`src/pages/OurStory.tsx`:
```tsx
import { ourStory } from '../content/ourStory';
import { usePageTitle } from '../lib/usePageTitle';

export default function OurStory() {
  usePageTitle('เรื่องราวของเรา');
  return (
    <div className="container">
      <h1>เรื่องราวของเรา</h1>
      {ourStory.map((s) => (
        <section key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></section>
      ))}
    </div>
  );
}
```

`src/pages/Visit.tsx`:
```tsx
import { track } from '../lib/analytics';
import { fetchVisitInfo } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import type { VisitRow } from '../lib/types';

export default function Visit() {
  usePageTitle('มาเยี่ยมชมชุมชน');
  const { data, error, loading } = useAsync(fetchVisitInfo, []);
  const by = (k: VisitRow['kind']) => data?.filter((r) => r.kind === k) ?? [];
  const map = by('map')[0];
  const q = map ? encodeURIComponent(map.body) : '';

  return (
    <div className="container">
      <h1>มาเยี่ยมชมชุมชน</h1>
      {loading && <p>กำลังโหลด…</p>}
      {error && <p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
      {map && (
        <section>
          <h2>แผนที่</h2>
          <iframe title="แผนที่ชุมชน" loading="lazy" width="100%" height="320" style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${q}&output=embed`} />
          <p>
            <a className="btn btn-ghost" target="_blank" rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${q}`}
              onClick={() => track('open_map')}>เปิดใน Google Maps</a>
          </p>
        </section>
      )}
      {(['direction', 'activity', 'hours'] as const).map((k) =>
        by(k).length ? (
          <section key={k}>
            <h2>{{ direction: 'วิธีเดินทาง', activity: 'กิจกรรมและเวิร์กชอป', hours: 'ช่วงเวลาที่เปิด' }[k]}</h2>
            {by(k).map((r) => <p key={r.id}>{r.title && <strong>{r.title}: </strong>}{r.body}</p>)}
          </section>
        ) : null,
      )}
    </div>
  );
}
```

`src/pages/Contact.tsx`:
```tsx
import { useState } from 'react';
import { ContactButtons } from '../components/ContactButtons';
import { usePageTitle } from '../lib/usePageTitle';

export default function Contact() {
  usePageTitle('ติดต่อ');
  const [qr, setQr] = useState(true);
  return (
    <div className="container">
      <h1>ติดต่อเรา</h1>
      <p>ทักมาคุยหรือสอบถามสินค้าได้ทาง LINE และ Messenger หรือโทรหาเราโดยตรง</p>
      <ContactButtons />
      {qr && <img src="/line-qr.png" alt="QR code LINE" width={200} height={200} onError={() => setQr(false)} style={{ marginTop: 24 }} />}
    </div>
  );
}
```
The user supplies `public/line-qr.png`; until then the image hides itself.

In `src/App.tsx` add imports and routes inside the `Layout` route:
```tsx
import OurStory from './pages/OurStory';
import Visit from './pages/Visit';
import Contact from './pages/Contact';
...
<Route path="our-story" element={<OurStory />} />
<Route path="visit" element={<Visit />} />
<Route path="contact" element={<Contact />} />
```

- [ ] **Step 4: Verify**

Run: `npm run build`. Expected: pass.
Run `npm run dev` and open `/our-story`, `/visit` (map shows, button opens Google Maps in a new tab), `/contact` (three contact buttons, no broken image icon when `line-qr.png` is missing).

- [ ] **Step 5: Commit and push**

```bash
git add -A && git commit -m "Task 6: our story, visit and contact pages" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 7: Cookie banner and GA4 wiring

**Files:**
- Create: `src/components/CookieBanner.tsx`
- Modify: `src/components/Layout.tsx`

**Interfaces:**
- Consumes: `setConsent`. `track` calls already exist in `ContactButtons` (Task 3), `ProductDetail` (Task 4) and `Visit` (Task 6).

- [ ] **Step 1: Write the banner**

`src/components/CookieBanner.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { setConsent } from '../lib/analytics';

const KEY = 'ga-consent';

function read(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function write(v: string) {
  try { localStorage.setItem(KEY, v); } catch { /* storage blocked: choice lasts for this visit only */ }
}

export function CookieBanner() {
  const [stored, setStored] = useState<string | null>(read);

  useEffect(() => {
    setConsent(stored === 'yes');
  }, [stored]);

  if (stored) return null;
  const choose = (v: 'yes' | 'no') => {
    write(v);
    setStored(v);
  };
  return (
    <div className="cookie-banner" role="dialog" aria-label="คุกกี้">
      <span>เว็บไซต์นี้ใช้คุกกี้เพื่อวัดจำนวนผู้เข้าชม ยอมรับหรือไม่</span>
      <button className="btn" onClick={() => choose('yes')}>ยอมรับ</button>
      <button className="btn btn-ghost" style={{ color: '#fff', borderColor: '#fff' }} onClick={() => choose('no')}>ไม่ยอมรับ</button>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the layout**

In `src/components/Layout.tsx` add `import { CookieBanner } from './CookieBanner';` and render `<CookieBanner />` after `<StickyContact ... />`.

- [ ] **Step 3: Verify**

Set `VITE_GA_ID` in `.env` to a real GA4 measurement id (`G-XXXXXXXXXX`), run `npm run dev`, open DevTools Network.
1. First visit: banner shows, and no request goes to `googletagmanager.com`.
2. Click "ยอมรับ": the script loads, and clicking LINE sends a `collect` request with event `click_line`. Reload: the banner stays hidden and GA loads.
3. Clear site data, click "ไม่ยอมรับ": no GA request, banner stays hidden after reload.
Also run `npm test`. Expected: pass.

- [ ] **Step 4: Commit and push**

```bash
git add -A && git commit -m "Task 7: PDPA cookie banner and consent-gated GA4" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 8: Admin back office

**Files:**
- Create: `src/lib/image.ts`, `src/components/RequireAuth.tsx`, `src/pages/admin/Login.tsx`, `src/pages/admin/AdminProducts.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `supabase`, `fetchProducts`, `ProductListItem`, `Availability`, `Category`.
- Produces: `uploadPhoto(productId: string, file: File): Promise<string>` returning the public URL, `RequireAuth`.

- [ ] **Step 1: Image helper**

`src/lib/image.ts`:
```ts
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

export async function uploadPhoto(productId: string, file: File): Promise<string> {
  const blob = await toWebP(file);
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage.from('product-photos').upload(path, blob, { contentType: 'image/webp' });
  if (error) throw error;
  return supabase.storage.from('product-photos').getPublicUrl(path).data.publicUrl;
}
```

- [ ] **Step 2: Auth guard and login**

`src/components/RequireAuth.tsx`:
```tsx
import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function RequireAuth({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading');
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState(data.session ? 'in' : 'out'));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setState(s ? 'in' : 'out'));
    return () => data.subscription.unsubscribe();
  }, []);
  if (state === 'loading') return <p>กำลังโหลด…</p>;
  return state === 'in' ? <>{children}</> : <Navigate to="/admin" replace />;
}
```

`src/pages/admin/Login.tsx`:
```tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    else nav('/admin/products');
  }

  return (
    <form className="container" onSubmit={submit} style={{ maxWidth: 360 }}>
      <h1>เข้าสู่ระบบเจ้าหน้าที่</h1>
      <p><label>อีเมล<br /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} /></label></p>
      <p><label>รหัสผ่าน<br /><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} /></label></p>
      <button className="btn" type="submit">เข้าสู่ระบบ</button>
      {msg && <p className="error">{msg}</p>}
    </form>
  );
}
```

- [ ] **Step 3: Product admin page**

`src/pages/admin/AdminProducts.tsx`:
```tsx
import { useEffect, useState, type FormEvent } from 'react';
import { uploadPhoto } from '../../lib/image';
import { fetchProducts } from '../../lib/queries';
import { supabase } from '../../lib/supabase';
import type { Availability, Category, ProductListItem } from '../../lib/types';

interface Draft {
  id?: string; name: string; product_code: string; category: Category;
  description: string; story_summary: string; reference_price: string; availability: Availability;
}
const empty: Draft = { name: '', product_code: '', category: 'ayara', description: '', story_summary: '', reference_price: '', availability: 'made_to_order' };

function check(r: { error: unknown }) {
  if (r.error) throw r.error;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [d, setD] = useState<Draft>(empty);
  const [cover, setCover] = useState<File | null>(null);
  const [extra, setExtra] = useState<File[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => fetchProducts().then(setProducts).catch(() => setMsg('โหลดสินค้าไม่สำเร็จ'));
  useEffect(() => { load(); }, []);

  const edit = (p: ProductListItem) => {
    setD({ id: p.id, name: p.name, product_code: p.product_code, category: p.category,
      description: p.description ?? '', story_summary: p.story_summary ?? '',
      reference_price: p.reference_price == null ? '' : String(p.reference_price), availability: p.availability });
    setCover(null); setExtra([]); setMsg('');
  };

  async function save(e: FormEvent) {
    e.preventDefault();
    const price = d.reference_price === '' ? null : Number(d.reference_price);
    if (price !== null && !Number.isFinite(price)) { setMsg('ราคาต้องเป็นตัวเลข'); return; }
    setMsg('กำลังบันทึก…');
    try {
      const row = { name: d.name, product_code: d.product_code, category: d.category,
        description: d.description || null, story_summary: d.story_summary || null,
        reference_price: price, availability: d.availability };
      let id = d.id;
      if (id) {
        check(await supabase.from('products').update(row).eq('id', id));
      } else {
        const r = await supabase.from('products').insert(row).select('id').single();
        check(r);
        id = r.data!.id;
      }
      if (cover) {
        const url = await uploadPhoto(id!, cover);
        check(await supabase.from('products').update({ cover_image_url: url }).eq('id', id!));
      }
      if (extra.length) {
        const c = await supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', id!);
        check(c);
        let order = c.count ?? 0;
        for (const f of extra) {
          const url = await uploadPhoto(id!, f);
          check(await supabase.from('product_images').insert({ product_id: id, url, display_order: ++order }));
        }
      }
      setMsg('บันทึกแล้ว'); setD(empty); setCover(null); setExtra([]); load();
    } catch (err) {
      setMsg(`บันทึกไม่สำเร็จ: ${(err as Error).message ?? 'ไม่ทราบสาเหตุ'}`);
    }
  }

  const field = (label: string, el: JSX.Element) => <p><label>{label}<br />{el}</label></p>;
  return (
    <div className="container">
      <h1>จัดการสินค้า</h1>
      <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>ออกจากระบบ</button>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} <button className="btn btn-ghost" onClick={() => edit(p)}>แก้ไข</button></li>
        ))}
      </ul>
      <h2>{d.id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
      <form onSubmit={save} style={{ maxWidth: 520 }}>
        {field('ชื่อสินค้า', <input required value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} style={{ width: '100%' }} />)}
        {field('รหัสสินค้า', <input required value={d.product_code} onChange={(e) => setD({ ...d, product_code: e.target.value })} style={{ width: '100%' }} />)}
        {field('ประเภท', <select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value as Category })}><option value="ayara">Ayara</option><option value="ecoprint">Ecoprint</option></select>)}
        {field('ราคาอ้างอิง (บาท, เว้นว่างถ้าไม่ระบุ)', <input inputMode="decimal" value={d.reference_price} onChange={(e) => setD({ ...d, reference_price: e.target.value })} />)}
        {field('สถานะ', <select value={d.availability} onChange={(e) => setD({ ...d, availability: e.target.value as Availability })}><option value="ready">พร้อมส่ง</option><option value="made_to_order">สั่งทำล่วงหน้า</option></select>)}
        {field('รายละเอียด', <textarea rows={3} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} style={{ width: '100%' }} />)}
        {field('เรื่องสั้น 2-3 ประโยค', <textarea rows={3} value={d.story_summary} onChange={(e) => setD({ ...d, story_summary: e.target.value })} style={{ width: '100%' }} />)}
        {field('รูปหน้าปก', <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />)}
        {field('รูปเพิ่มเติม (หลายมุม)', <input type="file" accept="image/*" multiple onChange={(e) => setExtra([...(e.target.files ?? [])])} />)}
        <button className="btn" type="submit">บันทึก</button>{' '}
        {d.id && <button type="button" className="btn btn-ghost" onClick={() => setD(empty)}>ยกเลิก</button>}
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Add admin routes outside the public layout**

In `src/App.tsx` add imports:
```tsx
import { RequireAuth } from './components/RequireAuth';
import Login from './pages/admin/Login';
import AdminProducts from './pages/admin/AdminProducts';
```
and, as siblings of the `Layout` route (not inside it):
```tsx
<Route path="/admin" element={<Login />} />
<Route path="/admin/products" element={<RequireAuth><AdminProducts /></RequireAuth>} />
```

- [ ] **Step 5: Verify**

Run: `npm run build`. Expected: pass.
Run `npm run dev`:
1. Signed out, open `/admin/products`. Expected: redirected to `/admin`.
2. Log in with the staff user created in Task 2 step 6. Expected: `/admin/products` opens and lists the products.
3. Edit a product: set a price and set the status to "พร้อมส่ง", upload a cover and two extra photos. Save. Expected: "บันทึกแล้ว". Open the public `/products`: the price, badge and image show. Check in Supabase Storage that the uploaded files are `.webp`.
4. Create a new product with a code that already exists. Expected: a Thai error message that names the failure, not a blank page.
5. Sign out, then try the anonymous write from Task 2 step 4 again. Expected: still blocked.

- [ ] **Step 6: Commit and push**

```bash
git add -A && git commit -m "Task 8: admin login, product editing and WebP photo upload" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

---

### Task 9: Deploy to Vercel and final checks

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: SPA rewrites**

`vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
Without it, opening `/products/<id>` or `/p/<qr>` directly returns a 404, which breaks QR scans.

- [ ] **Step 2: Commit and push**

```bash
git add -A && git commit -m "Task 9: Vercel SPA rewrites" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push
```

- [ ] **Step 3: Import the repo in Vercel (user action)**

In the Vercel dashboard: Add New Project, import `Pi3-707/khunWin_maewang`, framework preset Vite. Add the six env vars from the Global Constraints list with real values. Deploy.

- [ ] **Step 4: Verify the deployed site**

1. Open the Vercel URL, then paste `<url>/products/<a real id>` into a new tab. Expected: the product page loads, not a 404.
2. Open `<url>/p/<a real qr_code>`. Expected: redirects to the product.
3. Open `<url>/admin/products` while signed out. Expected: redirected to `/admin`.

- [ ] **Step 5: Performance, mobile and accessibility check**

In Chrome DevTools, Lighthouse, Mobile, with throttling:
- Home LCP at most 3.0 seconds on Slow 4G. If it is higher, check the hero video size (at most 3 MB) and that the poster loads first.
- Accessibility score with no contrast failures on the hero title and chapter text.
- At 375px width: no horizontal scroll, the sticky contact bar does not hide page content (the `main` bottom padding is 88px), the cookie banner does not cover the contact bar.

Fix any failure in the file that caused it, then repeat step 2 of this task for the fix.

- [ ] **Step 6: Record launch blockers for the user**

Report this list and do not mark the project launch-ready until each is done:
- Replace Stitch and placeholder images with real community photos, with permission for every portrait.
- Add `public/hero.webm`, `public/hero.mp4`, `public/hero-poster.jpg` (at most 3 MB total video) from real footage.
- Add `public/line-qr.png`.
- Fill real product list and prices, the brand name, visit activities and opening times (`visit_info` rows), and replace the sample map row.
- Replace the draft chapter and Our Story copy with community-approved text.
- Set `VITE_GA_ID`, `VITE_LINE_OA_ID`, `VITE_FB_PAGE`, `VITE_PHONE` in Vercel and redeploy.
- Confirm domain and hosting budget.
